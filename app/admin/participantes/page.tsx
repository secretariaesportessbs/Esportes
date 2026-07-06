import AdminNav from "../components/AdminNav";
import { listarParticipantes } from "@/services/participantesService";
import { excluirParticipanteAction } from "@/actions/admin";
import ConfirmDeleteButton from "@/app/components/ConfirmDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminParticipantesPage() {
  const participantes = await listarParticipantes();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <AdminNav />
      <h1 className="mb-6 text-2xl font-bold text-slate-800">
        Participantes ({participantes.length})
      </h1>

      {participantes.length === 0 ? (
        <p className="text-sm text-slate-500">Nenhum participante cadastrado ainda.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Telefone</th>
                <th className="px-4 py-3">E-mail</th>
                <th className="px-4 py-3">Cidade</th>
                <th className="px-4 py-3">Cadastro</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {participantes.map((p) => (
                <tr key={p.id} className="border-t border-slate-100 even:bg-slate-50">
                  <td className="px-4 py-3">{p.nome}</td>
                  <td className="px-4 py-3">{p.telefone}</td>
                  <td className="px-4 py-3">{p.email || "—"}</td>
                  <td className="px-4 py-3">{p.cidade || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(p.criadoEm).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-3">
                    <ConfirmDeleteButton
                      id={p.id}
                      action={excluirParticipanteAction}
                      confirmText={`Excluir o participante ${p.nome}? Essa ação não pode ser desfeita.`}
                    />
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
