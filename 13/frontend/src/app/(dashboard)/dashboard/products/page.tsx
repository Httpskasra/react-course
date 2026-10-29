import Link from 'next/link';
import Image from 'next/image';
import { Plus, ArrowUpRight } from 'lucide-react';
import { requireRole } from '@/lib/auth';
import { getProducts } from '@/lib/api';
import { money } from '@/lib/types';
export default async function Products(){await requireRole(['admin','manager']);const products=await getProducts();return <main className="dash-content"><div className="inner-heading heading-flex"><div><span className="section-kicker">CATALOG / PRODUCTS</span><h1>Curate the <em>collection.</em></h1><p>Make room for something wonderful.</p></div><Link href="/dashboard/products/new" className="btn btn-primary"><Plus size={18}/> New product</Link></div><div className="admin-products">{products.map(p=><div className="admin-product" key={p.id}><div className="admin-thumb"><Image src={p.image} fill sizes="72px" alt={p.name} className="cover-img"/></div><div className="admin-product-name"><strong>{p.name}</strong><span>{p.category}</span></div><strong>{money(p.price)}</strong><span className={p.stock?'stock-ok':'stock-none'}>{p.stock} in stock</span><Link href={`/shop/${p.id}`} aria-label="View product"><ArrowUpRight size={20}/></Link></div>)}</div></main>}
