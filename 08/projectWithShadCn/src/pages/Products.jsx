import { ProductCard } from "@/components/products/ProductCard"

export default function Products() {
  const products = [
    {
      id: 1,
      title: "لپ‌تاپ",
      category: "دیجیتال",
      description: "یک لپ‌تاپ مناسب برنامه‌نویسی",
      price: 45000000,
      image: "https://avatar.vercel.sh/laptop",
    },
    {
      id: 2,
      title: "موس",
      category: "لوازم جانبی",
      description: "موس بی‌سیم",
      price: 1200000,
      image: "https://dkstatics-public.digikala.com/digikala-products/8bdf40c747057250fa490d835fccf88da55962e6_1781521285.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/format,webp/quality,q_90",
    },
    {
      id: 2,
      title: "موس",
      category: "لوازم جانبی",
      description: "موس بی‌سیم",
      price: 1200000,
      image: "https://dkstatics-public.digikala.com/digikala-products/8bdf40c747057250fa490d835fccf88da55962e6_1781521285.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/format,webp/quality,q_90",
    },
    {
      id: 2,
      title: "موس",
      category: "لوازم جانبی",
      description: "موس بی‌سیم",
      price: 1200000,
      image: "https://dkstatics-public.digikala.com/digikala-products/8bdf40c747057250fa490d835fccf88da55962e6_1781521285.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/format,webp/quality,q_90",
    },
    {
      id: 2,
      title: "موس",
      category: "لوازم جانبی",
      description: "موس بی‌سیم",
      price: 1200000,
      image: "https://dkstatics-public.digikala.com/digikala-products/8bdf40c747057250fa490d835fccf88da55962e6_1781521285.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/format,webp/quality,q_90",
    },
    {
      id: 2,
      title: "موس",
      category: "لوازم جانبی",
      description: "موس بی‌سیم",
      price: 1200000,
      image: "https://dkstatics-public.digikala.com/digikala-products/8bdf40c747057250fa490d835fccf88da55962e6_1781521285.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/format,webp/quality,q_90",
    },
    {
      id: 2,
      title: "موس",
      category: "لوازم جانبی",
      description: "موس بی‌سیم",
      price: 1200000,
      image: "https://dkstatics-public.digikala.com/digikala-products/8bdf40c747057250fa490d835fccf88da55962e6_1781521285.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/format,webp/quality,q_90",
    },
    {
      id: 2,
      title: "موس",
      category: "لوازم جانبی",
      description: "موس بی‌سیم",
      price: 1200000,
      image: "https://dkstatics-public.digikala.com/digikala-products/8bdf40c747057250fa490d835fccf88da55962e6_1781521285.jpg?x-oss-process=image/resize,m_lfit,h_800,w_800/format,webp/quality,q_90",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  )
}