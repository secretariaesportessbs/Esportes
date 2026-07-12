"use server";

import { revalidatePath } from "next/cache";
import { participanteSchema, entrarSchema } from "@/lib/validation";
import { setParticipanteAtual } from "@/lib/participanteSession";
import { autenticarParticipante, criarParticipante } from "@/services/participantesService";
import type { ActionResult, Participante } from "@/types";

export async function cadastrarParticipanteAction(
  _prev: ActionResult<Participante> | null,
  formData: FormData
): Promise<ActionResult<Participante>> {
  const parsed = participanteSchema.safeParse({
    nome: formData.get("nome"),
    telefone: formData.get("telefone"),
    senha: formData.get("senha"),
    email: formData.get("email"),
    cidade: formData.get("cidade"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const participante = await criarParticipante(parsed.data);
    await setParticipanteAtual(participante.id);
    revalidatePath("/palpites");
    revalidatePath("/ranking");
    revalidatePath("/participante");
    return {
      success: true,
      message: `Cadastro realizado! Bem-vindo(a), ${participante.nome}.`,
      data: participante,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao cadastrar participante.",
    };
  }
}

export async function entrarComoParticipanteAction(
  _prev: ActionResult<Participante> | null,
  formData: FormData
): Promise<ActionResult<Participante>> {
  const parsed = entrarSchema.safeParse({
    telefone: formData.get("telefone"),
    senha: formData.get("senha"),
  });
  if (!parsed.success) {
    return {
      success: false,
      message: "Informe telefone e senha válidos.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const participante = await autenticarParticipante(parsed.data.telefone, parsed.data.senha);
  if (!participante) {
    return {
      success: false,
      message: "Telefone ou senha incorretos.",
    };
  }

  await setParticipanteAtual(participante.id);
  revalidatePath("/palpites");
  revalidatePath("/participante");
  return { success: true, message: `Bem-vindo(a) de volta, ${participante.nome}!`, data: participante };
}
