import { STATUS_JOGO_LABEL, type StatusJogo } from "@/types";

const STYLES: Record<StatusJogo, string> = {
  nao_iniciado: "bg-slate-100 text-slate-600",
  em_andamento: "bg-orange-100 text-orange-700",
  finalizado: "bg-emerald-100 text-emerald-700",
};

export default function StatusBadge({ status }: { status: StatusJogo }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status]}`}>
      {STATUS_JOGO_LABEL[status]}
    </span>
  );
}
