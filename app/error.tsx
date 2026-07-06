"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-4xl">⚠️</p>
      <h1 className="mt-4 text-xl font-bold text-slate-800">Algo deu errado</h1>
      <p className="mt-2 text-sm text-slate-500">
        Não foi possível carregar os dados agora. Verifique sua conexão e tente novamente em instantes.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Tentar novamente
      </button>
    </div>
  );
}
