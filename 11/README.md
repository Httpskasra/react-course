# Theme Context TypeScript

یک پروژه کوچک آموزشی با React + TypeScript برای یادگیری Context API و مدیریت Light/Dark Theme.

## اجرا

```bash
npm install
npm run dev
```

## نکات آموزشی پروژه

- `createContext` برای ساخت Context
- `ThemeProvider` برای نگهداری State و اشتراک آن
- `useContext` داخل Custom Hook با نام `useTheme`
- `useState` برای State واقعی Theme
- `useEffect` و `localStorage` برای نگه داشتن Theme بعد از Refresh
- TypeScript برای محدود کردن Theme به `light | dark`

## ساختار

```text
src/
├── components/
│   ├── Navbar.tsx
│   ├── ThemeButton.tsx
│   └── ThemeStatus.tsx
├── context/
│   └── ThemeContext.tsx
├── App.tsx
├── index.css
└── main.tsx
```
