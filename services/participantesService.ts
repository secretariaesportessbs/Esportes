import { randomUUID } from "crypto";
import { deleteData, getData, insertData } from "@/lib/googleSheets";
import { initializeSpreadsheet } from "@/lib/initializeSpreadsheet";
import { SHEET_NAMES } from "@/lib/sheetsSchema";
import type { Participante } from "@/types";

function toParticipante(row: Record<string, string>): Participante {
  return {
    id: row.id,
    nome: row.nome,
    telefone: row.telefone,
    senha: row.senha,
    email: row.email || undefined,
    cidade: row.cidade || undefined,
    criadoEm: row.criadoEm,
  };
}

export async function listarParticipantes(): Promise<Participante[]> {
  await initializeSpreadsheet();
  const rows = await getData(SHEET_NAMES.PARTICIPANTES);
  return rows.map(toParticipante).sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export async function buscarParticipantePorId(id: string): Promise<Participante | null> {
  const participantes = await listarParticipantes();
  return participantes.find((p) => p.id === id) ?? null;
}

function normalizarTelefone(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

export async function buscarParticipantePorTelefone(telefone: string): Promise<Participante | null> {
  const alvo = normalizarTelefone(telefone);
  const participantes = await listarParticipantes();
  return participantes.find((p) => normalizarTelefone(p.telefone) === alvo) ?? null;
}

export async function autenticarParticipante(telefone: string, senha: string): Promise<Participante | null> {
  const participante = await buscarParticipantePorTelefone(telefone);
  if (!participante || participante.senha !== senha) return null;
  return participante;
}

export interface NovoParticipanteInput {
  nome: string;
  telefone: string;
  senha: string;
  email?: string;
  cidade?: string;
}

export async function criarParticipante(input: NovoParticipanteInput): Promise<Participante> {
  await initializeSpreadsheet();
  const participante: Participante = {
    id: randomUUID(),
    nome: input.nome.trim(),
    telefone: input.telefone.trim(),
    senha: input.senha.trim(),
    email: input.email?.trim() || undefined,
    cidade: input.cidade?.trim() || undefined,
    criadoEm: new Date().toISOString(),
  };
  await insertData(SHEET_NAMES.PARTICIPANTES, {
    id: participante.id,
    nome: participante.nome,
    telefone: participante.telefone,
    senha: participante.senha,
    email: participante.email ?? "",
    cidade: participante.cidade ?? "",
    criadoEm: participante.criadoEm,
  });
  return participante;
}

export async function excluirParticipante(id: string): Promise<void> {
  await deleteData(SHEET_NAMES.PARTICIPANTES, id);
}
