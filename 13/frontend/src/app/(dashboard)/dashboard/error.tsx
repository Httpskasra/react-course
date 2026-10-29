'use client';
export default function DashboardError({reset}:{error:Error;reset:()=>void}){return <div className="state-page"><h2>Couldn’t load the workspace</h2><p>Check whether the backend is running.</p><button onClick={reset} className="btn btn-primary">Retry</button></div>}
