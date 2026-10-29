"use client";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";
export function InteractiveProducts({ initial }: { initial: Product[] }) {
  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const r = await fetch("/api/products");
      if (!r.ok) throw new Error("Network issue");
      return r.json() as Promise<Product[]>;
    },
    initialData: initial,
    staleTime: 60_000,
  });
  return (
    <>
      <div className="query-strip">
        <span>
          {isFetching ?
            "Refreshing collection..."
          : "TanStack Query hydrated with server data"}
        </span>
        <button onClick={() => refetch()}>Refresh client cache ↻</button>
      </div>
      {error && <p role="alert">Unable to refresh products.</p>}
      <div className="products-grid">
        {data?.slice(0, 4).map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </>
  );
}
