import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FieldError from "../components/FieldError";
import StepProgress from "../components/StepProgress";
import { useFormDraft } from "../context/FormDraftContext";
import { wizardSchema } from "../schemas/formSchemas";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8787";

const steps = ["اطلاعات پایه", "مهارت‌ها", "شغل و شهر", "توضیحات", "مرور نهایی"];

const fieldsByStep = [
  ["firstName", "lastName", "email", "phone", "age", "gender"],
  ["education", "skills", "experience"],
  ["employmentType", "city", "website", "remote"],
  ["bio", "newsletter", "terms"],
  [],
];

export default function MultiStepFormPage() {
  const { draft, setDraft, clearDraft } = useFormDraft();
  const [currentStep, setCurrentStep] = useState(0);
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(wizardSchema),
    defaultValues: draft,
    mode: "onTouched",
  });

  useEffect(() => {
    const subscription = watch((values) => {
      setDraft((current) => ({ ...current, ...values }));
    });

    return () => subscription.unsubscribe();
  }, [watch, setDraft]);

  const values = watch();

  const nextStep = async () => {
    const fields = fieldsByStep[currentStep];
    const isValid = await trigger(fields);

    if (!isValid) return;

    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previousStep = () => {
    setCurrentStep((step) => Math.max(step - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    clearDraft();
    reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      age: 18,
      gender: undefined,
      education: undefined,
      skills: [],
      experience: 0,
      employmentType: undefined,
      city: undefined,
      website: "",
      bio: "",
      remote: false,
      newsletter: false,
      terms: false,
    });
    setCurrentStep(0);
    setServerMessage("");
  };

  const onSubmit = async (data) => {
    setServerMessage("");

    try {
      const response = await fetch(`${API_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "wizard" }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "ثبت فرم با خطا مواجه شد");
      }

      setServerMessage(`فرم با موفقیت ثبت شد. شناسه: ${result.id}`);
      clearDraft();
    } catch (error) {
      setServerMessage(error.message);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 md:py-14">
      <section className="form-card overflow-hidden">
        <header className="border-b border-white/10 bg-white/5 p-6 md:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-flex rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-sm font-bold text-indigo-200">
                صفحه دوم
              </span>
              <h1 className="mt-4 text-3xl font-black md:text-4xl">فرم چندمرحله‌ای</h1>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 px-4 py-3 text-left" dir="ltr">
              <p className="text-xs text-slate-500">localStorage</p>
              <p className="mt-1 text-sm font-black text-cyan-300">Auto Save: ON</p>
            </div>
          </div>

          <p className="mt-4 leading-8 text-slate-300">
            اطلاعات هر تغییر از طریق Context ذخیره می‌شود و Context آن را در localStorage نگه می‌دارد.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-10">
          <StepProgress currentStep={currentStep} steps={steps} />

          {currentStep === 0 && (
            <StepCard title="اطلاعات پایه" description="اطلاعات هویتی و راه ارتباطی را وارد کنید.">
              <div className="grid gap-5 md:grid-cols-2">
                <InputField label="نام" error={errors.firstName?.message}>
                  <input className="form-input" {...register("firstName")} />
                </InputField>

                <InputField label="نام خانوادگی" error={errors.lastName?.message}>
                  <input className="form-input" {...register("lastName")} />
                </InputField>

                <InputField label="ایمیل" error={errors.email?.message}>
                  <input type="email" dir="ltr" className="form-input text-left" {...register("email")} />
                </InputField>

                <InputField label="شماره موبایل" error={errors.phone?.message}>
                  <input type="tel" dir="ltr" className="form-input text-left" {...register("phone")} />
                </InputField>

                <InputField label="سن" error={errors.age?.message}>
                  <input type="number" className="form-input" {...register("age", { valueAsNumber: true })} />
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
                      <input type="radio" value={value} className="accent-cyan-400" {...register("gender")} />
                      {label}
                    </label>
                  ))}
                </div>
                <FieldError message={errors.gender?.message} />
              </fieldset>
            </StepCard>
          )}

          {currentStep === 1 && (
            <StepCard title="تحصیلات و مهارت‌ها" description="این مرحله آرایه checkbox و range را تمرین می‌کند.">
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

              <fieldset className="mt-6">
                <legend className="form-label">مهارت‌ها</legend>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {["html", "css", "javascript", "react"].map((skill) => (
                    <label key={skill} className="choice-card">
                      <input type="checkbox" value={skill} className="accent-cyan-400" {...register("skills")} />
                      {skill.toUpperCase()}
                    </label>
                  ))}
                </div>
                <FieldError message={errors.skills?.message} />
              </fieldset>

              <div className="mt-6">
                <InputField label={`سابقه: ${values.experience ?? 0} سال`} error={errors.experience?.message}>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    className="mt-3 w-full accent-cyan-400"
                    {...register("experience", { valueAsNumber: true })}
                  />
                </InputField>
              </div>
            </StepCard>
          )}

          {currentStep === 2 && (
            <StepCard title="شغل و محل زندگی" description="select، URL و checkbox در این مرحله قرار دارند.">
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

              <label className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <span>
                  <strong className="block">تمایل به دورکاری</strong>
                  <small className="mt-1 block text-slate-400">Remote opportunity</small>
                </span>
                <input type="checkbox" className="h-5 w-5 accent-cyan-400" {...register("remote")} />
              </label>
            </StepCard>
          )}

          {currentStep === 3 && (
            <StepCard title="توضیحات و قوانین" description="آخرین مرحله ورود اطلاعات قبل از مرور نهایی.">
              <InputField label="درباره من" error={errors.bio?.message}>
                <textarea rows="7" className="form-input resize-y leading-7" {...register("bio")} />
              </InputField>

              <label className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <strong>عضویت در خبرنامه</strong>
                <input type="checkbox" className="h-5 w-5 accent-cyan-400" {...register("newsletter")} />
              </label>

              <label className="mt-3 flex items-start gap-3 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <input type="checkbox" className="mt-1 h-5 w-5 accent-cyan-400" {...register("terms")} />
                <span>قوانین و شرایط استفاده را مطالعه کرده‌ام و می‌پذیرم.</span>
              </label>
              <FieldError message={errors.terms?.message} />
            </StepCard>
          )}

          {currentStep === 4 && (
            <StepCard title="مرور نهایی" description="قبل از ارسال، داده‌های جمع‌آوری‌شده را بررسی کنید.">
              <div className="grid gap-3 md:grid-cols-2">
                <ReviewItem label="نام" value={`${values.firstName || "-"} ${values.lastName || ""}`} />
                <ReviewItem label="ایمیل" value={values.email} />
                <ReviewItem label="موبایل" value={values.phone} />
                <ReviewItem label="سن" value={values.age} />
                <ReviewItem label="تحصیلات" value={values.education} />
                <ReviewItem label="مهارت‌ها" value={(values.skills || []).join("، ")} />
                <ReviewItem label="نوع همکاری" value={values.employmentType} />
                <ReviewItem label="شهر" value={values.city} />
                <ReviewItem label="دورکاری" value={values.remote ? "بله" : "خیر"} />
                <ReviewItem label="خبرنامه" value={values.newsletter ? "بله" : "خیر"} />
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                <p className="text-xs font-bold text-slate-500">درباره من</p>
                <p className="mt-2 leading-7 text-slate-200">{values.bio || "-"}</p>
              </div>
            </StepCard>
          )}

          {serverMessage && (
            <div className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-cyan-100">
              {serverMessage}
            </div>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={restart}
              className="rounded-2xl border border-rose-400/20 px-5 py-3 font-bold text-rose-300 hover:bg-rose-400/5"
            >
              حذف Draft و شروع مجدد
            </button>

            <div className="flex gap-3">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={previousStep}
                  className="rounded-2xl border border-white/10 px-6 py-3 font-bold hover:bg-white/5"
                >
                  قبلی
                </button>
              )}

              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="rounded-2xl bg-cyan-400 px-7 py-3 font-black text-slate-950 hover:bg-cyan-300"
                >
                  مرحله بعد
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-cyan-400 px-7 py-3 font-black text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
                >
                  {isSubmitting ? "در حال ارسال..." : "ارسال نهایی"}
                </button>
              )}
            </div>
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

function StepCard({ title, description, children }) {
  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-black">{title}</h2>
        <p className="mt-2 text-sm leading-7 text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

function ReviewItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="mt-2 break-words font-bold text-slate-200">{value || "-"}</p>
    </div>
  );
}
