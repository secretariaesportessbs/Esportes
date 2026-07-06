import Link from "next/link";
import { listarProximosJogos } from "@/services/jogosService";
import { obterRankingGeral } from "@/services/pontuacaoService";
import { obterConfiguracao } from "@/services/configuracoesService";
import { listarEscudos } from "@/services/timesService";
import JogoCard from "@/app/components/JogoCard";
import RankingTable from "@/app/components/RankingTable";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const titulo = await obterConfiguracao("nomeCampeonato", "Bolão Futsal Inverno de São Bento do Sapucaí");
  const descricao = await obterConfiguracao(
    "descricaoCampeonato",
    "Palpite nos jogos do Campeonato de Futsal de Inverno e dispute o topo do ranking com a galera da cidade."
  );
  const proximosJogos = await listarProximosJogos(4);
  const ranking = await obterRankingGeral();
  const escudos = await listarEscudos();

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-16 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-emerald-400">
            ⚽ Temporada de Inverno
          </p>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{titulo}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">{descricao}</p>
          <Link
            href="/palpites"
            className="mt-8 inline-block rounded-full bg-orange-500 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-orange-600"
          >
            Quero participar
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12">
        <h2 className="mb-4 text-xl font-bold text-slate-800">Próximos jogos</h2>
        {proximosJogos.length === 0 ? (
          <p className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
            Nenhum jogo agendado no momento. Volte em breve!
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {proximosJogos.map((jogo) => (
              <JogoCard key={jogo.id} jogo={jogo} escudos={escudos} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Ranking dos líderes</h2>
          <Link href="/ranking" className="text-sm font-semibold text-emerald-700 hover:underline">
            Ver ranking completo →
          </Link>
        </div>
        <RankingTable entradas={ranking.slice(0, 5)} />
      </section>
    </div>
  );
}
