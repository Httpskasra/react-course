"use client";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "@/app/actions";
import { ArrowRight, LoaderCircle } from "lucide-react";
function Submit() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary full" disabled={pending}>
      {pending ?
        <>
          <LoaderCircle className="spin" size={18} /> Signing in...
        </>
      : <>
          Sign in <ArrowRight size={18} />
        </>
      }
    </button>
  );
}
export function LoginForm() {
  const [state, action] = useActionState(loginAction, {});
  return (
    <form action={action} className="login-form">
      <label>
        Email address
        <input
          type="email"
          name="email"
          required
          placeholder="admin@nova.test"
          defaultValue="admin@nova.test"
        />
      </label>
      <label>
        Password
        <input
          type="password"
          name="password"
          required
          minLength={4}
          defaultValue="demo1234"
        />
      </label>
      {state.error && (
        <div className="form-error" role="alert">
          {state.error}
        </div>
      )}
      <Submit />
    </form>
  );
}
