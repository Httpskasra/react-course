import { z } from "zod";

const phoneRegex = /^09\d{9}$/;

const optionalUrl = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || /^https?:\/\/.+/i.test(value),
    "آدرس وب‌سایت باید با http:// یا https:// شروع شود"
  );

export const fullFormSchema = z.object({
  firstName: z.string().trim().min(2, "نام حداقل ۲ کاراکتر باشد"),
  lastName: z.string().trim().min(2, "نام خانوادگی حداقل ۲ کاراکتر باشد"),
  email: z.string().trim().email("ایمیل معتبر نیست"),
  phone: z.string().trim().regex(phoneRegex, "شماره موبایل باید ۱۱ رقم و با 09 شروع شود"),
  password: z
    .string()
    .min(8, "رمز عبور حداقل ۸ کاراکتر باشد")
    .regex(/[A-Za-z]/, "رمز عبور باید حداقل یک حرف داشته باشد")
    .regex(/\d/, "رمز عبور باید حداقل یک عدد داشته باشد"),
  age: z.coerce
    .number({ error: "سن را وارد کنید" })
    .min(16, "حداقل سن ۱۶ سال است")
    .max(80, "حداکثر سن ۸۰ سال است"),
  birthDate: z.string().min(1, "تاریخ تولد را انتخاب کنید"),
  favoriteColor: z.string().min(1),
  gender: z.enum(["male", "female", "other"], {
    error: "جنسیت را انتخاب کنید",
  }),
  education: z.enum(["diploma", "associate", "bachelor", "master", "phd"], {
    error: "سطح تحصیلات را انتخاب کنید",
  }),
  experience: z.coerce.number().min(0).max(20),
  website: optionalUrl,
  skills: z.array(z.string()).min(2, "حداقل ۲ مهارت انتخاب کنید"),
  resume: z.any().optional(),
  employmentType: z.enum(["full-time", "part-time", "freelance"], {
    error: "نوع همکاری را انتخاب کنید",
  }),
  city: z.enum(["tehran", "karaj", "isfahan", "shiraz", "tabriz"], {
    error: "شهر را انتخاب کنید",
  }),
  address: z.string().trim().min(10, "آدرس حداقل ۱۰ کاراکتر باشد"),
  bio: z
    .string()
    .trim()
    .min(30, "درباره من حداقل ۳۰ کاراکتر باشد")
    .max(500, "حداکثر ۵۰۰ کاراکتر"),
  contactMethod: z.enum(["email", "phone"], {
    error: "روش تماس را انتخاب کنید",
  }),
  remote: z.boolean(),
  newsletter: z.boolean(),
  terms: z.boolean().refine((value) => value === true, "پذیرش قوانین الزامی است"),
});

export const wizardSchema = z.object({
  firstName: z.string().trim().min(2, "نام حداقل ۲ کاراکتر باشد"),
  lastName: z.string().trim().min(2, "نام خانوادگی حداقل ۲ کاراکتر باشد"),
  email: z.string().trim().email("ایمیل معتبر نیست"),
  phone: z.string().trim().regex(phoneRegex, "شماره موبایل معتبر نیست"),
  age: z.coerce.number().min(16, "حداقل سن ۱۶ سال است").max(80, "حداکثر سن ۸۰ سال است"),
  gender: z.enum(["male", "female", "other"], {
    error: "جنسیت را انتخاب کنید",
  }),
  education: z.enum(["diploma", "associate", "bachelor", "master", "phd"], {
    error: "تحصیلات را انتخاب کنید",
  }),
  skills: z.array(z.string()).min(2, "حداقل ۲ مهارت انتخاب کنید"),
  experience: z.coerce.number().min(0).max(20),
  employmentType: z.enum(["full-time", "part-time", "freelance"], {
    error: "نوع همکاری را انتخاب کنید",
  }),
  city: z.enum(["tehran", "karaj", "isfahan", "shiraz", "tabriz"], {
    error: "شهر را انتخاب کنید",
  }),
  website: optionalUrl,
  bio: z.string().trim().min(30, "حداقل ۳۰ کاراکتر درباره خودتان بنویسید"),
  remote: z.boolean(),
  newsletter: z.boolean(),
  terms: z.boolean().refine((value) => value === true, "پذیرش قوانین الزامی است"),
});
