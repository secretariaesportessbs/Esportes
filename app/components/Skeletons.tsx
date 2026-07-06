export function JogoCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex justify-between">
        <div className="h-3 w-16 rounded bg-slate-200" />
        <div className="h-3 w-24 rounded bg-slate-200" />
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="h-4 flex-1 rounded bg-slate-200" />
        <div className="h-8 w-16 rounded bg-slate-200" />
        <div className="h-4 flex-1 rounded bg-slate-200" />
      </div>
    </div>
  );
}

export function ListaJogosSkeleton({ quantidade = 4 }: { quantidade?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: quantidade }).map((_, i) => (
        <JogoCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TabelaSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="h-10 bg-slate-200" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 border-t border-slate-100 bg-white" />
      ))}
    </div>
  );
}
