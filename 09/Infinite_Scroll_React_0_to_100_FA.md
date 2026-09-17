# آموزش صفر تا صد Infinite Scroll در React

> این جزوه بر اساس پروژه‌ی **React Data Explorer** شما نوشته شده است؛ یعنی از همان فایل فعلی `src/pages/InfiniteScrollPage.jsx` که فقط UI استاتیک دارد شروع می‌کنیم و قدم‌به‌قدم آن را به Infinite Scroll واقعی با API تبدیل می‌کنیم.
>
> هدف این فایل این است که بتوانید تقریباً **مستقیماً از روی همین متن تدریس کنید**. ترتیب مطالب از پایه انتخاب شده است و مفاهیم JavaScript، React Hooks، API، `useRef`، `useEffect`، `useCallback`، `Map`، `IntersectionObserver`، جلوگیری از درخواست‌های تکراری، مدیریت Loading/Error و نکات مهم Debug را پوشش می‌دهد.

---

## فهرست مطالب

1. وضعیت فعلی پروژه
2. Infinite Scroll چیست؟
3. قبل از کدنویسی چه چیزهایی باید بدانیم؟
4. Pagination و Infinite Scroll چه تفاوتی دارند؟
5. API پروژه چگونه کار می‌کند؟
6. Component و Render در React
7. مرور `useState`
8. مرور کامل `useRef`
9. تفاوت State و Ref
10. DOM Ref چیست؟
11. Mutable Ref چیست؟
12. مشکل درخواست‌های تکراری
13. `useEffect` از پایه
14. Cleanup در `useEffect`
15. `useCallback` از پایه
16. Closure و Stale Closure
17. Sentinel چیست؟
18. `IntersectionObserver` چیست؟
19. گزینه‌های `root`, `rootMargin`, `threshold`
20. طراحی Stateهای Infinite Scroll
21. طراحی Refهای Infinite Scroll
22. ساخت تابع `loadMore`
23. چرا از `async/await` استفاده می‌کنیم؟
24. `try/catch/finally`
25. Functional State Update
26. اضافه کردن داده جدید به داده قبلی
27. `Map` و حذف داده تکراری
28. ساخت Observer
29. اولین درخواست صفحه 1
30. UI برای Loading، Error و پایان داده
31. کد نهایی کامل
32. توضیح خط‌به‌خط کد نهایی
33. جریان اجرای برنامه از لحظه ورود کاربر
34. مثال اجرای صفحه 1، 2 و 3
35. چرا هم `loading` داریم هم `loadingRef`؟
36. چرا هم `hasNextPage` داریم هم `hasNextPageRef`؟
37. چرا `nextPage` را Ref گرفته‌ایم؟
38. React StrictMode و این پروژه
39. AbortController — بخش پیشرفته
40. خطاهای رایج
41. روش Debug کردن
42. سؤال‌های احتمالی دانشجوها
43. تمرین‌های کلاسی
44. خلاصه امتحانی / Cheat Sheet

---

# 1. وضعیت فعلی پروژه

در پروژه‌ی فعلی فایل زیر داریم:

```text
src/pages/InfiniteScrollPage.jsx
```

نسخه‌ی فعلی صفحه تقریباً این کار را می‌کند:

```jsx
import ProductCard from '../components/ProductCard'
import { products } from '../data'

export default function InfiniteScrollPage() {
  return (
    <section>
      <div>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="h-12 w-full" />
    </section>
  )
}
```

در این مرحله داده‌ها از فایل محلی می‌آیند:

```jsx
import { products } from '../data'
```

یعنی هنوز:

- درخواست API نداریم.
- صفحه‌بندی واقعی نداریم.
- تشخیص رسیدن کاربر به پایین صفحه نداریم.
- `useRef` نداریم.
- `useEffect` نداریم.
- `IntersectionObserver` نداریم.
- Loading و Error واقعی نداریم.

پس دقیقاً می‌خواهیم این Template را تبدیل کنیم به:

```text
User opens page
      ↓
Load page 1
      ↓
Show products
      ↓
User scrolls
      ↓
Sentinel becomes visible
      ↓
Load page 2
      ↓
Append page 2 to page 1
      ↓
User scrolls again
      ↓
Load page 3
      ↓
...
      ↓
hasNextPage = false
      ↓
Stop requesting
```

### جمله پیشنهادی برای تدریس

> «ما قرار نیست کل صفحه را یک‌باره از سرور بگیریم. ابتدا چند محصول می‌گیریم و وقتی کاربر به انتهای لیست نزدیک شد، بخش بعدی را دریافت می‌کنیم.»

---

# 2. Infinite Scroll چیست؟

Infinite Scroll یعنی با اسکرول کردن کاربر، اطلاعات جدید به صورت خودکار دریافت و به لیست قبلی اضافه شوند.

نمونه‌ی ذهنی:

```text
صفحه 1:
[1][2][3][4][5][6][7][8]

کاربر پایین می‌رود

صفحه 2 دریافت می‌شود:
[9][10][11][12][13][14][15][16]

نتیجه روی صفحه:
[1][2][3][4][5][6][7][8]
[9][10][11][12][13][14][15][16]
```

دقت کنید که در Infinite Scroll داده جدید **جایگزین** داده قبلی نمی‌شود؛ به آن **اضافه** می‌شود.

این تفاوت بسیار مهم است.

در Pagination معمولی ممکن است بنویسیم:

```jsx
setItems(data.items)
```

اما در Infinite Scroll معمولاً می‌نویسیم:

```jsx
setItems((prevItems) => [...prevItems, ...data.items])
```

چون می‌خواهیم داده‌های قبلی باقی بمانند.

---

# 3. قبل از کدنویسی چه چیزهایی باید بدانیم؟

برای فهم کامل این مثال بهتر است دانشجو این موارد را بشناسد:

- Component
- Props
- JSX
- `Array.map`
- `useState`
- `useEffect`
- `useRef`
- `useCallback`
- تابع `async`
- `await`
- `try/catch/finally`
- Spread Operator یعنی `...`
- Callback Function
- `Map`
- DOM Element
- Browser API
- `IntersectionObserver`

قرار است تمام موارد مهم را در همین جزوه مرور کنیم.

---

# 4. تفاوت Pagination و Infinite Scroll

## Pagination

در Pagination کاربر خودش صفحه را تغییر می‌دهد:

```text
1  2  3  4  5  Next
```

مثلاً:

```js
getProducts(3, 8)
```

یعنی:

```text
page = 3
limit = 8
```

و اغلب داده صفحه جدید جای داده صفحه قبلی را می‌گیرد.

## Infinite Scroll

در Infinite Scroll دکمه صفحه نداریم.

برنامه خودش متوجه می‌شود که کاربر به پایین رسیده است و مثلاً می‌گوید:

```js
getProducts(2, 8)
```

بعد:

```js
getProducts(3, 8)
```

بعد:

```js
getProducts(4, 8)
```

بنابراین Infinite Scroll هنوز در پشت صحنه از Pagination استفاده می‌کند؛ فقط **تغییر صفحه خودکار شده است**.

### نکته‌ی مهم

> Infinite Scroll جای Pagination سمت Backend را نمی‌گیرد. Backend همچنان معمولاً `page` و `limit` یا `cursor` دریافت می‌کند.

---

# 5. API پروژه چگونه کار می‌کند؟

در پروژه فایل زیر را داریم:

```text
src/api.js
```

کد فعلی:

```js
const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts(page = 1, limit = 8, signal) {
  const response = await fetch(
    `${API_URL}/products?page=${page}&limit=${limit}`,
    { signal },
  );

  if (!response.ok) {
    throw new Error("خطای سرور");
  }

  return response.json();
}
```

بیایید آن را باز کنیم.

## `page`

شماره صفحه‌ای است که می‌خواهیم.

```js
page = 1
```

یعنی صفحه اول.

```js
page = 2
```

یعنی صفحه دوم.

## `limit`

تعداد آیتم در هر صفحه است.

```js
limit = 8
```

یعنی هر بار حداکثر 8 محصول بگیر.

## URL نهایی

مثلاً:

```text
/products?page=2&limit=8
```

یعنی:

> «از سرور صفحه دوم را بده و در هر صفحه 8 محصول قرار بده.»

## شکل پاسخ مورد انتظار

از روی کد Pagination پروژه مشخص است که پاسخ API ساختاری شبیه این دارد:

```js
{
  items: [...],
  totalPages: 5,
  hasNextPage: true,
  hasPrevPage: true
}
```

برای Infinite Scroll مهم‌ترین بخش‌ها این‌ها هستند:

```js
data.items
```

و:

```js
data.hasNextPage
```

---

# 6. Component و Render در React

یک Component معمولی:

```jsx
function Counter() {
  return <h1>Hello</h1>
}
```

وقتی State تغییر می‌کند، React دوباره Component را اجرا می‌کند.

مثلاً:

```jsx
const [count, setCount] = useState(0)
```

اگر بزنیم:

```jsx
setCount(1)
```

React دوباره Component را render می‌کند.

پس باید همیشه این سؤال را از خودمان بپرسیم:

> «آیا تغییر این مقدار باید UI را تغییر بدهد؟»

اگر بله، معمولاً State انتخاب خوبی است.

اگر نه، ممکن است `useRef` مناسب‌تر باشد.

این سؤال در Infinite Scroll خیلی مهم می‌شود.

---

# 7. مرور کامل `useState`

مثال:

```jsx
const [loading, setLoading] = useState(false)
```

سه قسمت داریم:

```text
loading
```

مقدار فعلی.

```text
setLoading
```

تابعی برای تغییر مقدار.

```text
false
```

مقدار اولیه.

مثلاً:

```jsx
setLoading(true)
```

React مقدار را تغییر می‌دهد و Component دوباره Render می‌شود.

بنابراین می‌توانیم در JSX بنویسیم:

```jsx
{loading && <p>Loading...</p>}
```

وقتی `loading = true` شود، پیام نمایش داده می‌شود.

## Stateهای مورد نیاز ما

در Infinite Scroll این Stateها را خواهیم داشت:

```jsx
const [items, setItems] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [hasNextPage, setHasNextPage] = useState(true)
```

### `items`

محصولاتی که تا الان دریافت کرده‌ایم.

### `loading`

برای نمایش وضعیت دریافت اطلاعات در UI.

### `error`

برای نمایش خطا.

### `hasNextPage`

برای اینکه UI بداند آیا صفحه دیگری وجود دارد یا نه.

---

# 8. `useRef` از پایه‌ی پایه

یکی از مهم‌ترین بخش‌های این آموزش همین قسمت است.

ساختار ساده:

```jsx
const myRef = useRef(initialValue)
```

مثلاً:

```jsx
const numberRef = useRef(10)
```

مقدار داخل Ref از طریق `.current` خوانده می‌شود:

```js
numberRef.current
```

که در اینجا برابر است با:

```text
10
```

می‌توانیم تغییرش بدهیم:

```js
numberRef.current = 20
```

اما نکته اصلی:

> تغییر `ref.current` باعث Render مجدد Component نمی‌شود.

این تفاوت اصلی آن با State است.

---

# 9. تفاوت State و Ref

## State

```jsx
const [count, setCount] = useState(0)
```

تغییر:

```jsx
setCount(1)
```

نتیجه:

```text
Component re-render می‌شود.
```

## Ref

```jsx
const countRef = useRef(0)
```

تغییر:

```jsx
countRef.current = 1
```

نتیجه:

```text
Component re-render نمی‌شود.
```

## قانون ساده برای دانشجو

اگر مقدار برای نمایش UI است:

```text
State
```

اگر فقط یک مقدار داخلی برای کنترل منطق برنامه است و لازم نیست با تغییرش UI فوراً Render شود:

```text
Ref
```

البته همیشه استثنا وجود دارد، ولی برای شروع این قانون بسیار مفید است.

---

# 10. دو کاربرد مهم `useRef`

`useRef` معمولاً دو کاربرد اصلی دارد.

## کاربرد اول: گرفتن DOM Element

مثلاً:

```jsx
const inputRef = useRef(null)
```

در JSX:

```jsx
<input ref={inputRef} />
```

بعد:

```js
inputRef.current.focus()
```

اینجا `inputRef.current` خود عنصر HTML است.

## کاربرد دوم: نگه داشتن یک مقدار Mutable

مثلاً:

```jsx
const loadingRef = useRef(false)
```

بعد:

```js
loadingRef.current = true
```

در Infinite Scroll هر دو نوع استفاده را خواهیم داشت.

---

# 11. Refهایی که در Infinite Scroll لازم داریم

نسخه اصلی ما این Refها را دارد:

```jsx
const sentinelRef = useRef(null)
const loadingRef = useRef(false)
const nextPageRef = useRef(1)
const hasNextPageRef = useRef(true)
```

هر کدام نقش کاملاً متفاوتی دارد.

---

## 11.1 `sentinelRef`

```jsx
const sentinelRef = useRef(null)
```

این Ref به یک Element انتهای لیست وصل می‌شود:

```jsx
<div ref={sentinelRef} />
```

وظیفه:

> Observer باید این Element را نگاه کند و تشخیص بدهد چه زمانی وارد صفحه شده است.

---

## 11.2 `loadingRef`

```jsx
const loadingRef = useRef(false)
```

وظیفه:

> جلوگیری از اجرای همزمان چند Request.

مثلاً Observer ممکن است چند بار Callback را صدا بزند.

ما قبل از Request چک می‌کنیم:

```js
if (loadingRef.current) return
```

و بلافاصله بعدش:

```js
loadingRef.current = true
```

پس Request دوم اجازه شروع پیدا نمی‌کند.

---

## 11.3 `nextPageRef`

```jsx
const nextPageRef = useRef(1)
```

در شروع یعنی:

```text
صفحه بعدی که باید درخواست شود = 1
```

بعد از موفقیت:

```js
nextPageRef.current = 2
```

سپس:

```js
nextPageRef.current = 3
```

و همین‌طور ادامه پیدا می‌کند.

چرا State نگرفتیم؟

چون شماره صفحه در این طراحی عمدتاً یک **متغیر کنترلی داخلی** است و لازم نیست صرفاً با تغییر آن UI Render شود.

---

## 11.4 `hasNextPageRef`

```jsx
const hasNextPageRef = useRef(true)
```

وظیفه:

> اگر دیگر صفحه‌ای وجود ندارد، جلوی Request بعدی را بگیرد.

ابتدای `loadMore` می‌نویسیم:

```js
if (!hasNextPageRef.current) return
```

پس وقتی Backend بگوید:

```js
hasNextPage: false
```

دیگر درخواست جدیدی نمی‌فرستیم.

---

# 12. چرا فقط State کافی نیست؟

فرض کنید فقط این را داریم:

```jsx
const [loading, setLoading] = useState(false)
```

و داخل `loadMore`:

```js
if (loading) return

setLoading(true)
```

ممکن است Observer در یک فاصله زمانی بسیار کوتاه Callback را چند بار اجرا کند.

`setLoading(true)` باعث می‌شود React یک Render جدید برنامه‌ریزی کند، اما تغییر State را نباید مثل یک Lock کاملاً همزمان و فوری برای Callbackهای پشت سرهم در نظر بگیریم.

برای همین یک قفل Mutable داریم:

```jsx
const loadingRef = useRef(false)
```

و بلافاصله می‌نویسیم:

```js
loadingRef.current = true
```

این مقدار در همان لحظه تغییر می‌کند.

### جمله پیشنهادی برای کلاس

> «`loading` را برای UI می‌خواهیم؛ `loadingRef` را برای کنترل منطق.»

این جمله را حتماً تأکید کنید.

---

# 13. `useEffect` از پایه

ساختار:

```jsx
useEffect(() => {
  // side effect
}, [])
```

Effect برای کارهایی است که خارج از Render ساده React اتفاق می‌افتند؛ مثلاً:

- درخواست API
- Timer
- Event Listener
- Observer
- اتصال WebSocket
- کار با DOM

## Effect در اولین Mount

```jsx
useEffect(() => {
  console.log('mounted')
}, [])
```

به صورت مفهومی بعد از قرار گرفتن Component روی صفحه اجرا می‌شود.

---

# 14. Dependency Array چیست؟

مثال:

```jsx
useEffect(() => {
  console.log(page)
}, [page])
```

هر وقت `page` تغییر کند، Effect دوباره اجرا می‌شود.

اگر بنویسیم:

```jsx
useEffect(() => {
  console.log('run')
}, [])
```

هدف این است که Effect به تغییر State/Props خاصی وابسته نباشد و در lifecycle مربوط به Mount اجرا شود.

در پروژه ما `React.StrictMode` فعال است و در Development رفتار Effectها را بعداً دقیق توضیح می‌دهیم.

---

# 15. Cleanup در `useEffect`

بعضی Effectها چیزی ایجاد می‌کنند که باید پاک شود.

مثلاً Event Listener:

```jsx
useEffect(() => {
  window.addEventListener('scroll', handleScroll)

  return () => {
    window.removeEventListener('scroll', handleScroll)
  }
}, [])
```

قسمت:

```jsx
return () => {
  // cleanup
}
```

Cleanup نام دارد.

برای `IntersectionObserver` نیز باید Cleanup داشته باشیم:

```js
return () => observer.disconnect()
```

چون وقتی Component دیگر وجود ندارد، Observer هم نباید بی‌دلیل فعال بماند.

---

# 16. `useCallback` از پایه

فرض کنید داخل Component بنویسیم:

```jsx
function loadMore() {
  // ...
}
```

هر بار Component Render می‌شود، یک Function Object جدید ساخته می‌شود.

یعنی از نظر Reference:

```text
loadMore قبلی !== loadMore جدید
```

اگر Effect ما به `loadMore` وابسته باشد:

```jsx
useEffect(() => {
  // ...
}, [loadMore])
```

تغییر Reference تابع می‌تواند باعث اجرای دوباره Effect شود.

برای ثابت نگه داشتن Reference تابع می‌توانیم بنویسیم:

```jsx
const loadMore = useCallback(() => {
  // ...
}, [])
```

یعنی React همان Function Reference را بین Renderها نگه می‌دارد، تا زمانی که Dependencyهای `useCallback` تغییر نکرده باشند.

---

# 17. آیا `useCallback` برنامه را همیشه سریع‌تر می‌کند؟

نه.

نباید به دانشجو بگوییم:

> «هر تابعی را useCallback کن تا سریع شود.»

این اشتباه است.

در این مثال دلیل اصلی استفاده این است که `loadMore` داخل Effect استفاده می‌شود و می‌خواهیم Reference آن کنترل‌شده باشد.

```jsx
const loadMore = useCallback(async () => {
  // ...
}, [])
```

بعد:

```jsx
useEffect(() => {
  // observer uses loadMore
}, [loadMore])
```

---

# 18. Closure چیست؟

یک تابع می‌تواند مقادیر Scope بیرونی خود را به خاطر بسپارد.

مثال:

```js
function outer() {
  const name = 'Ali'

  function inner() {
    console.log(name)
  }

  return inner
}
```

`inner` به `name` دسترسی دارد.

این مفهوم Closure است.

در React اهمیت زیادی دارد چون Callbackها مقادیری را از Render زمان ساخته شدن خود می‌بینند.

---

# 19. Stale Closure چیست؟

فرض کنید:

```jsx
const [page, setPage] = useState(1)

const loadMore = useCallback(() => {
  console.log(page)
}, [])
```

چون Dependency Array خالی است:

```js
[]
```

تابع `loadMore` ممکن است همان `page` مربوط به Render اولیه را نگه دارد.

یعنی حتی اگر State بعداً 2 شود، تابع ممکن است همچنان مقدار قدیمی را ببیند.

یکی از راه‌های حل، اضافه کردن Dependency است:

```jsx
useCallback(() => {
  console.log(page)
}, [page])
```

راه دیگر برای بعضی مقادیر کنترلی، Ref است:

```jsx
const nextPageRef = useRef(1)
```

و هر بار جدیدترین مقدار را از:

```js
nextPageRef.current
```

می‌خوانیم.

این یکی از دلایلی است که Ref در Infinite Scroll کاربرد زیادی دارد.

---

# 20. Sentinel چیست؟

Sentinel یعنی یک Element کوچک که معمولاً انتهای لیست قرار می‌دهیم.

مثلاً:

```jsx
<div ref={sentinelRef} className="h-8" />
```

این Element خودش محتوای خاصی ندارد.

فقط نقش «نقطه تشخیص» دارد.

ساختار صفحه:

```text
Product
Product
Product
Product
Product
Product
Product
Product

[SENTINEL]
```

وقتی Sentinel وارد محدوده Viewport شود، متوجه می‌شویم کاربر به انتهای لیست نزدیک شده است.

---

# 21. چرا از Scroll Event استفاده نکنیم؟

می‌توانیم بنویسیم:

```js
window.addEventListener('scroll', ...)
```

و دائماً محاسبه کنیم:

```js
window.scrollY
window.innerHeight
document.documentElement.scrollHeight
```

اما این روش معمولاً نیازمند محاسبات و کنترل بیشتری است.

Browser API مناسب‌تری داریم:

```text
IntersectionObserver
```

این API به ما می‌گوید یک Element چه زمانی وارد یا خارج محدوده دید شده است.

برای Infinite Scroll معمولاً گزینه بسیار خوبی است.

---

# 22. `IntersectionObserver` چیست؟

ساختار ساده:

```js
const observer = new IntersectionObserver((entries) => {
  console.log(entries)
})
```

بعد باید بگوییم چه Elementی را نگاه کند:

```js
observer.observe(element)
```

در پروژه ما:

```js
observer.observe(sentinel)
```

وقتی وضعیت Intersection تغییر کند، Callback اجرا می‌شود.

---

# 23. Entry چیست؟

Callback چیزی شبیه این دریافت می‌کند:

```js
(entries) => {
  // ...
}
```

ما فقط یک Sentinel داریم، بنابراین معمولاً اولین Entry را می‌گیریم:

```js
const entry = entries[0]
```

یا با Destructuring:

```js
([entry]) => {
  // ...
}
```

بعد می‌پرسیم:

```js
if (entry.isIntersecting) {
  // sentinel is visible
}
```

وقتی `true` شود:

```js
loadMore()
```

---

# 24. ساخت Observer ساده

```jsx
useEffect(() => {
  const sentinel = sentinelRef.current

  if (!sentinel) return

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      loadMore()
    }
  })

  observer.observe(sentinel)

  return () => {
    observer.disconnect()
  }
}, [loadMore])
```

بیایید جزءبه‌جزء نگاه کنیم.

---

## گرفتن DOM Element

```js
const sentinel = sentinelRef.current
```

چون در JSX داریم:

```jsx
<div ref={sentinelRef} />
```

بعد از Mount، `sentinelRef.current` همان DOM Element خواهد بود.

---

## بررسی وجود Element

```js
if (!sentinel) return
```

اگر هنوز Element وجود ندارد، ادامه نده.

---

## ساخت Observer

```js
const observer = new IntersectionObserver(([entry]) => {
  // ...
})
```

---

## چک Intersection

```js
if (entry.isIntersecting) {
  loadMore()
}
```

---

## شروع مشاهده

```js
observer.observe(sentinel)
```

---

## Cleanup

```js
return () => {
  observer.disconnect()
}
```

Observer را قطع می‌کنیم.

---

# 25. `root`, `rootMargin`, `threshold`

می‌توانیم Observer را این‌طور بسازیم:

```js
const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      loadMore()
    }
  },
  {
    root: null,
    rootMargin: '300px 0px',
    threshold: 0,
  },
)
```

## `root`

```js
root: null
```

یعنی Viewport اصلی مرورگر معیار باشد.

اگر داخل یک Scroll Container خاص بودیم، می‌توانستیم همان Container را root قرار دهیم.

---

## `rootMargin`

```js
rootMargin: '300px 0px'
```

یعنی محدوده تشخیص را کمی بزرگ‌تر کن.

به زبان ساده:

> «لازم نیست کاربر دقیقاً به Sentinel برسد؛ حدود 300px زودتر شروع به Load کن.»

این باعث می‌شود UX بهتر شود چون اطلاعات قبل از رسیدن کامل کاربر آماده می‌شوند.

---

## `threshold`

```js
threshold: 0
```

یعنی همین که Element وارد محدوده Intersection شود کافی است.

مثلاً:

```js
threshold: 1
```

یعنی تقریباً کل Element باید دیده شود.

برای Infinite Scroll معمولاً `0` یا مقدار کوچک انتخاب مناسبی است.

---

# 26. طراحی Stateهای Infinite Scroll

ابتدای Component:

```jsx
const [items, setItems] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [hasNextPage, setHasNextPage] = useState(true)
```

## `items`

```js
[]
```

در ابتدا هیچ محصولی نداریم.

بعد از صفحه 1:

```text
8 محصول
```

بعد از صفحه 2:

```text
16 محصول
```

بعد از صفحه 3:

```text
24 محصول
```

---

## `loading`

قبل از Request:

```js
setLoading(true)
```

بعد از پایان:

```js
setLoading(false)
```

---

## `error`

قبل از هر تلاش:

```js
setError('')
```

در Catch:

```js
setError(err.message)
```

---

## `hasNextPage`

Backend تعیین می‌کند:

```js
setHasNextPage(Boolean(data.hasNextPage))
```

در UI می‌توانیم آخر کار بنویسیم:

```jsx
{!hasNextPage && <p>همه محصولات دریافت شدند.</p>}
```

---

# 27. طراحی Refهای Infinite Scroll

```jsx
const sentinelRef = useRef(null)
const loadingRef = useRef(false)
const nextPageRef = useRef(1)
const hasNextPageRef = useRef(true)
```

خلاصه:

| Ref | مقدار اولیه | کاربرد |
|---|---:|---|
| `sentinelRef` | `null` | نگه داشتن DOM Sentinel |
| `loadingRef` | `false` | جلوگیری از Request همزمان |
| `nextPageRef` | `1` | شماره صفحه بعدی |
| `hasNextPageRef` | `true` | توقف Request وقتی صفحه بعد نداریم |

---

# 28. شروع ساخت تابع `loadMore`

ساختار اولیه:

```jsx
const loadMore = useCallback(async () => {
  // logic
}, [])
```

چرا اسم `loadMore`؟

چون مسئولیت تابع دقیقاً این است:

> داده بیشتری دریافت کن.

اسم خوب تابع باید هدف آن را نشان دهد.

---

# 29. Guard Clause چیست؟

ابتدای تابع می‌نویسیم:

```js
if (loadingRef.current || !hasNextPageRef.current) return
```

این یک Guard Clause است.

یعنی قبل از وارد شدن به منطق اصلی، شرایطی که نباید ادامه دهیم را بررسی می‌کنیم.

معنی:

```text
اگر الان Request در حال اجراست
یا
اگر صفحه بعدی وجود ندارد
→ تابع را متوقف کن.
```

می‌توانستیم جدا بنویسیم:

```js
if (loadingRef.current) return
if (!hasNextPageRef.current) return
```

هر دو درست‌اند.

برای آموزش اولیه حتی نسخه جدا واضح‌تر است.

---

# 30. قفل کردن Request

بعد از Guard:

```js
loadingRef.current = true
setLoading(true)
```

این دو خط شبیه به هم هستند اما یک وظیفه ندارند.

## خط اول

```js
loadingRef.current = true
```

برای منطق داخلی.

اگر Callback دوباره سریع اجرا شود:

```js
if (loadingRef.current) return
```

جلویش را می‌گیرد.

## خط دوم

```js
setLoading(true)
```

برای UI.

مثلاً نمایش:

```text
در حال دریافت محصولات بیشتر...
```

---

# 31. پاک کردن Error قبلی

```js
setError('')
```

چرا؟

فرض کنید Request قبلی خطا داده است:

```text
Network Error
```

کاربر Retry می‌کند.

قبل از تلاش جدید بهتر است خطای قبلی پاک شود.

---

# 32. گرفتن شماره صفحه فعلی

```js
const page = nextPageRef.current
```

مثلاً در ابتدا:

```text
page = 1
```

بعداً:

```text
page = 2
```

چرا اول در متغیر می‌ریزیم؟

چون خوانایی بهتر می‌شود و می‌خواهیم همین شماره مشخص را در طول Request استفاده کنیم.

---

# 33. `async/await`

تابع API ما Promise برمی‌گرداند.

پس می‌نویسیم:

```js
const data = await getProducts(page, PAGE_SIZE)
```

`await` یعنی:

> «منتظر نتیجه این Promise بمان، سپس نتیجه را داخل `data` بگذار.»

البته JavaScript Thread را به شکل Blocking سنتی متوقف نمی‌کند؛ اجرای async function در آن نقطه suspend می‌شود و Event Loop می‌تواند کارهای دیگر را انجام دهد.

برای آموزش ابتدایی می‌توانید بگویید:

> «در این تابع، ادامه خطوط بعدی تا آماده شدن نتیجه این Promise صبر می‌کنند.»

---

# 34. `PAGE_SIZE`

بالای فایل می‌نویسیم:

```js
const PAGE_SIZE = 8
```

به جای اینکه همه‌جا عدد `8` بنویسیم.

مزیت:

اگر فردا خواستیم هر بار 12 آیتم بگیریم:

```js
const PAGE_SIZE = 12
```

فقط یک خط تغییر می‌کند.

این نوع مقادیر ثابت را معمولاً با حروف بزرگ نام‌گذاری می‌کنند.

---

# 35. `try/catch/finally`

ساختار:

```js
try {
  // کاری که ممکن است خطا بدهد
} catch (err) {
  // مدیریت خطا
} finally {
  // در هر صورت اجرا می‌شود
}
```

در پروژه:

```js
try {
  const data = await getProducts(page, PAGE_SIZE)
} catch (err) {
  setError(err.message)
} finally {
  loadingRef.current = false
  setLoading(false)
}
```

## `try`

Request و پردازش نتیجه.

## `catch`

اگر Request خطا داد.

## `finally`

چه Request موفق شود چه خطا بدهد، Loading باید تمام شود.

این دقیقاً کاربرد عالی `finally` است.

---

# 36. اشتباه رایج بدون `finally`

مثلاً:

```js
setLoading(true)

try {
  const data = await getProducts()
  setLoading(false)
} catch (err) {
  setError(err.message)
}
```

اگر خطا رخ دهد، شاید هیچ‌وقت این خط اجرا نشود:

```js
setLoading(false)
```

نتیجه:

```text
Loading برای همیشه true می‌ماند.
```

نسخه بهتر:

```js
finally {
  setLoading(false)
}
```

---

# 37. دریافت آیتم‌های جدید

بعد از API:

```js
const newItems = data.items ?? []
```

اپراتور:

```text
??
```

Nullish Coalescing است.

یعنی اگر `data.items` برابر `null` یا `undefined` بود، از `[]` استفاده کن.

پس کد امن‌تر می‌شود.

---

# 38. چرا `setItems(data.items)` اشتباه است؟

اگر بنویسیم:

```js
setItems(data.items)
```

صفحه 1:

```text
1 تا 8
```

صفحه 2 دریافت می‌شود و State تبدیل می‌شود به:

```text
9 تا 16
```

یعنی 1 تا 8 از UI حذف می‌شوند.

این Pagination-style replacement است، نه Infinite Scroll.

ما می‌خواهیم Append کنیم.

---

# 39. ساده‌ترین روش Append

```js
setItems((prevItems) => [
  ...prevItems,
  ...newItems,
])
```

فرض کنید:

```js
prevItems = [1, 2, 3]
newItems = [4, 5, 6]
```

نتیجه:

```js
[1, 2, 3, 4, 5, 6]
```

---

# 40. چرا Functional Update؟

به جای:

```js
setItems([...items, ...newItems])
```

می‌نویسیم:

```js
setItems((prevItems) => [...prevItems, ...newItems])
```

چرا؟

چون State جدید به **State قبلی** وابسته است.

React خودش آخرین مقدار معتبر را به Callback می‌دهد:

```js
(prevItems) => ...
```

این الگو مخصوصاً در کدهای async و درخواست‌های متوالی بسیار مطمئن‌تر است.

### قانون آموزشی

> «هر وقت State جدید را از State قبلی می‌سازیم، Functional Update را جدی بگیریم.»

---

# 41. مشکل Duplicate Data

گاهی ممکن است Backend یا درخواست‌ها داده همپوشان برگردانند.

مثلاً:

```js
prevItems = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
]
```

صفحه جدید:

```js
newItems = [
  { id: 3 },
  { id: 4 },
  { id: 5 },
]
```

اگر مستقیم Append کنیم:

```text
1, 2, 3, 3, 4, 5
```

محصول `id=3` تکراری می‌شود.

برای مقاوم‌تر شدن کد می‌توانیم از `Map` استفاده کنیم.

---

# 42. `Map` چیست؟

`Map` یک ساختار داده Key/Value است.

مثلاً:

```js
const map = new Map()

map.set(1, 'Apple')
map.set(2, 'Orange')
```

خواندن:

```js
map.get(1)
```

نتیجه:

```text
Apple
```

نکته مهم:

هر Key در Map یکتا است.

اگر دوباره بنویسیم:

```js
map.set(1, 'Banana')
```

Key جدید ساخته نمی‌شود؛ مقدار Key شماره 1 Update می‌شود.

این دقیقاً برای حذف Duplicate بر اساس `id` مفید است.

---

# 43. حذف Duplicate با `Map`

کد:

```js
setItems((prevItems) => {
  const map = new Map(
    prevItems.map((item) => [item.id, item])
  )

  newItems.forEach((item) => {
    map.set(item.id, item)
  })

  return Array.from(map.values())
})
```

حالا خط‌به‌خط.

---

## تبدیل Array به زوج Key/Value

```js
prevItems.map((item) => [item.id, item])
```

مثلاً:

```js
[
  { id: 1, title: 'A' },
  { id: 2, title: 'B' },
]
```

تبدیل می‌شود به:

```js
[
  [1, { id: 1, title: 'A' }],
  [2, { id: 2, title: 'B' }],
]
```

بعد:

```js
new Map(...)
```

یعنی Key هر محصول برابر `id` آن است.

---

## اضافه کردن آیتم جدید

```js
newItems.forEach((item) => {
  map.set(item.id, item)
})
```

اگر id جدید باشد، اضافه می‌شود.

اگر id قبلاً وجود داشته باشد، مقدار قبلی Update می‌شود.

پس Duplicate نخواهیم داشت.

---

## تبدیل Map به Array

```js
Array.from(map.values())
```

`map.values()` همه Productها را می‌دهد.

و `Array.from` آن‌ها را به Array تبدیل می‌کند.

---

# 44. تفاوت `Map` با `Set`

`Set` مجموعه‌ای از Valueهای یکتا است.

مثلاً:

```js
const set = new Set([1, 2, 2, 3])
```

نتیجه:

```text
1, 2, 3
```

برای Primitiveها خیلی ساده است.

اما Productهای ما Object هستند و می‌خواهیم یکتایی را بر اساس:

```text
product.id
```

کنترل کنیم.

برای همین `Map` بسیار مناسب است:

```text
key   = product.id
value = product
```

---

# 45. تعیین اینکه صفحه بعد وجود دارد یا نه

بعد از Request:

```js
const canLoadMore = Boolean(data.hasNextPage)
```

چرا `Boolean`؟

برای اینکه مقدار را صریحاً به `true` یا `false` تبدیل کنیم.

بعد:

```js
setHasNextPage(canLoadMore)
hasNextPageRef.current = canLoadMore
```

دوباره دو نسخه داریم.

## State

```js
setHasNextPage(canLoadMore)
```

برای Render UI.

## Ref

```js
hasNextPageRef.current = canLoadMore
```

برای تصمیم سریع داخل `loadMore`.

---

# 46. افزایش شماره صفحه

بعد از موفقیت:

```js
if (canLoadMore) {
  nextPageRef.current = page + 1
}
```

مثلاً:

```text
page = 1
```

بعد:

```text
nextPageRef.current = 2
```

Request بعدی:

```text
page = 2
```

بعد:

```text
nextPageRef.current = 3
```

---

# 47. چرا صفحه را قبل از موفق شدن زیاد نمی‌کنیم؟

روش بد:

```js
nextPageRef.current += 1
const data = await getProducts(nextPageRef.current)
```

اگر Request خطا دهد، ممکن است شماره صفحه جلو برود و Retry روی صفحه اشتباه انجام شود.

نسخه بهتر:

```js
const page = nextPageRef.current

const data = await getProducts(page, PAGE_SIZE)

nextPageRef.current = page + 1
```

یعنی فقط بعد از موفقیت جلو برو.

در نتیجه اگر صفحه 3 خطا داد:

```text
nextPageRef هنوز 3 است
```

و Retry دوباره صفحه 3 را درخواست می‌کند.

---

# 48. نسخه کامل `loadMore`

```jsx
const loadMore = useCallback(async () => {
  if (loadingRef.current || !hasNextPageRef.current) return

  loadingRef.current = true
  setLoading(true)
  setError('')

  const page = nextPageRef.current

  try {
    const data = await getProducts(page, PAGE_SIZE)
    const newItems = data.items ?? []

    setItems((prevItems) => {
      const map = new Map(
        prevItems.map((item) => [item.id, item])
      )

      newItems.forEach((item) => {
        map.set(item.id, item)
      })

      return Array.from(map.values())
    })

    const canLoadMore = Boolean(data.hasNextPage)

    setHasNextPage(canLoadMore)
    hasNextPageRef.current = canLoadMore

    if (canLoadMore) {
      nextPageRef.current = page + 1
    }
  } catch (err) {
    setError(err?.message || 'خطا در دریافت اطلاعات')
  } finally {
    loadingRef.current = false
    setLoading(false)
  }
}, [])
```

این تابع قلب Infinite Scroll ما است.

---

# 49. اولین صفحه چگونه Load شود؟

وقتی کاربر وارد صفحه می‌شود باید صفحه 1 را بگیریم.

می‌توانیم بنویسیم:

```jsx
useEffect(() => {
  loadMore()
}, [loadMore])
```

در شروع:

```js
nextPageRef.current === 1
```

پس `loadMore()` صفحه 1 را می‌گیرد.

بعد از موفقیت:

```js
nextPageRef.current === 2
```

---

# 50. ساخت Observer برای صفحات بعدی

```jsx
useEffect(() => {
  const sentinel = sentinelRef.current

  if (!sentinel) return

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        loadMore()
      }
    },
    {
      root: null,
      rootMargin: '300px 0px',
      threshold: 0,
    },
  )

  observer.observe(sentinel)

  return () => {
    observer.disconnect()
  }
}, [loadMore])
```

بنابراین دو Trigger داریم:

```text
Trigger 1: ورود اولیه Component → loadMore() → page 1
Trigger 2: دیده شدن Sentinel → loadMore() → page 2, 3, 4, ...
```

---

# 51. اگر Effect اولیه و Observer با هم `loadMore` را صدا بزنند چه؟

این سؤال بسیار مهم است.

ممکن است هنگام باز شدن صفحه، Sentinel هم داخل Viewport باشد.

پس تقریباً هم‌زمان:

```text
Initial Effect → loadMore()
Observer       → loadMore()
```

آیا دو Request ارسال می‌شود؟

به خاطر این خط:

```js
if (loadingRef.current) return
```

و این خط که بلافاصله بعد از شروع Request اجرا می‌شود:

```js
loadingRef.current = true
```

Request دوم متوقف می‌شود.

این یکی از مهم‌ترین دلایل وجود `loadingRef` است.

---

# 52. JSX برای نمایش Products

```jsx
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {items.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
    />
  ))}
</div>
```

به جای:

```js
products.map(...)
```

از:

```js
items.map(...)
```

استفاده می‌کنیم چون `items` داده واقعی API است.

---

# 53. `key` چرا مهم است؟

```jsx
key={product.id}
```

React برای تشخیص هویت آیتم‌های List از Key استفاده می‌کند.

Key باید تا حد امکان:

- یکتا باشد.
- پایدار باشد.

`product.id` انتخاب خوبی است.

استفاده از Index:

```jsx
key={index}
```

در لیست‌هایی که تغییر، اضافه یا حذف دارند معمولاً انتخاب ضعیف‌تری است.

---

# 54. قرار دادن Sentinel در JSX

بعد از Grid:

```jsx
<div
  ref={sentinelRef}
  className="h-8 w-full"
  aria-hidden="true"
/>
```

Observer این Element را نگاه می‌کند.

به صورت ذهنی:

```text
Grid products
     ↓
Sentinel
     ↓
Loading / End message
```

---

# 55. نمایش Loading

```jsx
{loading && (
  <Loading
    text={
      items.length === 0
        ? 'در حال دریافت محصولات...'
        : 'در حال دریافت محصولات بیشتر...'
    }
  />
)}
```

اگر هنوز هیچ داده‌ای نداریم:

```text
در حال دریافت محصولات...
```

اگر قبلاً داده داریم:

```text
در حال دریافت محصولات بیشتر...
```

این UX بهتری است.

---

# 56. نمایش Error

```jsx
{error && (
  <div className="space-y-3">
    <ErrorBox message={error} />

    <button
      type="button"
      onClick={loadMore}
      disabled={loading}
      className="rounded-xl bg-white/10 px-4 py-2"
    >
      تلاش مجدد
    </button>
  </div>
)}
```

چرا Retry درست کار می‌کند؟

چون اگر Request شکست خورده باشد، `nextPageRef` جلو نرفته است.

مثلاً صفحه 3 شکست خورده:

```text
nextPageRef.current = 3
```

کلیک Retry:

```text
دوباره page 3
```

---

# 57. نمایش Empty State

```jsx
{!loading && !error && items.length === 0 && (
  <Empty />
)}
```

یعنی:

- Loading نیست.
- Error نیست.
- هیچ آیتمی نداریم.

پس نتیجه خالی است.

---

# 58. نمایش پایان لیست

```jsx
{!hasNextPage && items.length > 0 && (
  <p className="text-center text-sm text-slate-500">
    همه محصولات دریافت شدند.
  </p>
)}
```

Backend گفته:

```js
hasNextPage = false
```

پس دیگر Request جدید نمی‌خواهیم.

---

# 59. کد نهایی کامل `InfiniteScrollPage.jsx`

این نسخه را می‌توانید به عنوان **نسخه اصلی تدریس** استفاده کنید.

```jsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { getProducts } from '../api'
import ProductCard from '../components/ProductCard'
import { Empty, ErrorBox, Loading } from '../components/StateBox'

const PAGE_SIZE = 8

export default function InfiniteScrollPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasNextPage, setHasNextPage] = useState(true)

  const sentinelRef = useRef(null)
  const loadingRef = useRef(false)
  const nextPageRef = useRef(1)
  const hasNextPageRef = useRef(true)

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasNextPageRef.current) return

    loadingRef.current = true
    setLoading(true)
    setError('')

    const page = nextPageRef.current

    try {
      const data = await getProducts(page, PAGE_SIZE)
      const newItems = data.items ?? []

      setItems((prevItems) => {
        const map = new Map(
          prevItems.map((item) => [item.id, item]),
        )

        newItems.forEach((item) => {
          map.set(item.id, item)
        })

        return Array.from(map.values())
      })

      const canLoadMore = Boolean(data.hasNextPage)

      setHasNextPage(canLoadMore)
      hasNextPageRef.current = canLoadMore

      if (canLoadMore) {
        nextPageRef.current = page + 1
      }
    } catch (err) {
      setError(err?.message || 'خطا در دریافت اطلاعات')
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMore()
  }, [loadMore])

  useEffect(() => {
    const sentinel = sentinelRef.current

    if (!sentinel) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore()
        }
      },
      {
        root: null,
        rootMargin: '300px 0px',
        threshold: 0,
      },
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [loadMore])

  return (
    <section className="space-y-6">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[.25em] text-violet-400">
          Infinite Scroll
        </p>

        <h2 className="text-3xl font-black">Infinite Scroll</h2>

        <p className="mt-2 max-w-3xl text-slate-400">
          با نزدیک شدن کاربر به انتهای لیست، صفحه بعدی محصولات
          به صورت خودکار دریافت و به محصولات قبلی اضافه می‌شود.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
        <span className="rounded-lg bg-white/5 px-3 py-2">
          تعداد آیتم‌های دریافت‌شده:
          <strong className="mr-1 text-white">{items.length}</strong>
        </span>

        <span className="rounded-lg bg-white/5 px-3 py-2">
          صفحه بعد وجود دارد:
          <strong className="mr-1 text-white">
            {hasNextPage ? 'بله' : 'خیر'}
          </strong>
        </span>
      </div>

      {error && (
        <div className="space-y-3">
          <ErrorBox message={error} />

          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-40"
          >
            تلاش مجدد
          </button>
        </div>
      )}

      {!loading && !error && items.length === 0 && <Empty />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      <div
        ref={sentinelRef}
        className="h-8 w-full"
        aria-hidden="true"
      />

      {loading && (
        <Loading
          text={
            items.length === 0
              ? 'در حال دریافت محصولات...'
              : 'در حال دریافت محصولات بیشتر...'
          }
        />
      )}

      {!hasNextPage && items.length > 0 && (
        <p className="text-center text-sm text-slate-500">
          همه محصولات دریافت شدند.
        </p>
      )}
    </section>
  )
}
```

---

# 60. توضیح خط‌به‌خط کد نهایی

## Import Hookها

```jsx
import { useCallback, useEffect, useRef, useState } from 'react'
```

چهار Hook داریم:

```text
useState
useRef
useEffect
useCallback
```

نقش آن‌ها:

```text
useState    → داده‌ای که UI به آن وابسته است
useRef      → DOM و مقادیر Mutable داخلی
useEffect   → API اولیه و Observer
useCallback → ثابت‌تر نگه داشتن Reference تابع loadMore
```

---

## Import API

```jsx
import { getProducts } from '../api'
```

این تابع درخواست Backend را انجام می‌دهد.

پس Component مسئول ساخت URL و Fetch جزئی نیست؛ API logic جدا شده است.

این Separation of Concerns خوبی است.

---

## Import Componentها

```jsx
import ProductCard from '../components/ProductCard'
import { Empty, ErrorBox, Loading } from '../components/StateBox'
```

صفحه فقط منطق و composition را کنترل می‌کند.

نمایش Product داخل `ProductCard` است.

نمایش Loading/Error/Empty داخل Componentهای جدا است.

---

## Constant

```js
const PAGE_SIZE = 8
```

هر Request هشت Product.

---

## State آیتم‌ها

```jsx
const [items, setItems] = useState([])
```

از Array خالی شروع می‌کنیم.

---

## State لودینگ

```jsx
const [loading, setLoading] = useState(false)
```

برای UI.

---

## State خطا

```jsx
const [error, setError] = useState('')
```

String خالی یعنی خطایی نداریم.

---

## State وجود صفحه بعد

```jsx
const [hasNextPage, setHasNextPage] = useState(true)
```

در ابتدا فرض می‌کنیم صفحه برای Load کردن وجود دارد تا Request اول امکان اجرا داشته باشد.

---

## DOM Ref

```jsx
const sentinelRef = useRef(null)
```

بعداً به:

```jsx
<div ref={sentinelRef} />
```

وصل می‌شود.

---

## Loading Lock

```jsx
const loadingRef = useRef(false)
```

برای جلوگیری از Race / Duplicate Request.

---

## شماره صفحه بعد

```jsx
const nextPageRef = useRef(1)
```

اولین Request صفحه 1 است.

---

## Ref وجود صفحه بعد

```jsx
const hasNextPageRef = useRef(true)
```

برای Guard سریع داخل Callback.

---

# 61. اجرای `loadMore` با یک مثال واقعی

فرض کنیم برنامه تازه باز شده است.

وضعیت:

```js
items = []
loading = false
loadingRef.current = false
nextPageRef.current = 1
hasNextPageRef.current = true
```

Effect اجرا می‌کند:

```js
loadMore()
```

---

## مرحله 1: Guard

```js
if (loadingRef.current || !hasNextPageRef.current) return
```

جایگذاری:

```js
if (false || !true) return
```

یعنی:

```js
if (false || false) return
```

پس ادامه می‌دهیم.

---

## مرحله 2: Lock

```js
loadingRef.current = true
setLoading(true)
```

حالا اگر Observer هم `loadMore()` را اجرا کند:

```js
if (true || false) return
```

متوقف می‌شود.

---

## مرحله 3: Page

```js
const page = nextPageRef.current
```

پس:

```js
page = 1
```

---

## مرحله 4: Request

```js
const data = await getProducts(1, 8)
```

فرض پاسخ:

```js
{
  items: [/* 8 products */],
  hasNextPage: true
}
```

---

## مرحله 5: Merge

قبلاً:

```js
items = []
```

جدید:

```js
newItems = [1,2,3,4,5,6,7,8]
```

نتیجه:

```js
items = [1,2,3,4,5,6,7,8]
```

---

## مرحله 6: Has Next

```js
canLoadMore = true
```

پس:

```js
hasNextPageRef.current = true
setHasNextPage(true)
```

---

## مرحله 7: Next Page

```js
nextPageRef.current = page + 1
```

یعنی:

```js
nextPageRef.current = 2
```

---

## مرحله 8: Finally

```js
loadingRef.current = false
setLoading(false)
```

آماده Request بعدی هستیم.

---

# 62. کاربر Scroll می‌کند

Sentinel دیده می‌شود.

Observer:

```js
if (entry.isIntersecting) {
  loadMore()
}
```

الان:

```js
nextPageRef.current = 2
```

پس Request:

```js
getProducts(2, 8)
```

می‌رود.

---

# 63. Merge صفحه دوم

قبل:

```text
1 2 3 4 5 6 7 8
```

صفحه جدید:

```text
9 10 11 12 13 14 15 16
```

بعد از Merge:

```text
1 2 3 4 5 6 7 8
9 10 11 12 13 14 15 16
```

یعنی Infinite Scroll واقعی.

---

# 64. وقتی به آخر رسیدیم

فرض صفحه 5 پاسخ بدهد:

```js
{
  items: [...],
  hasNextPage: false
}
```

کد:

```js
hasNextPageRef.current = false
setHasNextPage(false)
```

بار بعد Sentinel دیده شود:

```js
if (loadingRef.current || !hasNextPageRef.current) return
```

جایگذاری:

```js
if (false || !false) return
```

یعنی:

```js
if (false || true) return
```

پس تابع متوقف می‌شود.

هیچ Request اضافه‌ای ارسال نمی‌شود.

---

# 65. چرا هم `loading` و هم `loadingRef` داریم؟

این یکی از سؤال‌های مهم کلاس است.

## `loading`

```jsx
const [loading, setLoading] = useState(false)
```

برای UI:

```jsx
{loading && <Loading />}
```

تغییرش باعث Render می‌شود.

## `loadingRef`

```jsx
const loadingRef = useRef(false)
```

برای Lock داخلی:

```js
if (loadingRef.current) return
```

تغییرش Render نمی‌کند و بلافاصله قابل خواندن است.

### جواب کوتاه کلاس

> `loading` برای نمایش است؛ `loadingRef` برای جلوگیری از Request تکراری.

---

# 66. چرا هم `hasNextPage` و هم `hasNextPageRef` داریم؟

## State

```js
hasNextPage
```

برای UI:

```jsx
{!hasNextPage && <p>پایان لیست</p>}
```

## Ref

```js
hasNextPageRef.current
```

برای منطق `loadMore`:

```js
if (!hasNextPageRef.current) return
```

و دسترسی به آخرین مقدار بدون اینکه تابع مجبور شود مستقیماً به State Closure وابسته شود.

---

# 67. چرا `nextPageRef` و نه `page` State؟

می‌شد با State هم نوشت.

مثلاً:

```jsx
const [page, setPage] = useState(1)
```

اما در این طراحی، شماره صفحه بیشتر یک Cursor داخلی برای Request بعدی است.

ما برای نمایش UI به آن نیاز مستقیم نداریم.

پس Ref انتخاب ساده‌ای است:

```jsx
const nextPageRef = useRef(1)
```

مزیت دیگر:

`loadMore` می‌تواند همیشه مقدار فعلی را از:

```js
nextPageRef.current
```

بگیرد.

---

# 68. آیا استفاده از State برای Page غلط است؟

خیر.

این نکته را حتماً به دانشجو بگویید.

برنامه‌نویسی فقط یک جواب ندارد.

می‌توان Infinite Scroll را با:

```jsx
const [page, setPage] = useState(1)
```

هم ساخت.

اما در نسخه ما Ref کمک می‌کند:

- `loadMore` ساده‌تر بماند.
- شماره Page به عنوان متغیر کنترلی نگهداری شود.
- درگیر dependency تغییر Page در Callback نشویم.

---

# 69. چرا `loadMore` Dependency Array خالی دارد؟

```jsx
const loadMore = useCallback(async () => {
  // ...
}, [])
```

داخل تابع، مقادیر تغییرپذیری مثل:

```text
next page
loading lock
has next
```

از Ref خوانده می‌شوند:

```js
nextPageRef.current
loadingRef.current
hasNextPageRef.current
```

Set State Functionها نیز Reference پایدار دارند:

```js
setItems
setLoading
setError
setHasNextPage
```

و `getProducts` Import شده است.

پس در این طراحی Callback لازم نیست به State متغیر `page` یا `loading` وابسته باشد.

---

# 70. React StrictMode در پروژه شما

در `src/main.jsx` پروژه داریم:

```jsx
<React.StrictMode>
  <BrowserRouter>
    <App />
  </BrowserRouter>
</React.StrictMode>
```

در Development، StrictMode عمداً بعضی چرخه‌های Effect را بیشتر از یک بار بررسی می‌کند تا Side Effectهای ناسالم مشخص شوند.

بنابراین ممکن است دانشجو بگوید:

> «استاد چرا Effect من دوبار اجرا شد؟»

این الزاماً Bug نیست.

در نسخه ما وجود این Lock:

```js
loadingRef.current
```

کمک می‌کند دو Trigger خیلی نزدیک، Request یکسان همزمان ایجاد نکنند.

اما اگر بعدها داخل Effectها AbortController و Cleanup پیچیده اضافه کردید، باید رفتار StrictMode را هم در نظر بگیرید.

### جمله پیشنهادی برای کلاس

> «StrictMode در Development سخت‌گیرتر است؛ هدفش پیدا کردن Side Effectهای مشکل‌دار است، نه اینکه Production حتماً دقیقاً همان رفتار دوباره را داشته باشد.»

---

# 71. `IntersectionObserver` در ذهن دانشجو چگونه تصور شود؟

این تشبیه را استفاده کنید:

> «فرض کنید پایین لیست یک نگهبان نامرئی گذاشته‌ایم. مرورگر نگهبان را نگاه می‌کند. همین که نگهبان نزدیک صفحه دیده شد، به `loadMore` خبر می‌دهد که محصولات بعدی را بیاورد.»

```text
Products
Products
Products
Products

---------------- viewport bottom ----------------

Sentinel 👁
```

وقتی Sentinel وارد محدوده شود:

```text
Observer → loadMore → API → append items
```

---

# 72. Flow کامل برنامه

```text
Component Mount
      ↓
State ساخته می‌شود
      ↓
Refs ساخته می‌شوند
      ↓
Render اولیه
      ↓
Sentinel به DOM متصل می‌شود
      ↓
Effect اولیه → loadMore()
      ↓
loadingRef = true
loading state = true
      ↓
GET /products?page=1&limit=8
      ↓
Response
      ↓
Merge items
      ↓
hasNextPage update
      ↓
nextPageRef = 2
      ↓
loadingRef = false
loading state = false
      ↓
User scrolls
      ↓
Sentinel intersects
      ↓
Observer callback
      ↓
loadMore()
      ↓
GET /products?page=2&limit=8
      ↓
Append
      ↓
...
      ↓
hasNextPage = false
      ↓
Guard prevents more requests
```

---

# 73. `Array.map` در Render و `Map` ساختار داده را اشتباه نگیرید

دو چیز داریم که اسم مشابه دارند.

## `array.map()`

تابع Array:

```js
items.map((item) => ...)
```

برای تبدیل هر Element Array.

مثلاً ساخت JSX:

```jsx
items.map((product) => (
  <ProductCard key={product.id} product={product} />
))
```

## `new Map()`

ساختار داده JavaScript:

```js
const map = new Map()
```

برای Key/Value و یکتایی بر اساس `id`.

به دانشجو تأکید کنید:

```text
.map() ≠ Map
```

---

# 74. `forEach` در Merge

```js
newItems.forEach((item) => {
  map.set(item.id, item)
})
```

`forEach` روی تمام آیتم‌ها حرکت می‌کند، اما Array جدید برنمی‌گرداند.

هدف ما اینجا فقط Side Effect روی `map` است:

```js
map.set(...)
```

پس `forEach` مناسب است.

---

# 75. چرا مستقیم State را Mutate نمی‌کنیم؟

نباید بنویسیم:

```js
items.push(...newItems)
setItems(items)
```

چون `items` State قبلی را مستقیم Mutate می‌کنیم.

React بهتر است Reference جدید دریافت کند.

مثلاً:

```js
return Array.from(map.values())
```

این یک Array جدید است.

اصل مهم:

> State را مستقیم تغییر نده؛ State جدید بساز.

---

# 76. Error Handling دقیق

کد:

```js
catch (err) {
  setError(err?.message || 'خطا در دریافت اطلاعات')
}
```

`err?.message` از Optional Chaining استفاده می‌کند.

اگر `err` وجود داشت، Message را بخوان.

اگر Message نداشت:

```text
خطا در دریافت اطلاعات
```

نمایش بده.

در API خود پروژه هم داریم:

```js
if (!response.ok) {
  throw new Error('خطای سرور')
}
```

پس Error از API به Component منتقل می‌شود.

---

# 77. تفکیک مسئولیت API و Component

`api.js`:

```text
چگونه Request ارسال شود؟
```

`InfiniteScrollPage.jsx`:

```text
چه زمانی Request ارسال شود؟
نتیجه چگونه به UI اضافه شود؟
```

این تفکیک بسیار مهم است.

مثلاً URL نباید لزوماً در هر Component تکرار شود.

---

# 78. AbortController چیست؟ — بخش پیشرفته

فایل `api.js` پروژه از الان این پارامتر را دارد:

```js
signal
```

و داخل Fetch:

```js
{ signal }
```

این یعنی API Helper برای `AbortController` آماده است.

ساختار پایه:

```js
const controller = new AbortController()
```

Signal:

```js
controller.signal
```

ارسال:

```js
getProducts(page, PAGE_SIZE, controller.signal)
```

لغو:

```js
controller.abort()
```

وقتی Abort شود، Fetch معمولاً با خطایی با نام:

```text
AbortError
```

Reject می‌شود.

---

# 79. چرا AbortController مفید است؟

فرض کنید کاربر وارد صفحه می‌شود.

Request شروع شده است.

قبل از تمام شدن Request، کاربر صفحه را ترک می‌کند.

دیگر به آن Response نیاز نداریم.

می‌توان Request را Cancel کرد.

در Search حتی کاربردش بیشتر است؛ چون Query جدید می‌تواند Request قدیمی را بی‌استفاده کند.

---

# 80. چرا AbortController را در اولین جلسه Infinite Scroll اضافه نکنیم؟

چون دانشجو همزمان باید این‌ها را بفهمد:

- State
- Ref
- Effect
- Callback
- Observer
- Async Request
- Merge

اگر Abort lifecycle را هم همان ابتدا اضافه کنیم، Cognitive Load زیاد می‌شود.

ترتیب پیشنهادی:

```text
مرحله اول: Infinite Scroll بدون Abort
مرحله دوم: وقتی کامل فهمیدند → AbortController
```

---

# 81. نسخه پیشرفته برای Cancel کردن Request فعال

اگر خواستید بعد از آموزش اصلی نسخه مقاوم‌تر را مطرح کنید، دو Ref اضافه می‌کنیم:

```jsx
const controllerRef = useRef(null)
const requestIdRef = useRef(0)
```

مفهوم `requestIdRef` این است که هر Request یک شناسه منطقی بگیرد و Response قدیمی نتواند State مربوط به Request جدیدتر را تغییر دهد.

نمونه الگو:

```jsx
const controller = new AbortController()
controllerRef.current = controller

const requestId = ++requestIdRef.current

try {
  const data = await getProducts(
    page,
    PAGE_SIZE,
    controller.signal,
  )

  if (requestId !== requestIdRef.current) return

  // update state
} catch (err) {
  if (
    err.name !== 'AbortError' &&
    requestId === requestIdRef.current
  ) {
    setError(err.message)
  }
} finally {
  if (requestId === requestIdRef.current) {
    loadingRef.current = false
    setLoading(false)
    controllerRef.current = null
  }
}
```

و هنگام Cleanup:

```js
requestIdRef.current += 1
loadingRef.current = false
controllerRef.current?.abort()
controllerRef.current = null
```

این بخش را به عنوان Advanced Topic تدریس کنید، نه قبل از اینکه نسخه اصلی کاملاً جا افتاده باشد.

---

# 82. Race Condition چیست؟

فرض کنید دو Request ناخواسته همزمان ارسال شوند:

```text
Request page 2 ────────────────→ response دیر
Request page 3 ───────→ response سریع
```

اگر کنترل نداشته باشیم، Responseها ممکن است با ترتیب غیرمنتظره برسند.

`loadingRef` در طراحی ما اجازه نمی‌دهد چند LoadMore همزمان شروع شوند.

یعنی:

```text
در هر لحظه فقط یک صفحه
```

این طراحی Race Condition را بسیار ساده‌تر می‌کند.

---

# 83. چرا `rootMargin: 300px`؟

اگر دقیقاً وقتی Sentinel دیده شد Request شروع شود، ممکن است کاربر چند لحظه Loading ببیند.

اگر 300px زودتر Load کنیم:

```text
user is approaching bottom
        ↓
request already starts
        ↓
user reaches bottom
        ↓
data may already be ready
```

این را Prefetch-like behavior می‌توان در نظر گرفت.

مقدار 300 قانون ثابت نیست.

مثلاً می‌تواند:

```text
100px
200px
500px
```

باشد.

باید بر اساس UX و اندازه داده تست شود.

---

# 84. اگر Sentinel ارتفاع صفر داشته باشد چه؟

بهتر است Sentinel قابل تشخیص باشد.

مثلاً:

```jsx
<div ref={sentinelRef} className="h-8" />
```

ارتفاع کوچک مشخصی دارد.

اگر Element هیچ Geometry مفیدی نداشته باشد، Debug Observer سخت‌تر می‌شود.

برای Debug حتی می‌توانید موقتاً بنویسید:

```jsx
<div
  ref={sentinelRef}
  className="h-20 bg-red-500"
>
  SENTINEL
</div>
```

بعد که مطمئن شدید درست کار می‌کند، دوباره نامرئی‌اش کنید.

---

# 85. روش تدریس مرحله‌به‌مرحله در کلاس

پیشنهاد می‌کنم کد نهایی را از ابتدا روی صفحه نیندازید.

این ترتیب بهتر است.

## Step 1 — UI استاتیک

همان فایل پروژه را نشان دهید.

بگویید:

> «فعلاً هشت داده محلی داریم. اولین کار این است که source داده را از static به API تبدیل کنیم.»

---

## Step 2 — فقط Stateها

اضافه کنید:

```jsx
const [items, setItems] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const [hasNextPage, setHasNextPage] = useState(true)
```

فعلاً Observer ننویسید.

---

## Step 3 — فقط Request صفحه 1

یک `useEffect` ساده:

```jsx
useEffect(() => {
  async function fetchProducts() {
    const data = await getProducts(1, PAGE_SIZE)
    setItems(data.items)
  }

  fetchProducts()
}, [])
```

بگذارید دانشجو اول API را ببیند.

---

## Step 4 — Loading و Error

`try/catch/finally` را اضافه کنید.

---

## Step 5 — مفهوم Append

توضیح دهید چرا این اشتباه است:

```js
setItems(data.items)
```

و این برای Infinite Scroll بهتر است:

```js
setItems((prev) => [...prev, ...data.items])
```

---

## Step 6 — `nextPageRef`

```jsx
const nextPageRef = useRef(1)
```

و Request را عمومی کنید:

```js
getProducts(nextPageRef.current, PAGE_SIZE)
```

---

## Step 7 — `loadMore`

منطق Request را داخل تابع مستقل ببرید.

---

## Step 8 — `loadingRef`

دو بار سریع `loadMore()` را دستی صدا بزنید و مشکل را توضیح دهید.

بعد Lock را اضافه کنید.

---

## Step 9 — Sentinel

در پایین صفحه:

```jsx
<div ref={sentinelRef} />
```

---

## Step 10 — Observer

`IntersectionObserver` را اضافه کنید.

---

## Step 11 — `hasNextPageRef`

آخر API را کنترل کنید.

---

## Step 12 — Map / Duplicate Removal

اول نسخه ساده:

```js
[...prev, ...newItems]
```

سپس نسخه مقاوم‌تر با `Map`.

این ترتیب باعث می‌شود دانشجو دلیل هر خط را بفهمد.

---

# 86. نسخه ساده‌تر `loadMore` برای مرحله میانی تدریس

قبل از Map و HasNext Ref می‌توانید این را بنویسید:

```jsx
const loadMore = async () => {
  if (loadingRef.current) return

  loadingRef.current = true
  setLoading(true)

  try {
    const page = nextPageRef.current
    const data = await getProducts(page, PAGE_SIZE)

    setItems((prevItems) => [
      ...prevItems,
      ...data.items,
    ])

    nextPageRef.current = page + 1
  } catch (err) {
    setError(err.message)
  } finally {
    loadingRef.current = false
    setLoading(false)
  }
}
```

بعد از اینکه این را فهمیدند، به نسخه نهایی مهاجرت کنید.

---

# 87. خطای رایج 1 — جایگزین کردن Items

اشتباه:

```js
setItems(data.items)
```

علامت:

هر بار که Scroll می‌کنید، محصولات قبلی ناپدید می‌شوند.

راه‌حل:

```js
setItems((prev) => [...prev, ...data.items])
```

یا نسخه Map.

---

# 88. خطای رایج 2 — Requestهای تکراری

علامت در Network Tab:

```text
?page=2
?page=2
?page=2
?page=2
```

راه‌حل اصلی:

```js
if (loadingRef.current) return
```

و قبل از Await:

```js
loadingRef.current = true
```

---

# 89. خطای رایج 3 — افزایش Page در جای اشتباه

اشتباه:

```js
nextPageRef.current++
await getProducts(nextPageRef.current)
```

ممکن است صفحه 1 Skip شود یا Retry اشتباه شود.

روش واضح‌تر:

```js
const page = nextPageRef.current
const data = await getProducts(page, PAGE_SIZE)
nextPageRef.current = page + 1
```

---

# 90. خطای رایج 4 — فراموش کردن `hasNextPage`

اگر Backend به آخر رسیده ولی شما همچنان Request بفرستید، ممکن است بارها صفحه خالی یا آخرین Page درخواست شود.

Guard:

```js
if (!hasNextPageRef.current) return
```

---

# 91. خطای رایج 5 — نداشتن Cleanup Observer

اشتباه:

```jsx
useEffect(() => {
  const observer = new IntersectionObserver(...)
  observer.observe(sentinelRef.current)
}, [])
```

بهتر:

```js
return () => observer.disconnect()
```

تا Resource مربوط به Observer پاک شود.

---

# 92. خطای رایج 6 — Dependency اشتباه

اگر `loadMore` در هر Render Function جدید باشد و Effect به آن Dependency داشته باشد:

```jsx
useEffect(() => {
  // observer
}, [loadMore])
```

ممکن است Observer مرتباً ساخته و Cleanup شود.

برای همین در این طراحی:

```jsx
const loadMore = useCallback(..., [])
```

داریم.

---

# 93. خطای رایج 7 — فراموش کردن `.current`

اشتباه:

```js
if (loadingRef) return
```

`loadingRef` یک Object است.

مقدار واقعی داخل:

```js
loadingRef.current
```

است.

صحیح:

```js
if (loadingRef.current) return
```

---

# 94. خطای رایج 8 — `sentinelRef.current` برابر null

اگر قبل از Mount یا بدون اتصال JSX بخواهید Observe کنید:

```js
observer.observe(sentinelRef.current)
```

ممکن است `null` باشد.

برای همین:

```js
const sentinel = sentinelRef.current
if (!sentinel) return
```

---

# 95. خطای رایج 9 — `hasNextPageRef` را Update نکردن

اگر فقط بنویسید:

```js
setHasNextPage(false)
```

ولی Guard شما از Ref بخواند:

```js
if (!hasNextPageRef.current) return
```

Ref همچنان ممکن است `true` باشد.

پس هر دو را Sync می‌کنیم:

```js
setHasNextPage(canLoadMore)
hasNextPageRef.current = canLoadMore
```

---

# 96. خطای رایج 10 — Loading Lock در `finally` Reset نشود

اگر فراموش کنید:

```js
loadingRef.current = false
```

بعد از Request اول، همه Requestهای بعدی Block می‌شوند.

چون:

```js
if (loadingRef.current) return
```

همیشه true خواهد بود.

پس Reset را در:

```js
finally
```

قرار می‌دهیم.

---

# 97. Debug با `console.log`

برای آموزش می‌توانید موقتاً داخل `loadMore` بنویسید:

```js
console.log('loadMore called')
console.log('loading:', loadingRef.current)
console.log('next page:', nextPageRef.current)
console.log('has next:', hasNextPageRef.current)
```

قبل از Request:

```js
console.log('request page:', page)
```

بعد از Response:

```js
console.log('response:', data)
```

در Observer:

```js
console.log('intersecting:', entry.isIntersecting)
```

این باعث می‌شود دانشجو Flow واقعی را در Console ببیند.

---

# 98. Debug با Network Tab

در DevTools:

```text
F12 → Network → Fetch/XHR
```

باید چیزی شبیه این ببینیم:

```text
/products?page=1&limit=8
/products?page=2&limit=8
/products?page=3&limit=8
```

نه:

```text
/products?page=1&limit=8
/products?page=1&limit=8
/products?page=1&limit=8
```

و نه چند Request همزمان برای یک Page.

---

# 99. چک‌لیست تست Infinite Scroll

بعد از پیاده‌سازی این موارد را تست کنید.

### Test 1 — Load اولیه

با ورود به صفحه باید صفحه اول دریافت شود.

### Test 2 — Scroll

با نزدیک شدن به پایین باید صفحه بعد دریافت شود.

### Test 3 — Append

محصولات صفحه قبلی نباید حذف شوند.

### Test 4 — Duplicate

`id` تکراری نباید دوبار دیده شود.

### Test 5 — Loading

هنگام Request پیام Loading دیده شود.

### Test 6 — Error

اگر API خطا داد، Error نمایش داده شود.

### Test 7 — Retry

بعد از خطا، Retry همان Page را دوباره درخواست کند.

### Test 8 — End

وقتی `hasNextPage=false` شد Request جدید نرود.

### Test 9 — Fast Scroll

با Scroll سریع Requestهای همزمان تکراری ایجاد نشود.

### Test 10 — Navigation

از صفحه خارج و دوباره وارد شوید و Observer رفتار غیرعادی نداشته باشد.

---

# 100. سؤال دانشجو: چرا Scroll Event نه؟

پاسخ:

> می‌شود با Scroll Event هم ساخت، اما باید موقعیت Scroll و ارتفاع صفحه را مرتب محاسبه کنیم. IntersectionObserver مستقیماً برای تشخیص دیده‌شدن Element ساخته شده و برای این سناریو خواناتر و مناسب‌تر است.

---

# 101. سؤال دانشجو: `useRef` مگر برای Input نبود؟

پاسخ:

> یکی از کاربردهای useRef گرفتن DOM است، اما فقط این نیست. useRef می‌تواند یک مقدار Mutable را بین Renderها نگه دارد بدون اینکه تغییر آن باعث Render شود. در این پروژه هم `sentinelRef` DOM Ref است و هم `loadingRef` و `nextPageRef` Mutable Value Ref هستند.

---

# 102. سؤال دانشجو: چرا `let nextPage = 1` ننویسیم؟

اگر داخل Component بنویسیم:

```js
let nextPage = 1
```

با Render جدید Component دوباره اجرا می‌شود و این متغیر دوباره ساخته می‌شود.

Ref بین Renderها حفظ می‌شود:

```js
const nextPageRef = useRef(1)
```

پس مقدار Page از بین نمی‌رود.

---

# 103. سؤال دانشجو: چرا `useRef` تغییر کند UI Update نمی‌شود؟

چون React تغییر `.current` را به عنوان State Update دنبال نمی‌کند.

مثلاً:

```js
nextPageRef.current = 2
```

به تنهایی Render ایجاد نمی‌کند.

این یک ویژگی عمدی Ref است.

---

# 104. سؤال دانشجو: اگر Ref Render نمی‌کند، مقدارش چگونه حفظ می‌شود؟

React Object Ref را در طول عمر همان Component حفظ می‌کند.

به صورت مفهومی:

```js
{
  current: 1
}
```

در Render بعدی همان Container منطقی در دسترس است.

---

# 105. سؤال دانشجو: چرا `useCallback`؟

پاسخ کوتاه:

> چون `loadMore` داخل Effect Observer Dependency است و می‌خواهیم Reference تابع بدون دلیل در هر Render عوض نشود.

پاسخ دقیق‌تر:

> useCallback خود منطق تابع را Cache نمی‌کند؛ Reference تابع را Memoize می‌کند تا تا زمانی که Dependencyها تغییر نکرده‌اند، همان Reference حفظ شود.

---

# 106. سؤال دانشجو: آیا `useCallback` جلوی اجرای تابع را می‌گیرد؟

خیر.

این اشتباه رایج است.

```jsx
useCallback(fn, deps)
```

یعنی Function Reference را Memoize کن.

تابع وقتی اجرا می‌شود که خودمان صدا بزنیم:

```js
loadMore()
```

---

# 107. سؤال دانشجو: `IntersectionObserver` Hook است؟

خیر.

این React Hook نیست.

یک Browser API است.

React Hook:

```text
useEffect
useRef
useCallback
useState
```

Browser API:

```text
IntersectionObserver
AbortController
fetch
```

---

# 108. سؤال دانشجو: چرا Observer را داخل `useEffect` می‌سازیم؟

چون ساخت Observer یک Side Effect است و به DOM Element بعد از Render نیاز دارد.

در Render مستقیم نباید هر بار بدون کنترل Observer جدید بسازیم.

Effect محل مناسبی برای:

```text
create observer
observe element
cleanup observer
```

است.

---

# 109. سؤال دانشجو: `observer.disconnect()` چه می‌کند؟

تمام Observationهای آن Observer را قطع می‌کند.

برای یک Sentinel همین کافی است.

روش دیگر:

```js
observer.unobserve(sentinel)
```

است که فقط همان Element را Unobserve می‌کند.

در این مثال `disconnect()` ساده و مناسب است.

---

# 110. سؤال دانشجو: چرا `entry.isIntersecting`؟

چون Callback Observer هم هنگام وارد شدن و هم خارج شدن Element می‌تواند اجرا شود.

ما فقط وقتی Element داخل محدوده است می‌خواهیم Load کنیم:

```js
if (entry.isIntersecting) {
  loadMore()
}
```

---

# 111. سؤال دانشجو: چرا `newItems` متغیر جداست؟

می‌شد مستقیم از:

```js
data.items
```

استفاده کرد.

اما:

```js
const newItems = data.items ?? []
```

خوانایی را بهتر می‌کند و `undefined/null` را به Array خالی تبدیل می‌کند.

---

# 112. سؤال دانشجو: چرا Map، مستقیم Spread نه؟

نسخه ساده Spread کاملاً قابل قبول است اگر Backend تضمین کند هیچ همپوشانی نداریم:

```js
setItems((prev) => [...prev, ...newItems])
```

Map نسخه دفاعی‌تر است:

```js
id تکراری → فقط یک Product
```

برای تدریس بهتر است اول Spread را آموزش دهید، بعد Map را به عنوان Improvement اضافه کنید.

---

# 113. سؤال دانشجو: چرا `hasNextPage` را از طول Items حدس نمی‌زنیم؟

مثلاً بعضی‌ها می‌گویند:

```js
if (data.items.length < PAGE_SIZE) {
  // end
}
```

گاهی این روش قابل استفاده است.

اما وقتی Backend صریحاً می‌گوید:

```js
hasNextPage
```

بهتر است از Contract خود Backend استفاده کنیم.

چون Backend ممکن است منطق Pagination خاص خودش را داشته باشد.

---

# 114. سؤال دانشجو: اگر API صفحه خالی بدهد چه؟

در نسخه ما:

```js
const newItems = data.items ?? []
```

پس Crash نمی‌کنیم.

تصمیم توقف بیشتر بر اساس:

```js
data.hasNextPage
```

است.

اگر Backend اشتباهاً `items=[]` ولی `hasNextPage=true` بدهد، Client طبق Contract فرض می‌کند صفحه بعد وجود دارد.

این یک مسئله Backend Contract است.

---

# 115. سؤال دانشجو: Infinite Scroll همیشه بهترین UX است؟

نه.

برای بعضی سناریوها Pagination بهتر است.

Infinite Scroll مناسب است وقتی:

- کاربر Browse می‌کند.
- ترتیب صفحات برایش اهمیت کمی دارد.
- می‌خواهیم تجربه پیوسته داشته باشیم.

Pagination ممکن است بهتر باشد وقتی:

- کاربر می‌خواهد به صفحه مشخص برگردد.
- URL قابل Share برای Page مهم است.
- Footer باید همیشه در دسترس باشد.
- داده‌های جدولی و مدیریتی داریم.

---

# 116. تمرین کلاس 1 — بدون Map

از دانشجو بخواهید این بخش را:

```js
setItems((prevItems) => {
  const map = new Map(...)
  // ...
})
```

به نسخه ساده تبدیل کند:

```js
setItems((prevItems) => [
  ...prevItems,
  ...newItems,
])
```

بعد توضیح دهد چه قابلیتی را از دست دادیم.

پاسخ:

```text
حذف Duplicate بر اساس id
```

---

# 117. تمرین کلاس 2 — تغییر Page Size

از:

```js
const PAGE_SIZE = 8
```

به:

```js
const PAGE_SIZE = 4
```

تغییر دهید.

Network Tab را بررسی کنید.

سؤال:

> آیا تعداد Requestها برای دیدن همه داده‌ها بیشتر می‌شود؟ چرا؟

---

# 118. تمرین کلاس 3 — rootMargin

ابتدا:

```js
rootMargin: '0px'
```

تست کنید.

بعد:

```js
rootMargin: '500px 0px'
```

مقایسه کنید LoadMore چه زمانی شروع می‌شود.

---

# 119. تمرین کلاس 4 — Sentinel قابل مشاهده

موقتاً:

```jsx
<div
  ref={sentinelRef}
  className="h-24 bg-red-500"
>
  SENTINEL
</div>
```

از دانشجو بخواهید با چشم ببیند چه لحظه‌ای Observer Trigger می‌شود.

---

# 120. تمرین کلاس 5 — حذف Lock

موقتاً این خط را حذف کنید:

```js
if (loadingRef.current) return
```

و در Network Tab رفتار را بررسی کنید.

بعد دوباره اضافه کنید.

این تمرین دلیل Ref Lock را بهتر از ده دقیقه توضیح تئوری نشان می‌دهد.

---

# 121. تمرین کلاس 6 — Retry

عمداً URL API را اشتباه کنید.

مثلاً `.env` را موقتاً خراب کنید.

ببینید:

```text
ErrorBox
```

نمایش داده می‌شود.

بعد URL را اصلاح و Retry را بزنید.

---

# 122. تمرین کلاس 7 — پایان داده

وقتی آخرین صفحه دریافت شد، در Console چاپ کنید:

```js
console.log('has next:', data.hasNextPage)
```

از دانشجو بخواهید توضیح دهد چرا بعد از `false` دیگر Request نمی‌رود.

---

# 123. تمرین کلاس 8 — بدون `useCallback`

`useCallback` را موقتاً حذف کنید و `loadMore` را Function معمولی بنویسید.

بعد درباره این صحبت کنید که چون Effect به `loadMore` وابسته است، Reference تابع چه اثری روی lifecycle Observer دارد.

هدف تمرین:

فهم Reference Equality.

---

# 124. تمرین کلاس 9 — State Page

از دانشجو بخواهید نسخه دیگری بنویسد که به جای:

```js
nextPageRef
```

از:

```jsx
const [page, setPage] = useState(1)
```

استفاده کند.

بعد دو طراحی را مقایسه کنید.

این تمرین برای فهم تفاوت State و Ref عالی است.

---

# 125. تمرین کلاس 10 — ساخت Custom Hook

بعد از تسلط کامل، چالش پیشرفته:

منطق را تبدیل کنید به:

```jsx
useInfiniteProducts()
```

مثلاً خروجی:

```js
{
  items,
  loading,
  error,
  hasNextPage,
  sentinelRef,
  retry: loadMore,
}
```

و Component فقط UI را Render کند.

---

# 126. ایده Custom Hook

اسکلت:

```jsx
function useInfiniteProducts() {
  const [items, setItems] = useState([])
  // ...

  return {
    items,
    loading,
    error,
    hasNextPage,
    sentinelRef,
    loadMore,
  }
}
```

در Component:

```jsx
const {
  items,
  loading,
  error,
  hasNextPage,
  sentinelRef,
  loadMore,
} = useInfiniteProducts()
```

این مرحله برای بعد از آموزش Hooks اصلی مناسب است.

---

# 127. خلاصه مفهومی تمام Hookها در این صفحه

## `useState`

```text
چه چیزی باید روی UI اثر بگذارد؟
```

- items
- loading
- error
- hasNextPage

## `useRef`

```text
چه چیزی باید بین Renderها حفظ شود ولی خودش باعث Render نشود؟
```

- sentinel DOM
- loading lock
- next page
- has next internal flag

## `useEffect`

```text
چه Side Effectهایی داریم؟
```

- Load اولیه
- ساخت Observer
- Cleanup Observer

## `useCallback`

```text
کدام Function را می‌خواهیم با Reference کنترل‌شده در Effect استفاده کنیم؟
```

- loadMore

---

# 128. خلاصه مفاهیم JavaScript استفاده‌شده

## Destructuring

```js
const [items, setItems] = useState([])
```

و:

```js
([entry]) => {}
```

---

## Spread

```js
[...prevItems, ...newItems]
```

---

## Optional Chaining

```js
err?.message
```

---

## Nullish Coalescing

```js
data.items ?? []
```

---

## Arrow Function

```js
(item) => item.id
```

---

## Async Function

```js
async () => {}
```

---

## Await

```js
await getProducts(...)
```

---

## Boolean Conversion

```js
Boolean(data.hasNextPage)
```

---

## Map Data Structure

```js
new Map()
```

---

## Array.from

```js
Array.from(map.values())
```

---

# 129. متن پیشنهادی تدریس `useRef`

می‌توانید تقریباً همین متن را در کلاس بگویید:

> «تا الان State داشتیم. State وقتی عوض می‌شود React را مجبور می‌کند UI را دوباره بررسی و Render کند. اما همیشه نمی‌خواهیم با تغییر یک مقدار Render اتفاق بیفتد. مثلاً فقط می‌خواهیم بدانیم الان Request در حال اجرا هست یا نه، یا Page بعدی چند است. این‌ها اطلاعات داخلی منطق ما هستند. `useRef` یک Box به ما می‌دهد که مقدارش داخل `.current` قرار می‌گیرد، بین Renderها حفظ می‌شود، ولی تغییرش خودش Render ایجاد نمی‌کند. یک کاربرد دیگرش هم گرفتن خود DOM Element است. بنابراین در همین مثال هم `sentinelRef` برای DOM داریم و هم `loadingRef` و `nextPageRef` برای مقدار داخلی.»

---

# 130. متن پیشنهادی تدریس `IntersectionObserver`

> «ما می‌توانستیم Scroll Event بگیریم و دائم حساب کنیم کاربر چند Pixel Scroll کرده، ولی Browser یک API آماده دارد که می‌گوید آیا یک Element وارد محدوده دید شده یا نه. پایین لیست یک div کوچک می‌گذاریم که اسمش را Sentinel می‌گذاریم. Observer آن را نگاه می‌کند. وقتی نزدیک Viewport شد، Callback اجرا می‌شود و `loadMore` را صدا می‌زنیم.»

---

# 131. متن پیشنهادی تدریس `loadMore`

> «`loadMore` یک مسئولیت دارد: صفحه بعدی را اگر ممکن بود بگیرد. قبل از هر چیز چک می‌کند Request دیگری در حال اجرا نباشد و Page بعد وجود داشته باشد. بعد Lock را فعال می‌کند، شماره Page را از Ref می‌گیرد، API را صدا می‌زند، داده جدید را به قبلی‌ها اضافه می‌کند، وضعیت hasNext را Update می‌کند و اگر موفق شد Page بعدی را جلو می‌برد. در `finally` هم Lock و Loading را آزاد می‌کند.»

---

# 132. متن پیشنهادی تدریس `Map`

> «اگر فقط دو Array را به هم بچسبانیم، فرض کرده‌ایم API هیچ آیتم تکراری نمی‌دهد. برای مقاوم‌تر شدن می‌توانیم Productها را داخل Map بریزیم و `id` را Key قرار بدهیم. چون Key در Map یکتا است، اگر id تکراری برسد Product دوبار در خروجی نخواهد بود.»

---

# 133. متن پیشنهادی تدریس Functional Update

> «چون Items جدید باید به Items قبلی اضافه شوند، State جدید به State قبلی وابسته است. پس بهتر است به جای استفاده مستقیم از `items` داخل Closure، از فرم تابعی `setItems(prev => ...)` استفاده کنیم. React آخرین State معتبر را به `prev` می‌دهد.»

---

# 134. سؤال امتحانی نمونه 1

**سؤال:** چرا در Infinite Scroll از `useRef` برای `loadingRef` استفاده شده است؟

**پاسخ:**

برای نگه داشتن یک Lock Mutable بین Renderها بدون ایجاد Render جدید و جلوگیری فوری از شروع Request همزمان/تکراری.

---

# 135. سؤال امتحانی نمونه 2

**سؤال:** Sentinel چیست؟

**پاسخ:**

یک DOM Element در انتهای لیست است که `IntersectionObserver` آن را مشاهده می‌کند تا نزدیک شدن کاربر به انتهای محتوا تشخیص داده شود.

---

# 136. سؤال امتحانی نمونه 3

**سؤال:** چرا در Infinite Scroll از Functional State Update استفاده می‌کنیم؟

**پاسخ:**

چون State جدید Items به آخرین State قبلی وابسته است و باید داده جدید به داده قبلی Append شود.

---

# 137. سؤال امتحانی نمونه 4

**سؤال:** نقش `hasNextPageRef` چیست؟

**پاسخ:**

نگه داشتن آخرین وضعیت وجود صفحه بعد برای کنترل مستقیم `loadMore` و جلوگیری از Request اضافه بعد از پایان داده.

---

# 138. سؤال امتحانی نمونه 5

**سؤال:** تفاوت `loading` و `loadingRef` چیست؟

**پاسخ:**

`loading` یک State برای Render UI است؛ `loadingRef` یک مقدار Mutable برای Lock منطقی است و تغییر آن خودش Render ایجاد نمی‌کند.

---

# 139. سؤال امتحانی نمونه 6

**سؤال:** `observer.disconnect()` چرا لازم است؟

**پاسخ:**

برای Cleanup و توقف Observer زمانی که Effect پاک یا Component Unmount می‌شود تا Observation غیرضروری باقی نماند.

---

# 140. سؤال امتحانی نمونه 7

**سؤال:** کاربرد `rootMargin` چیست؟

**پاسخ:**

محدوده Intersection را بزرگ یا کوچک می‌کند. مثلاً `300px` کمک می‌کند LoadMore کمی قبل از رسیدن واقعی کاربر به انتهای لیست شروع شود.

---

# 141. سؤال امتحانی نمونه 8

**سؤال:** چرا Page فقط بعد از Request موفق افزایش پیدا می‌کند؟

**پاسخ:**

تا اگر Request خطا داد، Retry همان Page انجام شود و صفحه‌ای Skip نشود.

---

# 142. سؤال امتحانی نمونه 9

**سؤال:** تفاوت `Map` و `Array.map()` چیست؟

**پاسخ:**

`Array.map()` یک Method برای تبدیل اعضای Array است؛ `Map` یک Data Structure برای نگهداری Key/Value با Keyهای یکتا است.

---

# 143. سؤال امتحانی نمونه 10

**سؤال:** چرا `IntersectionObserver` را Hook نمی‌نامیم؟

**پاسخ:**

چون بخشی از Web/Browser API است، نه React. Hookهای React در این مثال `useState`، `useRef`، `useEffect` و `useCallback` هستند.

---

# 144. Cheat Sheet نهایی

اگر دانشجو فقط بخواهد کل Infinite Scroll را در چند خط ذهنی حفظ کند:

```text
1. items را در State نگه دار.
2. loading/error/hasNextPage را مدیریت کن.
3. nextPage را در Ref نگه دار.
4. loadingRef برای جلوگیری از Request همزمان بساز.
5. پایین لیست یک Sentinel با DOM Ref قرار بده.
6. loadMore صفحه فعلی را از API بگیرد.
7. داده جدید را به قبلی‌ها Append کن.
8. بعد از موفقیت Page را افزایش بده.
9. hasNextPage=false شد، Request را متوقف کن.
10. IntersectionObserver وقتی Sentinel دیده شد loadMore را صدا بزند.
11. Observer را در Cleanup قطع کن.
```

---

# 145. خلاصه کد در کوچک‌ترین حالت مفهومی

```jsx
const [items, setItems] = useState([])

const sentinelRef = useRef(null)
const loadingRef = useRef(false)
const nextPageRef = useRef(1)
const hasNextPageRef = useRef(true)

const loadMore = useCallback(async () => {
  if (loadingRef.current || !hasNextPageRef.current) return

  loadingRef.current = true

  try {
    const page = nextPageRef.current
    const data = await getProducts(page, 8)

    setItems((prev) => [
      ...prev,
      ...data.items,
    ])

    hasNextPageRef.current = data.hasNextPage

    if (data.hasNextPage) {
      nextPageRef.current = page + 1
    }
  } finally {
    loadingRef.current = false
  }
}, [])

useEffect(() => {
  loadMore()
}, [loadMore])

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      loadMore()
    }
  })

  observer.observe(sentinelRef.current)

  return () => observer.disconnect()
}, [loadMore])
```

این نسخه برای حفظ کردن مفهوم خوب است، ولی نسخه کامل بخش 59 برای پروژه مناسب‌تر است چون Loading، Error، Empty State و Duplicate handling دارد.

---

# 146. یک دیاگرام نهایی برای تخته کلاس

روی تخته می‌توانید فقط این را بکشید:

```text
                    ┌─────────────────┐
                    │      User       │
                    └────────┬────────┘
                             │ scroll
                             ▼
                    ┌─────────────────┐
                    │    Sentinel     │
                    └────────┬────────┘
                             │ intersects
                             ▼
                    ┌─────────────────┐
                    │ IntersectionObs │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │    loadMore     │
                    └────────┬────────┘
                             │
           ┌─────────────────┴─────────────────┐
           │                                   │
           ▼                                   ▼
  loading already?                     has next page?
           │                                   │
           └────────── guard / return ─────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   getProducts   │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ API Response    │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ append + dedupe │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ next page + 1   │
                    └─────────────────┘
```

---

# 147. نتیجه‌گیری

اگر دانشجو Infinite Scroll این پروژه را واقعاً بفهمد، عملاً چند مفهوم بسیار مهم React و JavaScript را همزمان یاد گرفته است:

```text
React render lifecycle
useState
useRef
useEffect
useCallback
async/await
API pagination
functional updates
immutability
Map
DOM refs
IntersectionObserver
cleanup
loading/error handling
duplicate request prevention
stale closure awareness
```

مهم‌ترین نکته این است که کد را به صورت یک تکه حفظ نکند.

باید بتواند برای هر خط جواب بدهد:

```text
این خط چه مشکلی را حل می‌کند؟
اگر حذفش کنیم چه اتفاقی می‌افتد؟
چرا State است؟
چرا Ref است؟
چرا Effect است؟
چرا Callback است؟
```

اگر بتواند به این سؤال‌ها پاسخ بدهد، Infinite Scroll را واقعاً فهمیده است.

---

# ترتیب خیلی کوتاه پیشنهادی برای یک جلسه تدریس

```text
1. مرور API pagination
2. تفاوت Pagination و Infinite Scroll
3. Stateهای مورد نیاز
4. useRef از صفر
5. loadMore ساده
6. functional update
7. loadingRef lock
8. nextPageRef
9. hasNextPageRef
10. Sentinel
11. IntersectionObserver
12. useEffect + cleanup
13. useCallback
14. Map و dedupe
15. Error + Retry
16. تست در Network Tab
17. React StrictMode
18. تمرین دانشجو
```

اگر زمان کم بود، ابتدا نسخه ساده را بدون Map و AbortController تدریس کنید و آن دو را به عنوان بخش پیشرفته جلسه بعد نگه دارید.
