"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import SubmitButton from "@/app/components/SubmitButton";
import type { ActionResult, Jogo } from "@/types";

type JogoAction = (prev: ActionResult | null, formData: FormData) => Promise<ActionResult>;

const initialState: ActionResult = { success: false, message: "" };

export default function JogoForm({
  action,
  jogo,
  onSuccess,
}: {
  action: JogoAction;
  jogo?: Jogo;
  onSuccess?: () => void;
}) {
  const [state, formAction] = useActionState(action, initialState);

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

  const inputClass =
    "mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm focus:border-emerald-500 focus:outline-none";

  return (
    <form action={formAction} className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {jogo && <input type="hidden" name="id" value={jogo.id} />}
      <label className="text-xs font-medium text-slate-600">
        Rodada
        <input type="number" name="rodada" min={1} defaultValue={jogo?.rodada} required className={inputClass} />
      </label>
      <label className="text-xs font-medium text-slate-600">
        Data
        <input type="date" name="data" defaultValue={jogo?.data} required className={inputClass} />
      </label>
      <label className="text-xs font-medium text-slate-600">
        Hora
        <input type="time" name="hora" defaultValue={jogo?.hora} required className={inputClass} />
      </label>
      <label className="text-xs font-medium text-slate-600">
        Time mandante
        <input
          type="text"
          name="timeMandante"
          defaultValue={jogo?.timeMandante}
          required
          className={inputClass}
        />
      </label>
      <label className="text-xs font-medium text-slate-600">
        Time visitante
        <input
          type="text"
          name="timeVisitante"
          defaultValue={jogo?.timeVisitante}
          required
          className={inputClass}
        />
      </label>
      <div className="col-span-2 flex items-end sm:col-span-1">
        <SubmitButton pendingText="Salvando...">{jogo ? "Salvar" : "Cadastrar jogo"}</SubmitButton>
      </div>
      {state.fieldErrors && (
        <p className="col-span-full text-xs text-red-600">
          {Object.values(state.fieldErrors).flat().join(" ")}
        </p>
      )}
    </form>
  );
}
