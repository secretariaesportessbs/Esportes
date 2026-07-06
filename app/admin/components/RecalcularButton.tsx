"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { recalcularPontuacaoAction } from "@/actions/admin";

export default function RecalcularButton() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          const res = await recalcularPontuacaoAction();
          if (res.success) toast.success(res.message);
          else toast.error(res.message);
        })
      }
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
    >
      {pending ? "Recalculando..." : "Recalcular pontuação"}
    </button>
  );
}
