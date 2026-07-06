"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { enviarPalpiteAction } from "@/actions/palpites";
import type { ActionResult, Jogo } from "@/types";
import JogoCard from "./JogoCard";
import SubmitButton from "./SubmitButton";

const initialState: ActionResult = { success: false, message: "" };

export default function PalpiteForm({
  participanteId,
  jogo,
  placarMandanteInicial,
  placarVisitanteInicial,
  aceitaPalpite,
}: {
  participanteId: string;
  jogo: Jogo;
  placarMandanteInicial: number | null;
  placarVisitanteInicial: number | null;
  aceitaPalpite: boolean;
}) {
  const [state, formAction] = useActionState(enviarPalpiteAction, initialState);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) toast.success(state.message);
    else toast.error(state.message);
  }, [state]);

  if (!aceitaPalpite) {
    return (
      <JogoCard jogo={jogo}>
        <p className="text-sm text-slate-500">
          {placarMandanteInicial !== null
            ? `Seu palpite: ${placarMandanteInicial} x ${placarVisitanteInicial}`
            : "Este jogo já começou. Palpites encerrados."}
        </p>
      </JogoCard>
    );
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="participanteId" value={participanteId} />
      <input type="hidden" name="jogoId" value={jogo.id} />
      <JogoCard
        jogo={jogo}
        centerSlot={
          <span className="flex items-center gap-1">
            <input
              type="number"
              name="placarMandante"
              min={0}
              max={50}
              defaultValue={placarMandanteInicial ?? ""}
              required
              aria-label="Placar mandante"
              className="w-10 rounded border border-slate-300 bg-white px-1 py-0.5 text-center text-sm font-bold focus:border-emerald-500 focus:outline-none"
            />
            x
            <input
              type="number"
              name="placarVisitante"
              min={0}
              max={50}
              defaultValue={placarVisitanteInicial ?? ""}
              required
              aria-label="Placar visitante"
              className="w-10 rounded border border-slate-300 bg-white px-1 py-0.5 text-center text-sm font-bold focus:border-emerald-500 focus:outline-none"
            />
          </span>
        }
      >
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton pendingText="Salvando...">
            {placarMandanteInicial !== null ? "Atualizar palpite" : "Enviar palpite"}
          </SubmitButton>
          {state.fieldErrors && (
            <p className="text-xs text-red-600">
              {Object.values(state.fieldErrors).flat().join(" ")}
            </p>
          )}
        </div>
      </JogoCard>
    </form>
  );
}
