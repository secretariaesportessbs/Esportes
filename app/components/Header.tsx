import Image from "next/image";
import Link from "next/link";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Fézinha Futsal Inverno";

const links = [
  { href: "/", label: "Início" },
  { href: "/palpites", label: "Palpites" },
  { href: "/ranking", label: "Ranking" },
  { href: "/participante", label: "Meu painel" },
];

export default function Header() {
  return (
    <header className="bg-slate-900 text-white shadow-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <Image src="/icon.png" alt="Brasão de São Bento do Sapucaí" width={32} height={32} className="h-8 w-8" />
          <span className="text-sm sm:text-base leading-tight">
            {appName}
            <span className="block text-xs font-normal text-emerald-400">
              São Bento do Sapucaí
            </span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 font-medium text-slate-200 transition-colors hover:bg-emerald-600 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
