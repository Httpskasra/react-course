import { useState, type FormEvent } from "react";
import { useAppDispatch } from "../app/hooks";
import { login, saveDemoSession, type AuthUser } from "../feature/authSlice";

const DEMO_EMAIL = "student@example.com";
const DEMO_PASSWORD = "123456";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      setError("ایمیل یا رمز عبور صحیح نیست.");
      return;
    }
    const user: AuthUser = { id: "demo-user", name: "دانشجوی React", email: DEMO_EMAIL };
    saveDemoSession(user);
    dispatch(login(user));
  }

  return (
    <main className="content">
      <section className="hero-card login-card" dir="rtl">
        <div className="badge">Redux Toolkit + TypeScript</div>
        <h1>ورود به حساب</h1>
        <p>در این تمرین وضعیت ورود کاربر با Redux مدیریت می‌شود.</p>
        <form onSubmit={submit} className="login-form" noValidate>
          <label htmlFor="email">ایمیل</label>
          <input id="email" type="email" autoComplete="username" placeholder="ایمیل خود را وارد کنید" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label htmlFor="password">رمز عبور</label>
          <div className="password-field">
            <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "مخفی کردن رمز" : "نمایش رمز"}>{showPassword ? "مخفی" : "نمایش"}</button>
          </div>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="primary-button" type="submit">ورود به داشبورد</button>
        </form>
        <div className="demo-note">
          <strong>حساب آزمایشی برای تمرین</strong>
          <div>ایمیل: <code dir="ltr">{DEMO_EMAIL}</code></div>
          <div>رمز عبور: <code dir="ltr">{DEMO_PASSWORD}</code></div>
          <button type="button" onClick={() => { setEmail(DEMO_EMAIL); setPassword(DEMO_PASSWORD); setError(""); }}>پر کردن اطلاعات نمونه</button>
        </div>
      </section>
    </main>
  );
}
