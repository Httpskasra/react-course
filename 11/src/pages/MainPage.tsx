import ThemeStatus from "../components/ThemeStatus";
import { useTheme } from "../context/ThemeContext";
export default function MainPage() {
  return (
    <main className="content">
      <section className="hero-card">
        <div className="badge">React Context</div>

        <h1>Light / Dark Theme</h1>

        <p>
          این پروژه نشان می‌دهد چگونه با Context و TypeScript یک State مشترک
          برای Theme بسازیم و بدون Prop Drilling در چند Component از آن استفاده
          کنیم.
        </p>

        <ThemeStatus />

        <div className="flow">
          <div>
            <span>1</span>
            <strong>State</strong>
            <small>theme داخل ThemeProvider</small>
          </div>

          <div>
            <span>2</span>
            <strong>Context</strong>
            <small>اشتراک theme و toggleTheme</small>
          </div>

          <div>
            <span>3</span>
            <strong>useTheme</strong>
            <small>دریافت اطلاعات در Componentها</small>
          </div>
        </div>
      </section>
    </main>
  );
}
