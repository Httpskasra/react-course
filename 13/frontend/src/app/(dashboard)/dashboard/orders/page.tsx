import { requireRole } from "@/lib/auth";
import { getOrders } from "@/lib/api";
import { updateOrderAction } from "@/app/actions";
import { money } from "@/lib/types";
export default async function Orders() {
  const { token, user } = await requireRole([
    "admin",
    "manager",
    "staff",
    "customer",
  ]);
  const orders = await getOrders(token);
  return (
    <main className="dash-content">
      <div className="inner-heading">
        <span className="section-kicker">OPERATIONS / ORDERS</span>
        <h1>
          Order <em>management.</em>
        </h1>
        <p>Keep the experience moving beautifully.</p>
      </div>
      <section className="dash-card data-panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ORDER</th>
                <th>CUSTOMER</th>
                <th>DATE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <strong>#{o.id.slice(0, 8)}</strong>
                  </td>
                  <td>
                    {o.customer}
                    <small>{o.email}</small>
                  </td>
                  <td>{o.date}</td>
                  <td>{money(o.total)}</td>
                  <td>
                    {user.role === "customer" ?
                      <span className={`status status-${o.status}`}>
                        {o.status}
                      </span>
                    : <form action={updateOrderAction} className="status-form">
                        <input type="hidden" name="id" value={o.id} />
                        <select
                          aria-label={`Update ${o.id} status`}
                          name="status"
                          defaultValue={o.status}>
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <button type="submit">Save</button>
                      </form>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="empty-state">There are no orders to show yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
