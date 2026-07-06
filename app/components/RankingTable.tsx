import type { RankingEntry } from "@/types";

const MEDALHAS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default function RankingTable({ entradas }: { entradas: RankingEntry[] }) {
  if (entradas.length === 0) {
    return (
      <p className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
        Nenhum ponto registrado ainda. Assim que os jogos forem finalizados, o ranking aparece aqui.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[420px] text-left text-sm">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Participante</th>
            <th className="px-4 py-3 text-center">Pontos</th>
            <th className="px-4 py-3 text-center">Acertos</th>
            <th className="px-4 py-3 text-center">Placares exatos</th>
          </tr>
        </thead>
        <tbody>
          {entradas.map((entrada) => (
            <tr key={entrada.participanteId} className="border-t border-slate-100 even:bg-slate-50">
              <td className="px-4 py-3 font-semibold">
                {MEDALHAS[entrada.posicao] ?? entrada.posicao}
              </td>
              <td className="px-4 py-3">{entrada.nome}</td>
              <td className="px-4 py-3 text-center font-bold text-emerald-700">{entrada.pontos}</td>
              <td className="px-4 py-3 text-center">{entrada.jogosAcertados}</td>
              <td className="px-4 py-3 text-center">{entrada.placaresExatos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
