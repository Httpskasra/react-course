import { useDispatch, useSelector } from "react-redux";
import ThemeStatus from "../components/ThemeStatus";
import { RootState } from "../app/store";
import { logout } from "../feature/authSlice";

export default function MainPage() {
  const userForShow = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();

  return (
    <main className="content">
      <h1>{userForShow}</h1>
      <button onClick={() => dispatch(logout())}>click me </button>
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
