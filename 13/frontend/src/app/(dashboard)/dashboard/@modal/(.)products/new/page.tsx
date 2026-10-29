import Link from "next/link";
import { X } from "lucide-react";
import { ProductForm } from "@/components/product-form";
import { requireRole } from "@/lib/auth";
export default async function NewProductModal() {
  await requireRole(["admin", "manager"]);
  return (
    <div className="modal-scrim">
      <div className="modal-card">
        <div className="modal-title">
          <h2>Add a new piece</h2>
          <Link href="/dashboard/products" aria-label="Close">
            <X size={21} />
          </Link>
        </div>
        <ProductForm />
      </div>
    </div>
  );
}
