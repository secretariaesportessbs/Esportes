import { getParticipanteAtualId } from "@/lib/participanteSession";
import { buscarParticipantePorId } from "@/services/participantesService";
import { obterHistoricoParticipante, obterRankingGeral } from "@/services/pontuacaoService";
import { STATUS_JOGO_LABEL } from "@/types";
import { getStatusEfetivo } from "@/services/jogosService";
import IdentificacaoForm from "@/app/components/IdentificacaoForm";
import StatCard from "@/app/components/StatCard";

export default async function ParticipantePage() {
  const participanteId = await getParticipanteAtualId();
  const participante = participanteId ? await buscarParticipantePorId(participanteId) : null;

  if (!participante) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-8 text-center text-2xl font-bold text-slate-800">
          Identifique-se para ver seu painel
        </h1>
        <IdentificacaoForm />
      </div>
    );
  }

  const [historico, ranking] = await Promise.all([
    obterHistoricoParticipante(participante.id),
    obterRankingGeral(),
  ]);
  const minhaPosicao = ranking.find((r) => r.participanteId === participante.id);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">Meu painel</h1>
      <p className="mb-8 text-slate-500">{participante.nome}</p>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Posição" valor={minhaPosicao ? `${minhaPosicao.posicao}º` : "—"} />
        <StatCard label="Pontos" valor={minhaPosicao?.pontos ?? 0} destaque />
        <StatCard label="Acertos" valor={minhaPosicao?.jogosAcertados ?? 0} />
        <StatCard label="Placares exatos" valor={minhaPosicao?.placaresExatos ?? 0} />
      </div>

      <h2 className="mb-4 text-xl font-bold text-slate-800">Histórico de palpites</h2>
      {historico.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
          Você ainda não enviou nenhum palpite.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3">Jogo</th>
                <th className="px-4 py-3 text-center">Seu palpite</th>
                <th className="px-4 py-3 text-center">Placar oficial</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {historico.map(({ jogo, palpite, pontos }) => (
                <tr key={palpite.id} className="border-t border-slate-100 even:bg-slate-50">
                  <td className="px-4 py-3">
                    {jogo.timeMandante} x {jogo.timeVisitante}
                    <span className="block text-xs text-slate-400">Rodada {jogo.rodada}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {palpite.placarMandante} x {palpite.placarVisitante}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {jogo.placarMandante !== null ? `${jogo.placarMandante} x ${jogo.placarVisitante}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-slate-500">
                    {STATUS_JOGO_LABEL[getStatusEfetivo(jogo)]}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-emerald-700">
                    {jogo.placarMandante !== null ? pontos : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
