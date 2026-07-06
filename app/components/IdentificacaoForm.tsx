"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cadastrarParticipanteAction, entrarComoParticipanteAction } from "@/actions/participantes";
import type { ActionResult, Participante } from "@/types";
import SubmitButton from "./SubmitButton";

const initialState: ActionResult<Participante> = { success: false, message: "" };

export default function IdentificacaoForm() {
  const [modo, setModo] = useState<"entrar" | "cadastrar">("entrar");
  const router = useRouter();
  const [entrarState, entrarAction] = useActionState(entrarComoParticipanteAction, initialState);
  const [cadastrarState, cadastrarActionFn] = useActionState(cadastrarParticipanteAction, initialState);

  useEffect(() => {
    if (entrarState.success) {
      toast.success(entrarState.message);
      router.refresh();
    } else if (entrarState.message) {
      toast.error(entrarState.message);
    }
  }, [entrarState, router]);

  useEffect(() => {
    if (cadastrarState.success) {
      toast.success(cadastrarState.message);
      router.refresh();
    } else if (cadastrarState.message) {
      toast.error(cadastrarState.message);
    }
  }, [cadastrarState, router]);

  return (
    <div className="mx-auto max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex rounded-md bg-slate-100 p-1 text-sm font-medium">
        <button
          type="button"
          onClick={() => setModo("entrar")}
          className={`flex-1 rounded-md py-2 transition-colors ${
            modo === "entrar" ? "bg-white shadow text-emerald-700" : "text-slate-500"
          }`}
        >
          Já sou cadastrado
        </button>
        <button
          type="button"
          onClick={() => setModo("cadastrar")}
          className={`flex-1 rounded-md py-2 transition-colors ${
            modo === "cadastrar" ? "bg-white shadow text-emerald-700" : "text-slate-500"
          }`}
        >
          Quero participar
        </button>
      </div>

      {modo === "entrar" ? (
        <form action={entrarAction} className="space-y-3">
          <p className="text-sm text-slate-500">
            Informe o telefone usado no cadastro para acessar seus palpites.
          </p>
          <input
            type="tel"
            name="telefone"
            placeholder="(12) 90000-0000"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <SubmitButton className="w-full" pendingText="Buscando...">
            Entrar
          </SubmitButton>
        </form>
      ) : (
        <form action={cadastrarActionFn} className="space-y-3">
          <input
            type="text"
            name="nome"
            placeholder="Nome completo"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="tel"
            name="telefone"
            placeholder="Telefone / WhatsApp"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail (opcional)"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <input
            type="text"
            name="cidade"
            placeholder="Cidade (opcional)"
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
          />
          <SubmitButton className="w-full" pendingText="Cadastrando...">
            Cadastrar e participar
          </SubmitButton>
          {cadastrarState.fieldErrors && (
            <p className="text-xs text-red-600">
              {Object.values(cadastrarState.fieldErrors).flat().join(" ")}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
