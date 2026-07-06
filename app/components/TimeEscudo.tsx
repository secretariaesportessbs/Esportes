const CORES = [
  "bg-emerald-100 text-emerald-700",
  "bg-blue-100 text-blue-700",
  "bg-orange-100 text-orange-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-700",
];

function corPara(nome: string): string {
  let hash = 0;
  for (let i = 0; i < nome.length; i++) hash = (hash * 31 + nome.charCodeAt(i)) | 0;
  return CORES[Math.abs(hash) % CORES.length];
}

export default function TimeEscudo({
  nome,
  escudo,
  size = 32,
}: {
  nome: string;
  escudo?: string;
  size?: number;
}) {
  if (escudo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={escudo}
        alt={nome}
        width={size}
        height={size}
        className="shrink-0 rounded-full border border-slate-200 object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  const iniciais = nome.trim().slice(0, 2).toUpperCase();
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${corPara(nome)}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      title={nome}
    >
      {iniciais}
    </span>
  );
}
