import type { Jogo } from "@/types";
import { getStatusEfetivo } from "@/lib/jogoStatus";
import StatusBadge from "./StatusBadge";
import TimeEscudo from "./TimeEscudo";

function formatarDataHora(jogo: Jogo): string {
  const data = new Date(`${jogo.data}T${jogo.hora}:00`);
  return data.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function JogoCard({
  jogo,
  centerSlot,
  children,
  escudos = {},
}: {
  jogo: Jogo;
  centerSlot?: React.ReactNode;
  children?: React.ReactNode;
  escudos?: Record<string, string>;
}) {
  const status = getStatusEfetivo(jogo);
  const temPlacar = jogo.placarMandante !== null && jogo.placarVisitante !== null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
        <span>Rodada {jogo.rodada}</span>
        <span>{formatarDataHora(jogo)}</span>
        <StatusBadge status={status} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="flex flex-1 items-center justify-end gap-2 text-right font-semibold">
          {jogo.timeMandante}
          <TimeEscudo nome={jogo.timeMandante} escudo={escudos[jogo.timeMandante]} />
        </span>
        <span className="min-w-[64px] rounded-md bg-slate-100 px-3 py-1 text-center font-bold text-slate-800">
          {centerSlot ?? (temPlacar ? `${jogo.placarMandante} x ${jogo.placarVisitante}` : "x")}
        </span>
        <span className="flex flex-1 items-center gap-2 font-semibold">
          <TimeEscudo nome={jogo.timeVisitante} escudo={escudos[jogo.timeVisitante]} />
          {jogo.timeVisitante}
        </span>
      </div>
      {children && <div className="mt-4 border-t border-slate-100 pt-4">{children}</div>}
    </div>
  );
}
