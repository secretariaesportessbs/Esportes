"use client";

import { useState } from "react";
import { editarJogoAction, excluirJogoAction } from "@/actions/admin";
import { STATUS_JOGO_LABEL, type Jogo } from "@/types";
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton";
import JogoForm from "./JogoForm";
import ResultadoForm from "./ResultadoForm";

export default function JogoRow({ jogo }: { jogo: Jogo }) {
  const [editando, setEditando] = useState(false);
  const [mostrarResultado, setMostrarResultado] = useState(false);

  if (editando) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <JogoForm action={editarJogoAction} jogo={jogo} onSuccess={() => setEditando(false)} />
        <button onClick={() => setEditando(false)} className="mt-2 text-xs text-slate-500 hover:underline">
          Cancelar
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-semibold">
            {jogo.timeMandante} x {jogo.timeVisitante}
          </p>
          <p className="text-xs text-slate-500">
            Rodada {jogo.rodada} · {jogo.data} {jogo.hora} · {STATUS_JOGO_LABEL[jogo.status]}
            {jogo.placarMandante !== null && ` · Placar: ${jogo.placarMandante} x ${jogo.placarVisitante}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditando(true)}
            className="text-xs font-semibold text-emerald-700 hover:underline"
          >
            Editar
          </button>
          <button
            onClick={() => setMostrarResultado((v) => !v)}
            className="text-xs font-semibold text-orange-600 hover:underline"
          >
            {jogo.status === "finalizado" ? "Corrigir resultado" : "Inserir resultado"}
          </button>
          <ConfirmDeleteButton
            id={jogo.id}
            action={excluirJogoAction}
            confirmText={`Excluir o jogo ${jogo.timeMandante} x ${jogo.timeVisitante}?`}
          />
        </div>
      </div>
      {mostrarResultado && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <ResultadoForm jogo={jogo} onSuccess={() => setMostrarResultado(false)} />
        </div>
      )}
    </div>
  );
}
