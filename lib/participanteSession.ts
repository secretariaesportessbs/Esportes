import { cookies } from "next/headers";

const COOKIE_NAME = "bolao_participante_id";

export async function setParticipanteAtual(id: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, id, {
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}

export async function getParticipanteAtualId(): Promise<string | null> {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value ?? null;
}

export async function limparParticipanteAtual(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
