'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, ArrowUpRight, Menu, X } from 'lucide-react';
import { useState } from 'react';
export function SiteHeader() {
 const path = usePathname(); const [open,setOpen] = useState(false);
 return <header className="topbar"><div className="container header-inner"><Link href="/" className="brand"><span className="brand-icon">✳</span> ATELIER<span className="brand-light">NOVA</span><span className="brand-dot">.</span></Link><nav className={open ? 'nav-links open' : 'nav-links'}><Link className={path==='/'?'active':''} href="/" onClick={()=>setOpen(false)}>Home</Link><Link className={path.startsWith('/shop')?'active':''} href="/shop" onClick={()=>setOpen(false)}>Shop all</Link><Link href="/collections/living/modern" onClick={()=>setOpen(false)}>Collections</Link><Link href="/dashboard" onClick={()=>setOpen(false)}>Dashboard</Link></nav><div className="header-actions"><Link className="icon-button" href="/shop" aria-label="Search"><Search size={19}/></Link><Link className="icon-button" href="/dashboard/orders" aria-label="Orders"><ShoppingBag size={19}/><span className="indicator"/></Link><Link className="small-pill" href="/login">Account <ArrowUpRight size={15}/></Link><button className="menu-button" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button></div></div></header>;
}
