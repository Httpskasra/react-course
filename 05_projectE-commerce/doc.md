# سناریوی کامل آموزش پروژه Mini E-Commerce Admin Dashboard

## شروع کلاس — معرفی پروژه

ابتدا پروژه را اجرا کن:

```bash
npm install
npm run start
```

بعد در مرورگر باز کن:

```txt
http://localhost:5173
```

و این متن را بگو:

امروز قرار نیست چند تمرین جداگانه React انجام بدهیم. قرار است یک پروژه واقعی‌تر بسازیم؛ یک پنل مدیریت فروشگاه کوچک. در این پروژه یک ادمین می‌تواند محصولات را ببیند، جستجو کند، محصول جدید اضافه کند، جزئیات محصول را ببیند، محصول را ویرایش کند و حذف کند.

این پروژه برای یادگیری چند مفهوم مهم React طراحی شده است:

React Components، Routing، Forms، Controlled Components، useState، useEffect، API Integration، Axios، Loading State، Error Handling، Empty State، Custom Hooks و Context API.

هدف این است که دانشجو فقط syntax حفظ نکند، بلکه بفهمد این مفاهیم در یک پروژه واقعی کجا استفاده می‌شوند.

---

# بخش 1 — معرفی ساختار پروژه

## فایل‌هایی که باز می‌کنی

ابتدا این فایل‌ها را نشان بده:

```txt
src/
├── api/
├── components/
├── context/
├── hooks/
├── pages/
├── services/
├── App.jsx
├── main.jsx
└── index.css
```

## توضیحی که می‌گویی

در پروژه‌های واقعی React معمولاً همه چیز را داخل یک فایل نمی‌نویسیم. پروژه را بر اساس مسئولیت‌ها تقسیم می‌کنیم.

پوشه `pages` برای صفحه‌های اصلی برنامه است، مثل Dashboard، Products، AddProduct و EditProduct.

پوشه `components` برای قطعات قابل استفاده مجدد است، مثل Navbar، Sidebar، Loading، ErrorMessage و ProductTable.

پوشه `services` جایی است که منطق ارتباط با API را نگه می‌داریم.

پوشه `api` برای تنظیمات پایه Axios است.

پوشه `hooks` برای Custom Hookهاست؛ یعنی منطق‌های قابل استفاده مجدد مثل fetch کردن دیتا یا debounce کردن سرچ.

پوشه `context` برای stateهای global است. در این پروژه برای شبیه‌سازی login از Context API استفاده کرده‌ایم.

این ساختار باعث می‌شود پروژه تمیزتر، قابل توسعه‌تر و شبیه پروژه‌های واقعی بازار کار باشد.

---

# بخش 2 — فایل package.json

## فایل

```txt
package.json
```

## این قسمت‌ها را نشان بده

```json
"scripts": {
  "dev": "vite",
  "server": "json-server --watch db.json --port 3001",
  "start": "concurrently \"npm run server\" \"npm run dev\"",
  "build": "vite build",
  "preview": "vite preview"
}
```

## توضیحی که می‌گویی

در فایل `package.json` اسکریپت‌های اجرای پروژه را داریم.

دستور `npm run dev` فقط فرانت‌اند React را با Vite اجرا می‌کند.

دستور `npm run server` یک API fake با استفاده از `json-server` اجرا می‌کند.

دستور `npm run start` هر دو را همزمان اجرا می‌کند؛ یعنی هم React روی پورت 5173 بالا می‌آید و هم API روی پورت 3001.

این کار در پروژه‌های آموزشی خیلی مفید است، چون بدون ساختن backend واقعی می‌توانیم CRUD واقعی را تمرین کنیم.

---

# بخش 3 — دیتابیس fake با json-server

## فایل

```txt
db.json
```

## توضیحی که می‌گویی

در این پروژه برای اینکه API واقعی داشته باشیم، از `json-server` استفاده کرده‌ایم.

این فایل نقش دیتابیس ساده ما را دارد. داخل آن یک آرایه به نام `products` داریم.

هر محصول چند فیلد دارد:

```txt
id
title
price
category
description
image
stock
```

وقتی json-server اجرا می‌شود، به صورت خودکار برای ما این endpointها را می‌سازد:

```txt
GET    /products
GET    /products/:id
POST   /products
PATCH  /products/:id
DELETE /products/:id
```

یعنی ما می‌توانیم دقیقاً مثل یک پروژه واقعی با API کار کنیم.

---

# بخش 4 — نقطه ورود برنامه

## فایل

```txt
src/main.jsx
```

## توضیحی که می‌گویی

این فایل نقطه شروع برنامه React است.

در این قسمت:

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(...)
```

React می‌آید و کل برنامه را داخل المنتی با id برابر `root` قرار می‌دهد. آن `root` داخل فایل `index.html` وجود دارد.

حالا به این قسمت دقت کنید:

```jsx
<BrowserRouter>
  <AuthProvider>
    <App />
  </AuthProvider>
</BrowserRouter>
```

ما کل برنامه را داخل `BrowserRouter` گذاشته‌ایم تا بتوانیم routing داشته باشیم.

همچنین کل برنامه را داخل `AuthProvider` گذاشته‌ایم تا همه کامپوننت‌ها به اطلاعات login دسترسی داشته باشند.

پس `main.jsx` سه کار مهم انجام می‌دهد:

اول: React را به HTML وصل می‌کند.

دوم: Router را فعال می‌کند.

سوم: Auth Context را دور کل برنامه قرار می‌دهد.

---

# بخش 5 — Routing و Protected Route

## فایل

```txt
src/App.jsx
```

## توضیحی که می‌گویی

در این فایل مسیرهای اصلی برنامه را تعریف کرده‌ایم.

این قسمت را ببینید:

```jsx
<Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
<Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
<Route path="/products/add" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
<Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
<Route path="/products/:id/edit" element={<ProtectedRoute><EditProduct /></ProtectedRoute>} />
```

هر route مشخص می‌کند وقتی کاربر وارد یک آدرس خاص شد، کدام صفحه نمایش داده شود.

مثلاً:

```txt
/products
```

صفحه لیست محصولات را نشان می‌دهد.

```txt
/products/1
```

جزئیات محصول با id برابر 1 را نشان می‌دهد.

```txt
/products/1/edit
```

فرم ویرایش همان محصول را نشان می‌دهد.

حالا به `ProtectedRoute` نگاه کنید.

```jsx
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (...)
  }

  return children
}
```

اینجا ما داریم شبیه‌سازی می‌کنیم که بعضی صفحات فقط برای ادمین قابل مشاهده باشند.

اگر کاربر login نکرده باشد، صفحه اصلی نشان داده نمی‌شود و پیام Authentication Required نمایش داده می‌شود.

اگر login کرده باشد، همان page اصلی نمایش داده می‌شود.

در پروژه واقعی، این قسمت به token و backend وصل می‌شود؛ ولی اینجا برای آموزش Context API آن را ساده‌سازی کرده‌ایم.

---

# بخش 6 — Context API برای Login شبیه‌سازی‌شده

## فایل

```txt
src/context/AuthContext.jsx
```

## توضیحی که می‌گویی

Context API زمانی استفاده می‌شود که یک state را چند جای مختلف برنامه لازم داریم.

مثلاً اطلاعات کاربر login شده را هم Navbar لازم دارد، هم ProtectedRoute، و شاید بعداً صفحات دیگر هم لازم داشته باشند.

اگر Context نداشته باشیم، باید user را از App به Layout، بعد Navbar، بعد چند کامپوننت دیگر با props پاس بدهیم. به این مشکل می‌گوییم props drilling.

اینجا ما یک Context ساخته‌ایم:

```jsx
const AuthContext = createContext(null)
```

بعد داخل `AuthProvider` یک state داریم:

```jsx
const [user, setUser] = useState({
  name: 'Admin User',
  email: 'admin@shop.com',
  role: 'Store Manager',
})
```

اگر user مقدار داشته باشد یعنی کاربر login است.

اگر user برابر null شود یعنی logout شده است.

تابع login دوباره user را مقداردهی می‌کند:

```jsx
const login = () => {
  setUser(...)
}
```

تابع logout هم user را null می‌کند:

```jsx
const logout = () => setUser(null)
```

در آخر این اطلاعات را داخل Provider می‌گذاریم:

```jsx
<AuthContext.Provider value={value}>
  {children}
</AuthContext.Provider>
```

حالا هر کامپوننتی که داخل AuthProvider باشد، می‌تواند با `useAuth` به user، login، logout و isAuthenticated دسترسی داشته باشد.

این یک الگوی رایج در پروژه‌های واقعی React است.

---

# بخش 7 — Layout کلی برنامه

## فایل

```txt
src/components/Layout.jsx
```

## توضیحی که می‌گویی

Layout یعنی اسکلت ثابت برنامه.

در داشبوردهای واقعی معمولاً Sidebar و Navbar در همه صفحات ثابت هستند و فقط محتوای وسط صفحه عوض می‌شود.

در این فایل داریم:

```jsx
<Sidebar />
<Navbar />
<Outlet />
```

کامپوننت `Sidebar` منوی سمت چپ است.

کامپوننت `Navbar` نوار بالای صفحه است.

اما `Outlet` مربوط به React Router است. هر صفحه‌ای که route آن فعال باشد، داخل `Outlet` نمایش داده می‌شود.

مثلاً اگر مسیر `/products` باشد، کامپوننت `Products` داخل Outlet قرار می‌گیرد.

اگر مسیر `/products/add` باشد، کامپوننت `AddProduct` داخل Outlet قرار می‌گیرد.

پس Layout کمک می‌کند ساختار ثابت صفحه را فقط یک بار بنویسیم.

---

# بخش 8 — Sidebar و NavLink

## فایل

```txt
src/components/Sidebar.jsx
```

## توضیحی که می‌گویی

در Sidebar یک آرایه به نام `navItems` داریم:

```jsx
const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/products/add', label: 'Add Product', icon: PlusCircle },
]
```

به جای اینکه لینک‌ها را دستی تکرار کنیم، اطلاعات لینک‌ها را داخل یک آرایه گذاشته‌ایم و بعد با `map` آن‌ها را تبدیل به UI کرده‌ایم.

این روش در پروژه‌های واقعی خیلی استفاده می‌شود، چون اگر بعداً بخواهیم یک آیتم جدید اضافه کنیم فقط کافی است یک object جدید به آرایه اضافه کنیم.

اینجا به جای `Link` از `NavLink` استفاده شده است.

تفاوت مهم این است که `NavLink` می‌تواند بفهمد کدام مسیر فعال است.

برای همین این قسمت را داریم:

```jsx
className={({ isActive }) => ...}
```

اگر route فعال باشد، رنگ آیتم تغییر می‌کند.

این برای منوهای داشبورد خیلی کاربردی است.

---

# بخش 9 — Navbar و استفاده از Auth Context

## فایل

```txt
src/components/Navbar.jsx
```

## توضیحی که می‌گویی

Navbar از Context استفاده می‌کند:

```jsx
const { user, isAuthenticated, login, logout } = useAuth()
```

اینجا بدون اینکه props از کامپوننت‌های بالاتر بگیریم، مستقیم به وضعیت login دسترسی داریم.

اگر کاربر login باشد، اطلاعات user و دکمه Logout نمایش داده می‌شود.

اگر login نباشد، دکمه Login نمایش داده می‌شود.

این قسمت را ببینید:

```jsx
{isAuthenticated ? (...) : (...)}
```

این یک conditional rendering است.

یعنی UI بر اساس state تغییر می‌کند.

وقتی روی Logout کلیک می‌کنیم، تابع `logout` اجرا می‌شود و user برابر null می‌شود. بعد چون isAuthenticated false می‌شود، UI هم تغییر می‌کند.

این یکی از مهم‌ترین مفاهیم React است: UI تابع state است.

---

# بخش 10 — Tailwind CSS و کلاس‌های مشترک

## فایل

```txt
src/index.css
```

## توضیحی که می‌گویی

در این پروژه از Tailwind CSS استفاده کرده‌ایم.

اما برای اینکه کلاس‌ها خیلی تکراری نشوند، چند کلاس مشترک ساخته‌ایم:

```css
.btn-primary
.btn-secondary
.input-field
.card
```

مثلاً به جای اینکه هر بار برای دکمه اصلی کلی کلاس Tailwind بنویسیم، یک کلاس `btn-primary` ساخته‌ایم.

این قسمت:

```css
@layer components {
  .btn-primary {
    @apply ...
  }
}
```

یعنی داریم یک component class سفارشی با Tailwind می‌سازیم.

این کار باعث می‌شود UI یکدست‌تر شود و کد JSX تمیزتر بماند.

---

# بخش 11 — Axios Instance

## فایل

```txt
src/api/axios.js
```

## توضیحی که می‌گویی

برای ارتباط با API از Axios استفاده کرده‌ایم.

در این فایل یک instance ساخته‌ایم:

```jsx
const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
})
```

مزیت این کار این است که baseURL را فقط یک بار تعریف می‌کنیم.

بعد در همه جای پروژه به جای اینکه بنویسیم:

```txt
http://localhost:3001/products
```

فقط می‌نویسیم:

```txt
/products
```

در پروژه واقعی اگر آدرس API عوض شود، فقط همین فایل را تغییر می‌دهیم.

---

# بخش 12 — Service Layer برای محصولات

## فایل

```txt
src/services/productService.js
```

## توضیحی که می‌گویی

در پروژه‌های تمیز، بهتر است کد API را مستقیم داخل کامپوننت‌ها ننویسیم.

برای همین یک فایل service ساخته‌ایم.

اینجا تمام عملیات محصولات قرار دارد:

```jsx
getAllProducts
getProductById
createProduct
updateProduct
deleteProduct
```

مثلاً:

```jsx
getAllProducts: async (search = '') => {
  const query = search ? `?q=${encodeURIComponent(search)}` : ''
  const response = await api.get(`/products${query}`)
  return response.data
}
```

این تابع همه محصولات را از API می‌گیرد.

اگر search داشته باشیم، به API query اضافه می‌کنیم.

مثلاً:

```txt
/products?q=phone
```

برای ساخت محصول جدید:

```jsx
api.post('/products', product)
```

برای ویرایش:

```jsx
api.patch(`/products/${id}`, product)
```

برای حذف:

```jsx
api.delete(`/products/${id}`)
```

این separation باعث می‌شود کامپوننت‌ها فقط روی UI تمرکز کنند و منطق API در یک جای جدا نگهداری شود.

---

# بخش 13 — Loading، Error و Empty State

## فایل‌ها

```txt
src/components/Loading.jsx
src/components/ErrorMessage.jsx
src/components/EmptyState.jsx
```

## توضیحی که می‌گویی

در هر پروژه واقعی وقتی با API کار می‌کنیم، فقط حالت موفقیت نداریم.

سه حالت مهم داریم:

اول: Loading، یعنی داده هنوز در حال دریافت است.

دوم: Error، یعنی API خطا داده یا ارتباط برقرار نشده است.

سوم: Empty State، یعنی API موفق بوده ولی داده‌ای وجود ندارد.

برای همین سه کامپوننت جدا ساخته‌ایم.

در `Loading.jsx` یک spinner ساده داریم.

در `ErrorMessage.jsx` پیام خطا و دکمه Try again داریم.

در `EmptyState.jsx` وقتی لیست خالی است یک پیام مناسب نشان می‌دهیم.

این کار UX برنامه را بهتر می‌کند و پروژه را حرفه‌ای‌تر نشان می‌دهد.

---

# بخش 14 — Custom Hook useFetch

## فایل

```txt
src/hooks/useFetch.js
```

## توضیحی که می‌گویی

قبل از Custom Hook، اگر در چند صفحه بخواهیم API call انجام دهیم، باید چند بار این stateها را تکرار کنیم:

```jsx
const [data, setData] = useState(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)
```

و چند بار `useEffect` بنویسیم.

برای جلوگیری از تکرار، یک custom hook ساخته‌ایم به نام `useFetch`.

این hook یک تابع fetcher می‌گیرد:

```jsx
useFetch(() => productService.getAllProducts(), [])
```

داخل hook این اتفاق می‌افتد:

```jsx
setLoading(true)
setError(null)
const result = await fetcher()
setData(result)
```

اگر موفق باشد، data پر می‌شود.

اگر خطا بدهد، error پر می‌شود.

در نهایت loading false می‌شود.

این hook این موارد را برمی‌گرداند:

```jsx
data
loading
error
refetch
setData
```

`refetch` برای زمانی است که بخواهیم دوباره API را صدا بزنیم.

`setData` هم برای زمانی است که بخواهیم بعد از حذف محصول، UI را سریع آپدیت کنیم.

این دقیقاً یکی از کاربردهای مهم custom hook در React است: خارج کردن منطق تکراری از کامپوننت‌ها.

---

# بخش 15 — Custom Hook useDebounce

## فایل

```txt
src/hooks/useDebounce.js
```

## توضیحی که می‌گویی

فرض کنید کاربر در search box تایپ می‌کند.

اگر با هر حرفی که تایپ می‌کند API call بزنیم، تعداد درخواست‌ها خیلی زیاد می‌شود.

مثلاً اگر کاربر بنویسد:

```txt
iphone
```

ممکن است برای i، بعد ip، بعد iph، بعد ipho، بعد iphon، بعد iphone درخواست بفرستیم.

این کار بهینه نیست.

برای همین از debounce استفاده می‌کنیم.

در این hook می‌گوییم:

وقتی مقدار search تغییر کرد، 500 میلی‌ثانیه صبر کن. اگر در این مدت کاربر دوباره تایپ نکرد، مقدار نهایی را برگردان.

این قسمت مهم است:

```jsx
const timer = setTimeout(() => {
  setDebouncedValue(value)
}, delay)

return () => clearTimeout(timer)
```

`setTimeout` مقدار را با تأخیر آپدیت می‌کند.

`clearTimeout` باعث می‌شود timer قبلی حذف شود.

این cleanup خیلی مهم است، چون اگر کاربر سریع تایپ کند، timerهای قبلی نباید اجرا شوند.

---

# بخش 16 — Dashboard Page

## فایل

```txt
src/pages/Dashboard.jsx
```

## توضیحی که می‌گویی

Dashboard صفحه خلاصه مدیریتی است.

در ابتدای فایل محصولات را از API می‌گیریم:

```jsx
const { data: products, loading, error, refetch } = useFetch(() => productService.getAllProducts(), [])
```

بعد اول حالت‌های مختلف را چک می‌کنیم:

```jsx
if (loading) return <Loading />
if (error) return <ErrorMessage />
if (!products || products.length === 0) return <EmptyState />
```

این الگو خیلی مهم است.

در پروژه‌های واقعی معمولاً قبل از نمایش UI اصلی، باید loading، error و empty را مدیریت کنیم.

بعد چند آمار محاسبه می‌کنیم:

```jsx
const categories = [...new Set(products.map((product) => product.category))]
```

اینجا دسته‌بندی‌ها را unique می‌کنیم.

```jsx
const lowStockProducts = products.filter((product) => Number(product.stock) <= 5)
```

اینجا محصولاتی را پیدا می‌کنیم که موجودی کم دارند.

```jsx
const totalValue = products.reduce((sum, product) => sum + Number(product.price) * Number(product.stock || 0), 0)
```

اینجا ارزش کل انبار را حساب می‌کنیم.

این صفحه خوب نشان می‌دهد که React فقط نمایش دیتا نیست؛ ما می‌توانیم دیتا را پردازش کنیم و بعد UI بسازیم.

---

# بخش 17 — Products Page

## فایل

```txt
src/pages/Products.jsx
```

## توضیحی که می‌گویی

این صفحه مهم‌ترین صفحه پروژه است، چون چند مفهوم را با هم دارد:

useState، search، debounce، custom hook، API، delete، conditional rendering و تغییر view mode.

اینجا دو state داریم:

```jsx
const [search, setSearch] = useState('')
const [viewMode, setViewMode] = useState('table')
```

`search` مقدار input جستجو را نگه می‌دارد.

`viewMode` مشخص می‌کند محصولات به صورت table نمایش داده شوند یا grid.

بعد search را debounce می‌کنیم:

```jsx
const debouncedSearch = useDebounce(search, 500)
```

یعنی API با هر تایپ صدا زده نمی‌شود، بلکه بعد از کمی توقف کاربر اجرا می‌شود.

بعد تابع گرفتن محصولات را می‌سازیم:

```jsx
const fetchProducts = useCallback(() => productService.getAllProducts(debouncedSearch), [debouncedSearch])
```

چون این تابع به `debouncedSearch` وابسته است، هر وقت search نهایی تغییر کند، تابع جدید ساخته می‌شود و useFetch دوباره محصولات را می‌گیرد.

بعد این قسمت را داریم:

```jsx
const { data: products, loading, error, refetch, setData } = useFetch(fetchProducts, [fetchProducts])
```

اینجا products از API می‌آید.

در حذف محصول:

```jsx
await productService.deleteProduct(id)
setData((currentProducts) => currentProducts.filter((product) => product.id !== id))
```

اول از API حذف می‌کنیم.

بعد بدون اینکه دوباره کل لیست را بگیریم، همان محصول را از state حذف می‌کنیم.

این باعث می‌شود UI سریع آپدیت شود.

در پایین صفحه هم conditional rendering داریم:

اگر loading باشد Loading نشان می‌دهیم.

اگر error باشد ErrorMessage نشان می‌دهیم.

اگر لیست خالی باشد EmptyState نشان می‌دهیم.

اگر محصول وجود داشته باشد، بسته به viewMode یا ProductTable نشان می‌دهیم یا ProductCard.

---

# بخش 18 — جدول محصولات

## فایل

```txt
src/components/ProductTable.jsx
```

## توضیحی که می‌گویی

این کامپوننت فقط مسئول نمایش محصولات در قالب جدول است.

به این نکته دقت کنید:

```jsx
export default function ProductTable({ products, onDelete }) {
```

این کامپوننت خودش API call انجام نمی‌دهد.

فقط محصولات و تابع حذف را از parent می‌گیرد.

این یعنی separation of concerns.

صفحه Products مسئول گرفتن دیتا و مدیریت state است.

ProductTable فقط مسئول نمایش UI است.

داخل جدول با `products.map` روی محصولات loop می‌زنیم و برای هر محصول یک row می‌سازیم.

برای هر محصول سه action داریم:

View:

```jsx
/products/:id
```

Edit:

```jsx
/products/:id/edit
```

Delete:

```jsx
onDelete(product.id)
```

این الگو در داشبوردهای ادمین خیلی رایج است.

---

# بخش 19 — کارت محصول

## فایل

```txt
src/components/ProductCard.jsx
```

## توضیحی که می‌گویی

ProductCard همان اطلاعات محصول را به شکل card نمایش می‌دهد.

این کامپوننت برای grid view استفاده می‌شود.

نکته آموزشی اینجاست که ما یک دیتا داریم، ولی دو UI متفاوت برای آن ساخته‌ایم:

ProductTable برای حالت جدولی.

ProductCard برای حالت کارتی.

این نشان می‌دهد که کامپوننت‌ها می‌توانند قابل تعویض و reusable باشند.

---

# بخش 20 — Product Details Page

## فایل

```txt
src/pages/ProductDetails.jsx
```

## توضیحی که می‌گویی

این صفحه برای نمایش جزئیات یک محصول است.

ما از URL باید id محصول را بگیریم.

برای این کار از `useParams` استفاده می‌کنیم:

```jsx
const { id } = useParams()
```

اگر آدرس این باشد:

```txt
/products/3
```

مقدار id برابر 3 می‌شود.

بعد با این id از API محصول را می‌گیریم:

```jsx
useFetch(() => productService.getProductById(id), [id])
```

نکته مهم این است که id داخل dependency قرار گرفته است.

یعنی اگر id تغییر کند، محصول جدید دوباره fetch می‌شود.

این صفحه نمونه خوبی برای routeهای dynamic است.

---

# بخش 21 — Add Product و Controlled Components

## فایل

```txt
src/pages/AddProduct.jsx
```

## توضیحی که می‌گویی

این صفحه برای آموزش فرم‌ها بسیار مهم است.

در React معمولاً فرم را به صورت controlled component می‌سازیم.

یعنی مقدار input از state می‌آید و هر تغییر input دوباره state را آپدیت می‌کند.

اول یک فرم اولیه داریم:

```jsx
const initialForm = {
  title: '',
  price: '',
  category: '',
  description: '',
  image: '',
  stock: '',
}
```

بعد داخل کامپوننت:

```jsx
const [form, setForm] = useState(initialForm)
```

حالا کل فرم داخل یک state object نگهداری می‌شود.

برای inputها این الگو را داریم:

```jsx
<input
  name="title"
  value={form.title}
  onChange={handleChange}
/>
```

یعنی مقدار input از `form.title` می‌آید.

هر وقت کاربر تایپ کند، `handleChange` اجرا می‌شود.

تابع handleChange:

```jsx
const handleChange = (event) => {
  const { name, value } = event.target
  setForm((currentForm) => ({ ...currentForm, [name]: value }))
}
```

اینجا یک نکته خیلی مهم داریم.

چون name هر input با کلید داخل form یکی است، می‌توانیم یک handleChange عمومی برای همه inputها داشته باشیم.

مثلاً اگر input name برابر title باشد، این قسمت:

```jsx
[name]: value
```

می‌شود:

```jsx
title: value
```

اگر name برابر price باشد، می‌شود:

```jsx
price: value
```

پس لازم نیست برای هر input یک onChange جدا بنویسیم.

در submit فرم:

```jsx
event.preventDefault()
```

باعث می‌شود صفحه refresh نشود.

بعد payload را آماده می‌کنیم:

```jsx
const payload = {
  ...form,
  price: Number(form.price),
  stock: Number(form.stock),
}
```

چون مقدار input همیشه string است، price و stock را به number تبدیل می‌کنیم.

بعد محصول را می‌سازیم:

```jsx
const createdProduct = await productService.createProduct(payload)
```

و در آخر کاربر را به صفحه جزئیات محصول جدید می‌بریم:

```jsx
navigate(`/products/${createdProduct.id}`)
```

این صفحه مفاهیم فرم، state، submit، API POST و navigation را با هم آموزش می‌دهد.

---

# بخش 22 — Edit Product و useEffect

## فایل

```txt
src/pages/EditProduct.jsx
```

## توضیحی که می‌گویی

صفحه Edit شبیه Add است، اما یک تفاوت مهم دارد.

در AddProduct فرم از اول خالی است.

اما در EditProduct اول باید محصول را با id بگیریم، بعد فرم را با اطلاعات آن پر کنیم.

اول id را از URL می‌گیریم:

```jsx
const { id } = useParams()
```

بعد stateهای صفحه را داریم:

```jsx
const [form, setForm] = useState(null)
const [loading, setLoading] = useState(true)
const [submitting, setSubmitting] = useState(false)
const [error, setError] = useState(null)
```

چون فرم باید بعد از گرفتن محصول ساخته شود، مقدار اولیه form را null گذاشته‌ایم.

حالا به useEffect نگاه کنید:

```jsx
useEffect(() => {
  ...
}, [id])
```

این effect وقتی کامپوننت mount می‌شود اجرا می‌شود و اگر id تغییر کند دوباره اجرا می‌شود.

داخل آن محصول را از API می‌گیریم:

```jsx
const product = await productService.getProductById(id)
```

بعد فرم را با اطلاعات محصول پر می‌کنیم:

```jsx
setForm({
  title: product.title || '',
  price: product.price || '',
  category: product.category || '',
  description: product.description || '',
  image: product.image || '',
  stock: product.stock || '',
})
```

اینجا یک cleanup هم داریم:

```jsx
return () => {
  ignore = true
}
```

این برای جلوگیری از مشکل احتمالی است؛ اگر کامپوننت قبل از تمام شدن API request از صفحه حذف شود، دیگر state را آپدیت نکنیم.

این مفهوم در پروژه‌های واقعی مهم است، مخصوصاً وقتی API کند باشد یا کاربر سریع بین صفحات جابه‌جا شود.

در submit این صفحه به جای POST از PATCH استفاده می‌کنیم:

```jsx
await productService.updateProduct(id, payload)
```

چون محصول از قبل وجود دارد و فقط می‌خواهیم آن را ویرایش کنیم.

بعد کاربر را به صفحه جزئیات همان محصول می‌بریم:

```jsx
navigate(`/products/${id}`)
```

---

# بخش 23 — تفاوت Add و Edit را این‌طور توضیح بده

## توضیحی که می‌گویی

AddProduct و EditProduct از نظر UI شبیه هم هستند، اما از نظر منطق تفاوت دارند.

در AddProduct:

فرم از اول خالی است.

از POST استفاده می‌کنیم.

بعد از ساخت محصول، به صفحه محصول جدید می‌رویم.

در EditProduct:

اول id را از URL می‌گیریم.

بعد با useEffect محصول را از API می‌گیریم.

فرم را با اطلاعات قبلی محصول پر می‌کنیم.

از PATCH استفاده می‌کنیم.

بعد از ویرایش، به صفحه جزئیات همان محصول برمی‌گردیم.

این تفاوت بین Create و Update یکی از اصلی‌ترین مفاهیم CRUD است.

---

# بخش 24 — ترتیب پیشنهادی جلسات آموزشی

## جلسه اول — معرفی پروژه و ساختار

فایل‌هایی که توضیح می‌دهی:

```txt
package.json
db.json
src/main.jsx
src/App.jsx
src/components/Layout.jsx
src/index.css
```

متن آموزشی:

در این جلسه هدف این است که بفهمیم پروژه از چه بخش‌هایی ساخته شده است. هنوز لازم نیست وارد جزئیات API و فرم‌ها شویم. فقط می‌خواهیم بدانیم برنامه از کجا شروع می‌شود، routeها کجا تعریف شده‌اند، layout کلی کجاست و دیتای fake از کجا می‌آید.

تمرین دانشجو:

یک آیتم جدید به Sidebar اضافه کند، مثلاً لینک Dashboard یا Products را تغییر دهد و active بودن NavLink را ببیند.

---

## جلسه دوم — Components و UI

فایل‌هایی که توضیح می‌دهی:

```txt
src/components/Navbar.jsx
src/components/Sidebar.jsx
src/components/ProductTable.jsx
src/components/ProductCard.jsx
src/components/Loading.jsx
src/components/ErrorMessage.jsx
src/components/EmptyState.jsx
```

متن آموزشی:

در این جلسه تمرکز ما روی component architecture است. یاد می‌گیریم چطور UI را به قطعات کوچک‌تر تقسیم کنیم. هر کامپوننت باید یک مسئولیت مشخص داشته باشد. ProductTable فقط جدول را نشان می‌دهد، ProductCard فقط کارت را نشان می‌دهد، Loading فقط حالت loading را نشان می‌دهد.

تمرین دانشجو:

یک Badge جدید برای stock اضافه کند. اگر stock کمتر از 5 بود رنگ قرمز یا نارنجی بگیرد.

---

## جلسه سوم — API و Service Layer

فایل‌هایی که توضیح می‌دهی:

```txt
src/api/axios.js
src/services/productService.js
db.json
```

متن آموزشی:

در این جلسه یاد می‌گیریم چطور React را به API وصل کنیم. ما API واقعی backend نداریم، ولی json-server برای ما endpointهای واقعی می‌سازد. Axios مسئول ارسال request است و productService مسئول نگهداری توابع مربوط به محصولات است.

تمرین دانشجو:

یک محصول جدید مستقیم داخل `db.json` اضافه کند و ببیند در داشبورد و لیست محصولات نمایش داده می‌شود.

---

## جلسه چهارم — Dashboard و Fetch Data

فایل‌هایی که توضیح می‌دهی:

```txt
src/pages/Dashboard.jsx
src/hooks/useFetch.js
```

متن آموزشی:

در این جلسه یاد می‌گیریم چطور دیتا را از API بگیریم و بر اساس آن آمار بسازیم. همچنین یاد می‌گیریم هر API call باید loading، error و empty state داشته باشد.

تمرین دانشجو:

یک کارت آماری جدید اضافه کند، مثلاً Average Price.

---

## جلسه پنجم — Products Page، Search و Delete

فایل‌هایی که توضیح می‌دهی:

```txt
src/pages/Products.jsx
src/hooks/useDebounce.js
src/components/ProductTable.jsx
src/components/ProductCard.jsx
```

متن آموزشی:

در این جلسه صفحه محصولات را بررسی می‌کنیم. این صفحه هم search دارد، هم table/grid view، هم delete. همچنین debounce را یاد می‌گیریم تا با هر تایپ کاربر API call نزنیم.

تمرین دانشجو:

به جای `window.confirm` یک modal ساده برای تأیید حذف بسازد.

---

## جلسه ششم — Forms و Add Product

فایل‌هایی که توضیح می‌دهی:

```txt
src/pages/AddProduct.jsx
```

متن آموزشی:

در این جلسه controlled components را یاد می‌گیریم. هر input به state وصل است. کاربر هر چیزی تایپ کند، React state آپدیت می‌شود. هنگام submit، اطلاعات فرم را به API می‌فرستیم و محصول جدید ساخته می‌شود.

تمرین دانشجو:

validation ساده اضافه کند. مثلاً اگر price کمتر از صفر بود، اجازه submit ندهد.

---

## جلسه هفتم — useEffect و Edit Product

فایل‌هایی که توضیح می‌دهی:

```txt
src/pages/EditProduct.jsx
```

متن آموزشی:

در این جلسه useEffect را در یک سناریوی واقعی یاد می‌گیریم. وقتی وارد صفحه edit می‌شویم، باید اول محصول را با id از API بگیریم، بعد فرم را پر کنیم. اینجا lifecycle کامپوننت و dependency array را بهتر درک می‌کنیم.

تمرین دانشجو:

اگر محصول پیدا نشد، کاربر را به صفحه Products برگرداند یا پیام Product not found نشان دهد.

---

## جلسه هشتم — Context API و Authentication Simulation

فایل‌هایی که توضیح می‌دهی:

```txt
src/context/AuthContext.jsx
src/main.jsx
src/App.jsx
src/components/Navbar.jsx
```

متن آموزشی:

در این جلسه یاد می‌گیریم چطور یک state global بسازیم. وضعیت login باید هم در Navbar استفاده شود، هم در ProtectedRoute. پس به جای props drilling از Context API استفاده می‌کنیم.

تمرین دانشجو:

نام user را در Dashboard هم نمایش دهد.

---

# بخش 25 — جمله پایانی برای جمع‌بندی دوره

در پایان پروژه این متن را بگو:

در این پروژه ما تقریباً همه مفاهیم مهم React را در یک سناریوی واقعی تمرین کردیم. فرم ساختیم، state مدیریت کردیم، route تعریف کردیم، از API دیتا گرفتیم، loading و error را مدیریت کردیم، custom hook ساختیم، Context API استفاده کردیم و عملیات کامل CRUD را پیاده‌سازی کردیم.

این پروژه کوچک است، اما ساختار آن شبیه پروژه‌های واقعی است. اگر بخواهیم آن را حرفه‌ای‌تر کنیم، می‌توانیم authentication واقعی، role-based access، pagination، sorting، upload image، validation پیشرفته و backend واقعی به آن اضافه کنیم.

مهم‌ترین نکته این است که دانشجو بفهمد React فقط چند hook جداگانه نیست. React یعنی ساختن UI بر اساس state، تقسیم پروژه به componentهای قابل مدیریت، و اتصال frontend به data واقعی.
