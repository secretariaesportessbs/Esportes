import { getParticipanteAtualId } from "@/lib/participanteSession";
import { buscarParticipantePorId } from "@/services/participantesService";
import { listarJogos } from "@/services/jogosService";
import { listarPalpitesDoParticipante } from "@/services/palpitesService";
import { jogoAceitaPalpite } from "@/services/jogosService";
import { listarEscudos } from "@/services/timesService";
import PalpiteForm from "@/app/components/PalpiteForm";
import IdentificacaoForm from "@/app/components/IdentificacaoForm";

export default async function PalpitesPage() {
  const participanteId = await getParticipanteAtualId();
  const participante = participanteId ? await buscarParticipantePorId(participanteId) : null;

  if (!participante) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <h1 className="mb-2 text-center text-2xl font-bold text-slate-800">
          Identifique-se para dar seus palpites
        </h1>
        <p className="mb-8 text-center text-slate-500">
          Leva menos de um minuto. Nome e telefone já garantem sua vaga no Fézinha.
        </p>
        <IdentificacaoForm />
      </div>
    );
  }

  const [jogos, palpites, escudos] = await Promise.all([
    listarJogos(),
    listarPalpitesDoParticipante(participante.id),
    listarEscudos(),
  ]);
  const palpitesPorJogo = new Map(palpites.map((p) => [p.jogoId, p]));

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">Olá, {participante.nome}!</h1>
      <p className="mb-8 text-slate-500">Envie seus palpites antes do início de cada jogo.</p>

      {jogos.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
          Nenhum jogo cadastrado ainda.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {jogos.map((jogo) => {
            const palpite = palpitesPorJogo.get(jogo.id);
            return (
              <PalpiteForm
                key={jogo.id}
                participanteId={participante.id}
                jogo={jogo}
                placarMandanteInicial={palpite?.placarMandante ?? null}
                placarVisitanteInicial={palpite?.placarVisitante ?? null}
                aceitaPalpite={jogoAceitaPalpite(jogo)}
                escudos={escudos}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
