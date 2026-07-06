import AdminNav from "../components/AdminNav";
import EscudoForm from "./EscudoForm";
import TimeEscudo from "@/app/components/TimeEscudo";
import { listarNomesTimes, listarEscudos } from "@/services/timesService";

export const dynamic = "force-dynamic";

export default async function AdminTimesPage() {
  const [nomes, escudos] = await Promise.all([listarNomesTimes(), listarEscudos()]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <AdminNav />
      <h1 className="mb-2 text-2xl font-bold text-slate-800">Times</h1>
      <p className="mb-6 text-sm text-slate-500">
        Envie o escudo de cada time. Times sem escudo aparecem com as iniciais do nome.
      </p>

      {nomes.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum time cadastrado ainda. Crie um jogo primeiro.</p>
      ) : (
        <div className="space-y-3">
          {nomes.map((nome) => (
            <div key={nome} className="flex items-center gap-4 rounded-lg border border-slate-200 p-4">
              <TimeEscudo nome={nome} escudo={escudos[nome]} size={48} />
              <p className="flex-1 font-semibold">{nome}</p>
              <EscudoForm nome={nome} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
