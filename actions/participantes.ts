"use server";

import { revalidatePath } from "next/cache";
import { participanteSchema, telefoneSchema } from "@/lib/validation";
import { setParticipanteAtual } from "@/lib/participanteSession";
import { buscarParticipantePorTelefone, criarParticipante } from "@/services/participantesService";
import type { ActionResult, Participante } from "@/types";

export async function cadastrarParticipanteAction(
  _prev: ActionResult<Participante> | null,
  formData: FormData
): Promise<ActionResult<Participante>> {
  const parsed = participanteSchema.safeParse({
    nome: formData.get("nome"),
    telefone: formData.get("telefone"),
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
  const parsed = telefoneSchema.safeParse({ telefone: formData.get("telefone") });
  if (!parsed.success) {
    return {
      success: false,
      message: "Informe um telefone válido.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const participante = await buscarParticipantePorTelefone(parsed.data.telefone);
  if (!participante) {
    return {
      success: false,
      message: "Nenhum cadastro encontrado com esse telefone. Cadastre-se abaixo.",
    };
  }

  await setParticipanteAtual(participante.id);
  revalidatePath("/palpites");
  revalidatePath("/participante");
  return { success: true, message: `Bem-vindo(a) de volta, ${participante.nome}!`, data: participante };
}
