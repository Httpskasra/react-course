import http from "node:http";
import { readFile, writeFile, rename } from "node:fs/promises";
import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 4001);
const ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
const SECRET = process.env.TOKEN_SECRET || "DEV_ONLY_CHANGE_BEFORE_DEPLOYMENT";
if (
  process.env.NODE_ENV === "production" &&
  SECRET === "DEV_ONLY_CHANGE_BEFORE_DEPLOYMENT"
)
  throw new Error("Set TOKEN_SECRET before production deployment");
const allowedStatus = new Set([
  "pending",
  "processing",
  "shipped",
  "delivered",
]);
const canManageProducts = new Set(["admin", "manager"]);
const canManageOrders = new Set(["admin", "manager", "staff"]);
async function read(collection) {
  return JSON.parse(
    await readFile(path.join(ROOT, "data", collection + ".json"), "utf8"),
  );
}
const queues = new Map();
// Serialize writes within each collection; a DB is required for multi-process deployments.
function mutate(collection, updater) {
  const last = queues.get(collection) || Promise.resolve();
  const next = last
    .catch(() => {})
    .then(async () => {
      const original = await read(collection);
      const result = await updater(original);
      const temp = path.join(ROOT, "data", `${collection}.${randomUUID()}.tmp`);
      await writeFile(temp, JSON.stringify(original, null, 2) + "\n");
      await rename(temp, path.join(ROOT, "data", collection + ".json"));
      return result;
    });
  queues.set(collection, next);
  return next;
}
function base64url(value) {
  return Buffer.from(value).toString("base64url");
}
function sign(value) {
  return createHmac("sha256", SECRET).update(value).digest("base64url");
}
function tokenFor(user) {
  const payload = base64url(
    JSON.stringify({
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 12 * 3600,
    }),
  );
  return payload + "." + sign(payload);
}
function verify(token) {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = sign(body);
  const a = Buffer.from(sig || "");
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const decoded = JSON.parse(Buffer.from(body, "base64url").toString());
    return decoded.exp > Date.now() / 1000 ? decoded.sub : null;
  } catch {
    return null;
  }
}
async function auth(req) {
  const id = verify(
    req.headers.authorization?.replace(/^Bearer\s+/i, "") || "",
  );
  if (!id) return null;
  return (await read("users")).find((u) => u.id === id) || null;
}
function publicUser(u) {
  const { password, ...safe } = u;
  return safe;
}
function respond(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": ORIGIN,
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    Vary: "Origin",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(data));
}
async function body(req) {
  let text = "";
  for await (const chunk of req) {
    text += chunk;
    if (text.length > 250_000) throw Error("Payload too large");
  }
  try {
    return JSON.parse(text);
  } catch {
    throw Error("Invalid JSON");
  }
}
function validProduct(p) {
  return (
    p &&
    typeof p.name === "string" &&
    p.name.trim().length >= 2 &&
    typeof p.category === "string" &&
    p.category.trim().length >= 2 &&
    Number.isFinite(p.price) &&
    p.price > 0 &&
    Number.isInteger(p.stock) &&
    p.stock >= 0 &&
    typeof p.description === "string" &&
    p.description.length >= 3 &&
    typeof p.image === "string" &&
    /^https:\/\//.test(p.image)
  );
}
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://localhost:${PORT}`);
    const pathname = url.pathname;
    const method = req.method;
    if (method === "OPTIONS") return respond(res, 204, {});
    if (method === "GET" && pathname === "/api/health")
      return respond(res, 200, { ok: true });
    if (method === "POST" && pathname === "/api/auth/login") {
      const data = await body(req);
      const user = (await read("users")).find(
        (u) => u.email === data.email && u.password === data.password,
      );
      return user ?
          respond(res, 200, { token: tokenFor(user), user: publicUser(user) })
        : respond(res, 401, { error: "Invalid credentials" });
    }
    if (method === "GET" && pathname === "/api/auth/me") {
      const user = await auth(req);
      return user ?
          respond(res, 200, publicUser(user))
        : respond(res, 401, { error: "Unauthorized" });
    }
    if (method === "GET" && pathname === "/api/products") {
      const products = await read("products");
      return respond(
        res,
        200,
        url.searchParams.get("featured") === "1" ?
          products.filter((p) => p.featured)
        : products,
      );
    }
    const productPath = pathname.match(/^\/api\/products\/([^/]+)$/);
    if (method === "GET" && productPath) {
      const found = (await read("products")).find(
        (p) => p.id === decodeURIComponent(productPath[1]),
      );
      return respond(res, found ? 200 : 404, found || { error: "Not found" });
    }
    const user = await auth(req);
    if (!user) return respond(res, 401, { error: "Unauthorized" });
    if (method === "GET" && pathname === "/api/users") {
      if (user.role !== "admin")
        return respond(res, 403, { error: "Forbidden" });
      return respond(res, 200, (await read("users")).map(publicUser));
    }
    if (method === "POST" && pathname === "/api/products") {
      if (!canManageProducts.has(user.role))
        return respond(res, 403, { error: "Forbidden" });
      const data = await body(req);
      if (!validProduct(data))
        return respond(res, 400, { error: "Invalid product" });
      const record = {
        id: randomUUID(),
        name: data.name.trim(),
        category: data.category.trim(),
        price: data.price,
        description: data.description,
        stock: data.stock,
        image: data.image,
        color: data.color || "#e0e5df",
        rating: 5,
        featured: false,
      };
      await mutate("products", (list) => {
        list.unshift(record);
      });
      return respond(res, 201, record);
    }
    if (method === "GET" && pathname === "/api/orders") {
      const orders = await read("orders");
      return respond(
        res,
        200,
        user.role === "customer" ?
          orders.filter((o) => o.email === user.email)
        : orders,
      );
    }
    if (method === "POST" && pathname === "/api/orders") {
      const data = await body(req);
      if (
        !Array.isArray(data.items) ||
        data.items.length < 1 ||
        data.items.length > 20 ||
        data.items.some(
          (i) =>
            typeof i.id !== "string" ||
            !Number.isInteger(i.quantity) ||
            i.quantity < 1 ||
            i.quantity > 10,
        )
      )
        return respond(res, 400, { error: "Invalid items" });
      let order;
      await mutate("products", (products) => {
        let total = 0;
        for (const item of data.items) {
          const product = products.find((p) => p.id === item.id);
          if (!product || product.stock < item.quantity)
            throw Error("Insufficient stock");
          total += product.price * item.quantity;
        }
        for (const item of data.items)
          products.find((p) => p.id === item.id).stock -= item.quantity;
        order = {
          id: randomUUID(),
          customer: user.name,
          email: user.email,
          total,
          status: "pending",
          date: new Date().toISOString().slice(0, 10),
          items: data.items,
        };
      });
      await mutate("orders", (list) => {
        list.unshift(order);
      });
      return respond(res, 201, order);
    }
    const orderPath = pathname.match(/^\/api\/orders\/([^/]+)$/);
    if (method === "PATCH" && orderPath) {
      if (!canManageOrders.has(user.role))
        return respond(res, 403, { error: "Forbidden" });
      const data = await body(req);
      if (!allowedStatus.has(data.status))
        return respond(res, 400, { error: "Invalid status" });
      let found = null;
      await mutate("orders", (list) => {
        found = list.find((o) => o.id === decodeURIComponent(orderPath[1]));
        if (found) found.status = data.status;
      });
      return respond(res, found ? 200 : 404, found || { error: "Not found" });
    }
    return respond(res, 404, { error: "Route not found" });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    console.error("[API]", message);
    return respond(
      res,
      /Invalid|Insufficient|large/i.test(message) ? 400 : 500,
      { error: message },
    );
  }
});
server.listen(PORT, () =>
  console.log(`Atelier Nova JSON API listening at http://localhost:${PORT}`),
);
