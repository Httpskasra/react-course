'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createProductAction } from '@/app/actions';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoaderCircle, Plus } from 'lucide-react';
const schema=z.object({name:z.string().min(2),category:z.string().min(2),description:z.string().min(3),price:z.coerce.number<number>().positive(),stock:z.coerce.number<number>().int().nonnegative(),image:z.url(),color:z.string()});
type Values=z.infer<typeof schema>;
function Submit(){const {pending}=useFormStatus();return <button className="btn btn-primary" type="submit" disabled={pending}>{pending?<LoaderCircle className="spin" size={17}/>:<Plus size={17}/>} Add product</button>}
export function ProductForm(){const [state,action]=useActionState(createProductAction,{});const {register,formState:{errors}}=useForm<z.input<typeof schema>, unknown, Values>({resolver:zodResolver(schema),defaultValues:{name:'',category:'Lighting',description:'',price:120,stock:12,image:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=85',color:'#e2e5df'}});return <form action={action} className="admin-form"><div className="form-grid"><label>Product name<input {...register('name')} required placeholder="Sculptural table lamp"/>{errors.name&&<small>{errors.name.message}</small>}</label><label>Category<input {...register('category')} required/></label><label>Price ($)<input {...register('price')} type="number" min="1" required/></label><label>Stock<input {...register('stock')} type="number" min="0" required/></label><label className="wide">Image URL<input {...register('image')} type="url" required/></label><label className="wide">Description<textarea {...register('description')} rows={3} required/></label><label>Background color<input {...register('color')} type="color"/></label></div>{state.error&&<p className="form-error">{state.error}</p>}{state.success&&<p className="form-success">{state.success}</p>}<Submit/></form>}
