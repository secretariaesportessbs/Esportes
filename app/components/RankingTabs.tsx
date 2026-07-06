"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function RankingTabs({ rodadas }: { rodadas: number[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rodadaAtual = searchParams.get("rodada");

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <button
        onClick={() => router.push("/ranking")}
        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          !rodadaAtual ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
        }`}
      >
        Geral
      </button>
      {rodadas.map((rodada) => (
        <button
          key={rodada}
          onClick={() => router.push(`/ranking?rodada=${rodada}`)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            Number(rodadaAtual) === rodada
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Rodada {rodada}
        </button>
      ))}
    </div>
  );
}
