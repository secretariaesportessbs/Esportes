import { ListaJogosSkeleton } from "@/app/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-8 h-8 w-64 animate-pulse rounded bg-slate-200" />
      <ListaJogosSkeleton />
    </div>
  );
}
