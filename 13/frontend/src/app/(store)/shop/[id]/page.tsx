import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Check, Truck, RotateCcw } from 'lucide-react';
import { getProduct } from '@/lib/api';
import { money } from '@/lib/types';
import { OrderButton } from '@/components/order-button';
export async function generateMetadata({params}:{params:Promise<{id:string}>}){const {id}=await params;const product=await getProduct(id);return {title:product?.name||'Product not found',description:product?.description}}
export default async function ProductPage({params}:{params:Promise<{id:string}>}){const {id}=await params;const product=await getProduct(id);if(!product)notFound();return <main className="container detail-page"><Link href="/shop" className="back-link"><ArrowLeft size={17}/> Back to collection</Link><div className="detail-grid"><div className="detail-photo" style={{background:product.color}}><Image src={product.image} alt={product.name} fill priority sizes="(max-width:900px) 100vw, 50vw" className="cover-img"/></div><div className="detail-content"><span className="section-kicker">{product.category.toUpperCase()} / THE COLLECTION</span><h1>{product.name}</h1><span className="detail-price">{money(product.price)}</span><p>{product.description}</p><div className="detail-line"/><div className="availability"><Check size={18}/> {product.stock>0?'In stock and ready to ship':'Currently unavailable'}</div>{product.stock>0&&<OrderButton id={product.id}/>}<div className="detail-benefits"><span><Truck size={19}/> Worldwide delivery</span><span><RotateCcw size={19}/> 30-day returns</span></div></div></div></main>}
