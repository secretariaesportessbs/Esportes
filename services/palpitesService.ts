import { randomUUID } from "crypto";
import { getData, insertData, updateData } from "@/lib/googleSheets";
import { initializeSpreadsheet } from "@/lib/initializeSpreadsheet";
import { SHEET_NAMES } from "@/lib/sheetsSchema";
import type { Palpite } from "@/types";
import { buscarJogoPorId, jogoAceitaPalpite } from "./jogosService";

function toPalpite(row: Record<string, string>): Palpite {
  return {
    id: row.id,
    participanteId: row.participanteId,
    jogoId: row.jogoId,
    placarMandante: Number(row.placarMandante),
    placarVisitante: Number(row.placarVisitante),
    criadoEm: row.criadoEm,
  };
}

export async function listarPalpites(): Promise<Palpite[]> {
  await initializeSpreadsheet();
  const rows = await getData(SHEET_NAMES.PALPITES);
  return rows.map(toPalpite);
}

export async function listarPalpitesDoParticipante(participanteId: string): Promise<Palpite[]> {
  const palpites = await listarPalpites();
  return palpites.filter((p) => p.participanteId === participanteId);
}

export async function buscarPalpite(
  participanteId: string,
  jogoId: string
): Promise<Palpite | null> {
  const palpites = await listarPalpites();
  return (
    palpites.find((p) => p.participanteId === participanteId && p.jogoId === jogoId) ?? null
  );
}

export class PalpiteError extends Error {}

export interface SalvarPalpiteInput {
  participanteId: string;
  jogoId: string;
  placarMandante: number;
  placarVisitante: number;
}

/** Cria ou atualiza o palpite do participante para o jogo, validando se o jogo já começou. */
export async function salvarPalpite(input: SalvarPalpiteInput): Promise<Palpite> {
  await initializeSpreadsheet();
  const jogo = await buscarJogoPorId(input.jogoId);
  if (!jogo) throw new PalpiteError("Jogo não encontrado.");
  if (!jogoAceitaPalpite(jogo)) {
    throw new PalpiteError("Este jogo já começou. Não é mais possível enviar ou alterar o palpite.");
  }

  const existente = await buscarPalpite(input.participanteId, input.jogoId);
  if (existente) {
    await updateData(SHEET_NAMES.PALPITES, existente.id, {
      placarMandante: input.placarMandante,
      placarVisitante: input.placarVisitante,
    });
    return { ...existente, placarMandante: input.placarMandante, placarVisitante: input.placarVisitante };
  }

  const palpite: Palpite = {
    id: randomUUID(),
    participanteId: input.participanteId,
    jogoId: input.jogoId,
    placarMandante: input.placarMandante,
    placarVisitante: input.placarVisitante,
    criadoEm: new Date().toISOString(),
  };
  await insertData(SHEET_NAMES.PALPITES, {
    id: palpite.id,
    participanteId: palpite.participanteId,
    jogoId: palpite.jogoId,
    placarMandante: palpite.placarMandante,
    placarVisitante: palpite.placarVisitante,
    criadoEm: palpite.criadoEm,
  });
  return palpite;
}
