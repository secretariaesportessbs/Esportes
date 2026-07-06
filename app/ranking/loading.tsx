import { TabelaSkeleton } from "@/app/components/Skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="mb-6 h-8 w-40 animate-pulse rounded bg-slate-200" />
      <div className="mb-4 h-9 w-72 animate-pulse rounded-full bg-slate-200" />
      <TabelaSkeleton />
    </div>
  );
}
