import { listarRodadas } from "@/services/jogosService";
import { obterRankingGeral, obterRankingPorRodada } from "@/services/pontuacaoService";
import RankingTable from "@/app/components/RankingTable";
import RankingTabs from "@/app/components/RankingTabs";

export const dynamic = "force-dynamic";

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ rodada?: string }>;
}) {
  const { rodada: rodadaParam } = await searchParams;
  const rodada = rodadaParam ? Number(rodadaParam) : null;

  const [rodadas, entradas] = await Promise.all([
    listarRodadas(),
    rodada ? obterRankingPorRodada(rodada) : obterRankingGeral(),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Ranking</h1>
      <RankingTabs rodadas={rodadas} />
      <RankingTable entradas={entradas} />
    </div>
  );
}
