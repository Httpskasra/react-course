# React + TypeScript · Theme Context and Redux Login

## Run

```bash
pnpm install
pnpm dev
```

Production build check: `pnpm build`.

## Demo login

- Email: `student@example.com`
- Password: `123456`

You can use **پر کردن اطلاعات نمونه** to populate the sample credentials.

## State management

- `src/pages/LoginPage.tsx`: local `useState` manages email, password, validation and visibility.
- `src/feature/authSlice.ts`: Redux Toolkit slice with `login` and `logout`; user and `isAuth` are global Redux state.
- `src/app/store.ts`: configures the Redux store.
- `src/app/hooks.ts`: typed Redux hooks.
- `src/App.tsx`: switches between login and main pages based on Redux state.
- `src/components/Navbar.tsx`: displays logged-in user and dispatches logout.
- `src/context/ThemeContext.tsx`: keeps light/dark theme independent of Redux.
- Demo login saves only basic user profile in localStorage, not the password. Logging out removes it.

**Security note:** This is a frontend-only teaching demonstration, **not real authentication or a security boundary**. Password checking happens in browser source code and can be bypassed; storage can be edited. For a production app, use a backend to validate credentials, manage authenticated sessions and authorize every protected API endpoint. Prefer secure HttpOnly cookies for session handling.
