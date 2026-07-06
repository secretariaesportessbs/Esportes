"use client";

import { useActionState } from "react";
import { loginAdminAction } from "@/actions/admin";
import SubmitButton from "@/app/components/SubmitButton";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAdminAction, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <input
        type="password"
        name="senha"
        placeholder="Senha de administrador"
        required
        autoFocus
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
      />
      {state.message && !state.success && <p className="text-sm text-red-600">{state.message}</p>}
      <SubmitButton className="w-full" pendingText="Entrando...">
        Entrar
      </SubmitButton>
    </form>
  );
}
