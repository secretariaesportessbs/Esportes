"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { inserirResultadoAction } from "@/actions/admin";
import type { ActionResult, Jogo } from "@/types";
import SubmitButton from "@/app/components/SubmitButton";

const initialState: ActionResult = { success: false, message: "" };

export default function ResultadoForm({ jogo, onSuccess }: { jogo: Jogo; onSuccess?: () => void }) {
  const [state, formAction] = useActionState(inserirResultadoAction, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      onSuccess?.();
    } else {
      toast.error(state.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="jogoId" value={jogo.id} />
      <label className="flex flex-col text-xs font-medium text-slate-600">
        {jogo.timeMandante}
        <input
          type="number"
          name="placarMandante"
          min={0}
          defaultValue={jogo.placarMandante ?? ""}
          required
          className="mt-1 w-20 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </label>
      <label className="flex flex-col text-xs font-medium text-slate-600">
        {jogo.timeVisitante}
        <input
          type="number"
          name="placarVisitante"
          min={0}
          defaultValue={jogo.placarVisitante ?? ""}
          required
          className="mt-1 w-20 rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none"
        />
      </label>
      <SubmitButton pendingText="Salvando...">Confirmar resultado</SubmitButton>
    </form>
  );
}
