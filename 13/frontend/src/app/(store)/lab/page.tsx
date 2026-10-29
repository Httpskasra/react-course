import { getProducts } from '@/lib/api';
import { InteractiveProducts } from '@/components/interactive-products';
export default async function Lab(){const products=await getProducts();return <main className="container shop-page"><div className="page-heading"><span className="section-kicker">EDUCATIONAL EXAMPLE</span><h1>Server to <em>client.</em></h1><p>Server prefetched data becomes initialData for TanStack Query. For production-grade dehydrated state, see the companion guide.</p></div><InteractiveProducts initial={products}/></main>}
