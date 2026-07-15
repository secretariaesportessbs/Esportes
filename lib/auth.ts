import { createHash } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "fezinha_admin_session";

function expectedToken(): string {
  const senha = process.env.ADMIN_PASSWORD;
  if (!senha) throw new Error("ADMIN_PASSWORD não configurado no .env");
  return createHash("sha256").update(senha).digest("hex");
}

export function validarSenhaAdmin(senha: string): boolean {
  return Boolean(process.env.ADMIN_PASSWORD) && senha === process.env.ADMIN_PASSWORD;
}

export async function criarSessaoAdmin(): Promise<void> {
  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, expectedToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function encerrarSessaoAdmin(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
}

export async function isAdminAutenticado(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return false;
  return token === expectedToken();
}

export async function exigirAdmin(): Promise<void> {
  if (!(await isAdminAutenticado())) {
    throw new Error("Não autorizado. Faça login como administrador.");
  }
}
