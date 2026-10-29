import { NextResponse } from "next/server";
import { getProducts } from "@/lib/api";
export async function GET() {
  try {
    return NextResponse.json(await getProducts());
  } catch {
    return NextResponse.json({ error: "API unavailable" }, { status: 503 });
  }
}
