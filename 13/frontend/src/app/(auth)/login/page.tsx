import Link from "next/link";
import { LoginForm } from "@/components/login-form";
export default function Login() {
  return (
    <main className="auth-layout">
      <Link href="/" className="brand auth-brand">
        <span className="brand-icon">✳</span> ATELIER
        <span className="brand-light">NOVA</span>.
      </Link>
      <div className="auth-card">
        <div className="auth-symbol">✳</div>
        <span className="section-kicker">YOUR SPACE STARTS HERE</span>
        <h1>
          Welcome <em>back.</em>
        </h1>
        <p>Sign in to access your curated experience.</p>
        <LoginForm />
        <div className="demo-hint">
          Demo roles: admin@nova.test, manager@nova.test, staff@nova.test,
          customer@nova.test — password <code>demo1234</code>
        </div>
        <Link href="/" className="back-link">
          ← Back to the store
        </Link>
      </div>
    </main>
  );
}
