'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useTransition } from 'react';
export function ShopFilter({ categories }: { categories: string[] }) {
 const params=useSearchParams(), path=usePathname(), router=useRouter(); const [pending,start]=useTransition();
 function set(key:string,value:string) {const p=new URLSearchParams(params.toString()); if(value)p.set(key,value);else p.delete(key);start(()=>router.replace(`${path}?${p.toString()}`));}
 return <div className="shop-controls"><div className="search-field"><Search size={19}/><input aria-label="Search products" placeholder="Search your next favorite..." defaultValue={params.get('q')||''} onChange={e=>set('q',e.target.value)}/></div><div className="filter-field"><SlidersHorizontal size={18}/><select aria-label="Filter category" value={params.get('category')||''} onChange={e=>set('category',e.target.value)}><option value="">All categories</option>{categories.map(c=><option value={c} key={c}>{c}</option>)}</select></div><select aria-label="Sort products" className="sort-field" value={params.get('sort')||'featured'} onChange={e=>set('sort',e.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option></select>{pending&&<span className="filter-spinner" aria-label="Filtering"/>}</div>;
}
