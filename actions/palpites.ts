"use server";

import { revalidatePath } from "next/cache";
import { palpiteSchema } from "@/lib/validation";
import { PalpiteError, salvarPalpite } from "@/services/palpitesService";
import type { ActionResult } from "@/types";

export async function enviarPalpiteAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = palpiteSchema.safeParse({
    participanteId: formData.get("participanteId"),
    jogoId: formData.get("jogoId"),
    placarMandante: formData.get("placarMandante"),
    placarVisitante: formData.get("placarVisitante"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os placares informados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await salvarPalpite(parsed.data);
    revalidatePath("/palpites");
    revalidatePath("/participante");
    return { success: true, message: "Palpite salvo com sucesso!" };
  } catch (error) {
    if (error instanceof PalpiteError) {
      return { success: false, message: error.message };
    }
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao salvar palpite.",
    };
  }
}
