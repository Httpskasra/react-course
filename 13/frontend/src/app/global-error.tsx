'use client';
export default function GlobalError({reset}:{error:Error;reset:()=>void}){return <html lang="en"><body><main style={{padding:'15vh 10%',fontFamily:'sans-serif'}}><h1>Unexpected error</h1><p>Something went wrong with the application.</p><button onClick={reset}>Reload application</button></main></body></html>}
