'use client';
import { useEffect } from 'react';
export default function ErrorPage({error,reset}:{error:Error&{digest?:string};reset:()=>void}){useEffect(()=>console.error(error),[error]);return <main className="state-page"><span className="big-mark">!</span><h1>Something went sideways.</h1><p>We couldn’t load this view right now.</p><button className="btn btn-primary" onClick={reset}>Try again</button></main>}
