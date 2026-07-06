import AdminNav from "../components/AdminNav";
import { obterConfiguracao } from "@/services/configuracoesService";
import ConfigField from "./ConfigField";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracoesPage() {
  const [nome, descricao] = await Promise.all([
    obterConfiguracao("nomeCampeonato", "Bolão Futsal Inverno de São Bento do Sapucaí"),
    obterConfiguracao(
      "descricaoCampeonato",
      "Palpite nos jogos do Campeonato de Futsal de Inverno e dispute o topo do ranking com a galera da cidade."
    ),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <AdminNav />
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Configurações do campeonato</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <ConfigField chave="nomeCampeonato" label="Nome do campeonato" valorAtual={nome} />
        <ConfigField chave="descricaoCampeonato" label="Descrição / banner" valorAtual={descricao} multiline />
      </div>
    </div>
  );
}
