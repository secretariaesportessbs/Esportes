"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { atualizarConfiguracaoAction } from "@/actions/admin";
import type { ActionResult } from "@/types";
import SubmitButton from "@/app/components/SubmitButton";

const initialState: ActionResult = { success: false, message: "" };

export default function ConfigField({
  chave,
  label,
  valorAtual,
  multiline,
}: {
  chave: string;
  label: string;
  valorAtual: string;
  multiline?: boolean;
}) {
  const [state, formAction] = useActionState(atualizarConfiguracaoAction, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  const inputClass =
    "w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none";

  return (
    <form action={formAction} className="mb-6">
      <input type="hidden" name="chave" value={chave} />
      <label className="mb-1 block text-sm font-semibold text-slate-700">{label}</label>
      {multiline ? (
        <textarea name="valor" defaultValue={valorAtual} rows={3} className={inputClass} />
      ) : (
        <input type="text" name="valor" defaultValue={valorAtual} className={inputClass} />
      )}
      <div className="mt-2">
        <SubmitButton pendingText="Salvando...">Salvar</SubmitButton>
      </div>
    </form>
  );
}
