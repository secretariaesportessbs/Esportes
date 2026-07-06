import Link from "next/link";
import { logoutAdminAction } from "@/actions/admin";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/jogos", label: "Jogos" },
  { href: "/admin/participantes", label: "Participantes" },
  { href: "/admin/configuracoes", label: "Configurações" },
];

export default function AdminNav() {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
      <nav className="flex flex-wrap gap-2 text-sm font-medium">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-md px-3 py-1.5 text-slate-600 hover:bg-slate-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <form action={logoutAdminAction}>
        <button className="text-sm font-medium text-red-600 hover:underline">Sair</button>
      </form>
    </div>
  );
}
