import Link from "next/link";
import AdminNav from "./components/AdminNav";
import RecalcularButton from "./components/RecalcularButton";
import StatCard from "@/app/components/StatCard";
import { listarParticipantes } from "@/services/participantesService";
import { listarJogos } from "@/services/jogosService";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [participantes, jogos] = await Promise.all([listarParticipantes(), listarJogos()]);
  const finalizados = jogos.filter((j) => j.placarMandante !== null).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <AdminNav />
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Painel administrativo</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <StatCard label="Participantes" valor={participantes.length} />
        <StatCard label="Jogos cadastrados" valor={jogos.length} />
        <StatCard label="Jogos finalizados" valor={finalizados} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <RecalcularButton />
        <Link
          href="/admin/jogos"
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Gerenciar jogos
        </Link>
        <Link
          href="/admin/participantes"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Gerenciar participantes
        </Link>
        <Link
          href="/admin/configuracoes"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Atualizar campeonato
        </Link>
      </div>
    </div>
  );
}
