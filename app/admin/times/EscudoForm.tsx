"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { uploadEscudoTimeAction } from "@/actions/admin";
import SubmitButton from "@/app/components/SubmitButton";
import type { ActionResult } from "@/types";

const initialState: ActionResult = { success: false, message: "" };

export default function EscudoForm({ nome }: { nome: string }) {
  const [state, formAction] = useActionState(uploadEscudoTimeAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state.message) return;
    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="nome" value={nome} />
      <input
        type="file"
        name="escudo"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        required
        className="text-xs file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs file:font-semibold"
      />
      <SubmitButton pendingText="Enviando..." className="px-3 py-1 text-xs">
        Enviar
      </SubmitButton>
    </form>
  );
}
