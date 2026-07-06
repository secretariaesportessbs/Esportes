import { TabelaSkeleton } from "@/app/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 h-8 w-48 animate-pulse rounded bg-slate-200" />
      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 animate-pulse rounded-xl bg-slate-200" />
        ))}
      </div>
      <TabelaSkeleton />
    </div>
  );
}
