import ThemeStatus from "../components/ThemeStatus";
import { useAppSelector } from "../app/hooks";

export default function MainPage() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <main className="content">
      <section className="hero-card">
        <div className="badge">React Context + Redux Toolkit</div>
        <h1>خوش آمدی، {user?.name}!</h1>
        <p>با موفقیت وارد شدی. اطلاعات کاربر در Redux نگهداری می‌شود؛ انتخاب تم همچنان توسط React Context مدیریت می‌شود.</p>
        <div className="user-info" dir="rtl"><strong>کاربر فعلی</strong><span>{user?.email}</span><small>با رفرش صفحه، وضعیت ورود آزمایشی حفظ می‌شود.</small></div>
        <ThemeStatus />
        <div className="flow">
          <div><span>1</span><strong>Local State</strong><small>مقدار فیلدهای فرم ورود</small></div>
          <div><span>2</span><strong>Redux</strong><small>مدیریت user و isAuth و اکشن‌های login/logout</small></div>
          <div><span>3</span><strong>Context</strong><small>اشتراک Theme در همه کامپوننت‌ها</small></div>
        </div>
      </section>
    </main>
  );
}
