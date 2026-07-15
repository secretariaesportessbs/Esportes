import StatCard from "@/app/components/StatCard";

export const metadata = {
  title: "Regras | Fézinha Futsal Inverno",
};

const faq = [
  {
    pergunta: "Posso alterar meu palpite depois de enviado?",
    resposta:
      "Sim, você pode atualizar seu palpite quantas vezes quiser até o jogo começar. Depois do horário de início, o palpite fica travado com o último valor salvo.",
  },
  {
    pergunta: "O que acontece se eu não enviar um palpite?",
    resposta: "Você simplesmente não pontua naquele jogo. Os outros jogos continuam valendo normalmente.",
  },
  {
    pergunta: "Como é feito o desempate no ranking?",
    resposta:
      "Primeiro pela pontuação total, depois pela quantidade de placares exatos e, por fim, pela quantidade de resultados acertados.",
  },
  {
    pergunta: "Quando a pontuação é atualizada?",
    resposta:
      "Automaticamente assim que o resultado oficial de um jogo é lançado pela organização. Em caso de correção, ela pode ser recalculada manualmente.",
  },
];

export default function RegrasPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800">Regras</h1>
      <p className="mb-8 text-slate-500">
        Entenda como a pontuação funciona, até quando dá pra palpitar e tire suas dúvidas.
      </p>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-slate-800">Pontuação</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Acertar vencedor ou empate" valor="+3" />
          <StatCard label="Acertar o placar exato" valor="+5" destaque />
          <StatCard label="Máximo por jogo" valor="8" />
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Acertar o placar exato soma os pontos do resultado, então cravar o placar de um jogo vale os
          8 pontos (3 + 5). Errar o vencedor não pontua nada naquele jogo.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-slate-800">Limite de palpites</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
          <li>Um palpite por jogo — enviar um novo simplesmente atualiza o anterior.</li>
          <li>Não há limite de quantos jogos você pode palpitar: dá pra apostar em todos os jogos abertos.</li>
          <li>
            O prazo é o horário de início de cada jogo: depois que a bola rola, o palpite daquele jogo
            fica travado e não pode mais ser criado ou alterado.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-800">Perguntas frequentes</h2>
        <div className="space-y-3">
          {faq.map((item) => (
            <details
              key={item.pergunta}
              className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <summary className="cursor-pointer list-none font-semibold text-slate-800 marker:content-none">
                {item.pergunta}
              </summary>
              <p className="mt-2 text-sm text-slate-600">{item.resposta}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
