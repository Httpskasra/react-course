import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fullFormSchema } from "../schemas/formSchemas";
import FieldError from "../components/FieldError";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

export default function FullFormPage() {
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(fullFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      age: 18,
      birthDate: "",
      favoriteColor: "#22d3ee",
      gender: undefined,
      education: undefined,
      experience: 2,
      website: "",
      skills: [],
      employmentType: undefined,
      city: undefined,
      address: "",
      bio: "",
      contactMethod: undefined,
      remote: false,
      newsletter: false,
      terms: false,
    },
  });

  const experience = watch("experience");

  const onSubmit = async (data) => {
    setServerMessage("");

    const payload = {
      ...data,
      resume:
        data.resume && data.resume.length > 0
          ? {
              name: data.resume[0].name,
              size: data.resume[0].size,
              type: data.resume[0].type,
            }
          : null,
    };

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "خطا در ثبت اطلاعات");
      }

      setServerMessage(`اطلاعات با شناسه ${result.id} ثبت شد.`);
      reset();
    } catch (error) {
      setServerMessage(error.message);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
      <section className="form-card overflow-hidden">
        <header className="border-b border-white/10 bg-white/5 p-6 md:p-10">
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-200">
            صفحه اول
          </span>
          <h1 className="mt-4 text-3xl font-black md:text-5xl">فرم کامل با React Hook Form</h1>
          <p className="mt-4 max-w-3xl leading-8 text-slate-300">
            همه فیلدها در یک فرم هستند و اعتبارسنجی کامل با Zod انجام می‌شود.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 p-6 md:p-10">
          <section>
            <SectionTitle number="۱" title="اطلاعات شخصی" />
            <div className="grid gap-5 md:grid-cols-2">
              <InputField label="نام" error={errors.firstName?.message}>
                <input className="form-input" {...register("firstName")} />
              </InputField>

              <InputField label="نام خانوادگی" error={errors.lastName?.message}>
                <input className="form-input" {...register("lastName")} />
              </InputField>

              <InputField label="ایمیل" error={errors.email?.message}>
                <input
                  type="email"
                  dir="ltr"
                  className="form-input text-left"
                  {...register("email")}
                />
              </InputField>

              <InputField label="شماره موبایل" error={errors.phone?.message}>
                <input
                  type="tel"
                  dir="ltr"
                  className="form-input text-left"
                  {...register("phone")}
                />
              </InputField>

              <InputField label="رمز عبور" error={errors.password?.message}>
                <input
                  type="password"
                  dir="ltr"
                  className="form-input text-left"
                  {...register("password")}
                />
              </InputField>

              <InputField label="سن" error={errors.age?.message}>
                <input
                  type="number"
                  className="form-input"
                  {...register("age", { valueAsNumber: true })}
                />
              </InputField>

              <InputField label="تاریخ تولد" error={errors.birthDate?.message}>
                <input type="date" className="form-input" {...register("birthDate")} />
              </InputField>

              <InputField label="رنگ مورد علاقه" error={errors.favoriteColor?.message}>
                <input
                  type="color"
                  className="h-12 w-full cursor-pointer rounded-2xl border border-white/10 bg-slate-900/70 p-2"
                  {...register("favoriteColor")}
                />
              </InputField>
            </div>

            <fieldset className="mt-6">
              <legend className="form-label">جنسیت</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  ["male", "مرد"],
                  ["female", "زن"],
                  ["other", "سایر"],
                ].map(([value, label]) => (
                  <label key={value} className="choice-card">
                    <input
                      type="radio"
                      value={value}
                      className="accent-cyan-400"
                      {...register("gender")}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <FieldError message={errors.gender?.message} />
            </fieldset>
          </section>

          <section className="border-t border-white/10 pt-10">
            <SectionTitle number="۲" title="تحصیلات و مهارت‌ها" />

            <div className="grid gap-5 md:grid-cols-2">
              <InputField label="سطح تحصیلات" error={errors.education?.message}>
                <select className="form-input" {...register("education")}>
                  <option value="">انتخاب کنید</option>
                  <option value="diploma">دیپلم</option>
                  <option value="associate">کاردانی</option>
                  <option value="bachelor">کارشناسی</option>
                  <option value="master">کارشناسی ارشد</option>
                  <option value="phd">دکتری</option>
                </select>
              </InputField>

              <InputField
                label={`سابقه کار: ${experience} سال`}
                error={errors.experience?.message}
              >
                <input
                  type="range"
                  min="0"
                  max="20"
                  className="mt-4 w-full accent-cyan-400"
                  {...register("experience", { valueAsNumber: true })}
                />
              </InputField>

              <div className="md:col-span-2">
                <InputField label="وب‌سایت / Portfolio" error={errors.website?.message}>
                  <input
                    type="url"
                    dir="ltr"
                    placeholder="https://example.com"
                    className="form-input text-left"
                    {...register("website")}
                  />
                </InputField>
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="form-label">مهارت‌ها</legend>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {["html", "css", "javascript", "react"].map((skill) => (
                  <label key={skill} className="choice-card">
                    <input
                      type="checkbox"
                      value={skill}
                      className="accent-cyan-400"
                      {...register("skills")}
                    />
                    {skill.toUpperCase()}
                  </label>
                ))}
              </div>
              <FieldError message={errors.skills?.message} />
            </fieldset>

            <label className="mt-6 block">
              <span className="form-label">رزومه</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full rounded-2xl border border-dashed border-white/20 bg-slate-900/40 px-4 py-6 file:ml-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:font-bold file:text-slate-950"
                {...register("resume")}
              />
            </label>
          </section>

          <section className="border-t border-white/10 pt-10">
            <SectionTitle number="۳" title="شغل و ارتباط" />

            <div className="grid gap-5 md:grid-cols-2">
              <InputField label="نوع همکاری" error={errors.employmentType?.message}>
                <select className="form-input" {...register("employmentType")}>
                  <option value="">انتخاب کنید</option>
                  <option value="full-time">تمام‌وقت</option>
                  <option value="part-time">پاره‌وقت</option>
                  <option value="freelance">فریلنس</option>
                </select>
              </InputField>

              <InputField label="شهر" error={errors.city?.message}>
                <select className="form-input" {...register("city")}>
                  <option value="">انتخاب کنید</option>
                  <option value="tehran">تهران</option>
                  <option value="karaj">کرج</option>
                  <option value="isfahan">اصفهان</option>
                  <option value="shiraz">شیراز</option>
                  <option value="tabriz">تبریز</option>
                </select>
              </InputField>

              <div className="md:col-span-2">
                <InputField label="آدرس" error={errors.address?.message}>
                  <input className="form-input" {...register("address")} />
                </InputField>
              </div>

              <div className="md:col-span-2">
                <InputField label="درباره من" error={errors.bio?.message}>
                  <textarea rows="5" className="form-input resize-y" {...register("bio")} />
                </InputField>
              </div>
            </div>

            <fieldset className="mt-6">
              <legend className="form-label">روش تماس ترجیحی</legend>
              <div className="flex flex-wrap gap-3">
                {[
                  ["email", "ایمیل"],
                  ["phone", "تلفن"],
                ].map(([value, label]) => (
                  <label key={value} className="choice-card px-6 py-3">
                    <input
                      type="radio"
                      value={value}
                      className="accent-cyan-400"
                      {...register("contactMethod")}
                    />
                    {label}
                  </label>
                ))}
              </div>
              <FieldError message={errors.contactMethod?.message} />
            </fieldset>

            <div className="mt-6 grid gap-3">
              <ToggleRow label="امکان دورکاری" {...register("remote")} />
              <ToggleRow label="عضویت در خبرنامه" {...register("newsletter")} />
              <label className="flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <input
                  type="checkbox"
                  className="mt-1 h-5 w-5 accent-cyan-400"
                  {...register("terms")}
                />
                <span>قوانین و شرایط استفاده را می‌پذیرم.</span>
              </label>
              <FieldError message={errors.terms?.message} />
            </div>
          </section>

          {serverMessage && (
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-cyan-100">
              {serverMessage}
            </div>
          )}

          <div className="flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-2xl border border-white/10 px-6 py-3 font-bold text-slate-300 hover:bg-white/5"
            >
              پاک کردن
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-2xl bg-cyan-400 px-8 py-3 font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5 hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "در حال ارسال..." : "ثبت اطلاعات"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function InputField({ label, error, children }) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      {children}
      <FieldError message={error} />
    </label>
  );
}

function SectionTitle({ number, title }) {
  return (
    <div className="mb-6">
      <p className="text-sm font-bold text-cyan-300">بخش {number}</p>
      <h2 className="mt-1 text-2xl font-black">{title}</h2>
    </div>
  );
}

function ToggleRow({ label, ...inputProps }) {
  return (
    <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4">
      <strong>{label}</strong>
      <input type="checkbox" className="h-5 w-5 accent-cyan-400" {...inputProps} />
    </label>
  );
}
