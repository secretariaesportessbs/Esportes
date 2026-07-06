import AdminNav from "../components/AdminNav";
import JogoForm from "./JogoForm";
import JogoRow from "./JogoRow";
import { criarJogoAction } from "@/actions/admin";
import { listarJogos } from "@/services/jogosService";

export const dynamic = "force-dynamic";

export default async function AdminJogosPage() {
  const jogos = await listarJogos();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <AdminNav />
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Jogos</h1>

      <div className="mb-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500">Novo jogo</h2>
        <JogoForm action={criarJogoAction} />
      </div>

      <div className="space-y-3">
        {jogos.length === 0 ? (
          <p className="text-sm text-slate-500">Nenhum jogo cadastrado.</p>
        ) : (
          jogos.map((jogo) => <JogoRow key={jogo.id} jogo={jogo} />)
        )}
      </div>
    </div>
  );
}
