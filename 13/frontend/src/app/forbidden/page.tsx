import Link from 'next/link';
export default function Forbidden(){return <main className="state-page"><span className="big-mark">403</span><h1>Access is limited.</h1><p>Your role doesn’t have permission to view this page.</p><Link href="/dashboard" className="btn btn-primary">Go to dashboard →</Link></main>}
