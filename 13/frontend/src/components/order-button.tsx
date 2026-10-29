"use client";
import { useActionState, useOptimistic, useState } from "react";
import { useFormStatus } from "react-dom";
import { createOrderAction } from "@/app/actions";
import { Minus, Plus, ShoppingBag } from "lucide-react";
function Button() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" disabled={pending} type="submit">
      {pending ?
        "Adding to order..."
      : <>
          Buy now <ShoppingBag size={18} />
        </>
      }
    </button>
  );
}
export function OrderButton({ id }: { id: string }) {
  const [qty, setQty] = useState(1);
  const [optimistic, setOptimistic] = useOptimistic(
    qty,
    (_state, next: number) => next,
  );
  const [state, action] = useActionState(createOrderAction, {});
  return (
    <form action={action} className="purchase-row">
      <input type="hidden" name="productId" value={id} />
      <input type="hidden" name="quantity" value={optimistic} />
      <div className="quantity-picker">
        <button
          type="button"
          onClick={() => {
            const n = Math.max(1, qty - 1);
            setQty(n);
            setOptimistic(n);
          }}
          aria-label="Decrease">
          <Minus size={16} />
        </button>
        <strong>{optimistic}</strong>
        <button
          type="button"
          onClick={() => {
            const n = Math.min(10, qty + 1);
            setQty(n);
            setOptimistic(n);
          }}
          aria-label="Increase">
          <Plus size={16} />
        </button>
      </div>
      <Button />
      {state.error && <p className="form-error">{state.error}</p>}
    </form>
  );
}
