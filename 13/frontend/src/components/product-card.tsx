'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ArrowUpRight, Star } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { money, type Product } from '@/lib/types';
export function ProductCard({ product, index=0 }: { product: Product; index?: number }) {
 const [liked, setLiked] = useState(false);
 return <motion.article className="product-card" initial={{ opacity: 0, y: 24 }} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:Math.min(index*.07,.35)}} whileHover={{y:-8}}>
  <div className="product-image" style={{backgroundColor: product.color}}><Link href={`/shop/${product.id}`} className="image-link"><Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 25vw" className="cover-img"/></Link>{product.badge&&<span className="product-badge">{product.badge}</span>}<button aria-label="Toggle favorite" className={`heart-button ${liked?'liked':''}`} onClick={()=>setLiked(!liked)}><Heart size={18} fill={liked?'currentColor':'none'}/></button></div>
  <div className="product-caption"><div><span className="eyebrow">{product.category}</span><Link href={`/shop/${product.id}`}><h3>{product.name}</h3></Link></div><Link href={`/shop/${product.id}`} className="product-go" aria-label={`View ${product.name}`}><ArrowUpRight size={20}/></Link></div><div className="price-line"><strong>{money(product.price)}</strong>{product.oldPrice&&<del>{money(product.oldPrice)}</del>}<span className="rating"><Star size={13} fill="currentColor"/> {product.rating.toFixed(1)}</span></div>
 </motion.article>;
}
