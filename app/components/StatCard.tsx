export default function StatCard({
  label,
  valor,
  destaque,
}: {
  label: string;
  valor: string | number;
  destaque?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold ${destaque ? "text-emerald-700" : "text-slate-800"}`}>
        {valor}
      </p>
    </div>
  );
}
