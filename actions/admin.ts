"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  loginSchema,
  jogoSchema,
  resultadoSchema,
  configSchema,
  escudoTimeSchema,
  ESCUDO_TIPOS_ACEITOS,
  ESCUDO_MAX_BYTES,
} from "@/lib/validation";
import { criarSessaoAdmin, encerrarSessaoAdmin, exigirAdmin, validarSenhaAdmin } from "@/lib/auth";
import {
  criarJogo,
  editarJogo,
  excluirJogo,
  inserirResultado,
} from "@/services/jogosService";
import { excluirParticipante } from "@/services/participantesService";
import { recalcularPontuacaoGeral } from "@/services/pontuacaoService";
import { definirConfiguracao } from "@/services/configuracoesService";
import { salvarEscudoTime } from "@/services/timesService";
import type { ActionResult } from "@/types";

function revalidarTudo() {
  revalidatePath("/");
  revalidatePath("/palpites");
  revalidatePath("/ranking");
  revalidatePath("/admin/jogos");
}

export async function loginAdminAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({ senha: formData.get("senha") });
  if (!parsed.success) {
    return { success: false, message: "Informe a senha." };
  }
  if (!validarSenhaAdmin(parsed.data.senha)) {
    return { success: false, message: "Senha incorreta." };
  }
  await criarSessaoAdmin();
  redirect("/admin");
}

export async function logoutAdminAction(): Promise<void> {
  await encerrarSessaoAdmin();
  redirect("/admin/login");
}

function parseJogoForm(formData: FormData) {
  return jogoSchema.safeParse({
    rodada: formData.get("rodada"),
    data: formData.get("data"),
    hora: formData.get("hora"),
    timeMandante: formData.get("timeMandante"),
    timeVisitante: formData.get("timeVisitante"),
  });
}

export async function criarJogoAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await exigirAdmin();
  const parsed = parseJogoForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do jogo.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    await criarJogo(parsed.data);
    revalidarTudo();
    return { success: true, message: "Jogo cadastrado com sucesso." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Erro ao cadastrar jogo." };
  }
}

export async function editarJogoAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await exigirAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { success: false, message: "Jogo inválido." };
  const parsed = parseJogoForm(formData);
  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do jogo.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    await editarJogo(id, parsed.data);
    revalidarTudo();
    return { success: true, message: "Jogo atualizado com sucesso." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Erro ao editar jogo." };
  }
}

export async function excluirJogoAction(formData: FormData): Promise<void> {
  await exigirAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await excluirJogo(id);
  revalidarTudo();
}

export async function inserirResultadoAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await exigirAdmin();
  const parsed = resultadoSchema.safeParse({
    jogoId: formData.get("jogoId"),
    placarMandante: formData.get("placarMandante"),
    placarVisitante: formData.get("placarVisitante"),
  });
  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique o placar informado.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  try {
    await inserirResultado(parsed.data.jogoId, parsed.data.placarMandante, parsed.data.placarVisitante);
    await recalcularPontuacaoGeral();
    revalidarTudo();
    return { success: true, message: "Resultado registrado e pontuação recalculada." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Erro ao registrar resultado." };
  }
}

export async function recalcularPontuacaoAction(): Promise<ActionResult> {
  await exigirAdmin();
  try {
    await recalcularPontuacaoGeral();
    revalidarTudo();
    return { success: true, message: "Pontuação recalculada com sucesso." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Erro ao recalcular pontuação." };
  }
}

export async function excluirParticipanteAction(formData: FormData): Promise<void> {
  await exigirAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await excluirParticipante(id);
  revalidarTudo();
}

export async function atualizarConfiguracaoAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await exigirAdmin();
  const parsed = configSchema.safeParse({
    chave: formData.get("chave"),
    valor: formData.get("valor"),
  });
  if (!parsed.success) {
    return { success: false, message: "Dados de configuração inválidos." };
  }
  try {
    await definirConfiguracao(parsed.data.chave, parsed.data.valor);
    revalidatePath("/");
    revalidatePath("/admin/configuracoes");
    return { success: true, message: "Configuração atualizada." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Erro ao atualizar configuração." };
  }
}

export async function uploadEscudoTimeAction(
  _prev: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  await exigirAdmin();
  const parsed = escudoTimeSchema.safeParse({ nome: formData.get("nome") });
  if (!parsed.success) {
    return { success: false, message: "Time inválido." };
  }
  const arquivo = formData.get("escudo");
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { success: false, message: "Selecione uma imagem." };
  }
  if (!ESCUDO_TIPOS_ACEITOS.includes(arquivo.type)) {
    return { success: false, message: "Formato inválido. Use PNG, JPG, WEBP ou SVG." };
  }
  if (arquivo.size > ESCUDO_MAX_BYTES) {
    return { success: false, message: `Imagem muito grande. Máximo: ${ESCUDO_MAX_BYTES / 1024}KB.` };
  }
  try {
    const buffer = Buffer.from(await arquivo.arrayBuffer());
    const dataUri = `data:${arquivo.type};base64,${buffer.toString("base64")}`;
    await salvarEscudoTime(parsed.data.nome, dataUri);
    revalidatePath("/");
    revalidatePath("/palpites");
    revalidatePath("/ranking");
    revalidatePath("/admin/times");
    return { success: true, message: "Escudo atualizado com sucesso." };
  } catch (error) {
    return { success: false, message: error instanceof Error ? error.message : "Erro ao salvar escudo." };
  }
}
