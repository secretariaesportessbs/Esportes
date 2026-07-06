const appName = process.env.NEXT_PUBLIC_APP_NAME || "Bolão Futsal Inverno";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
      <p>
        {appName} · Campeonato de Futsal de Inverno de São Bento do Sapucaí
      </p>
      <p className="mt-1 text-xs text-slate-400">
        © {new Date().getFullYear()} · Feito por AutomatosData.com.br para a comunidade
      </p>
    </footer>
  );
}
