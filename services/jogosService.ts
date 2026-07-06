import { randomUUID } from "crypto";
import { deleteData, getData, insertData, updateData } from "@/lib/googleSheets";
import { initializeSpreadsheet } from "@/lib/initializeSpreadsheet";
import { SHEET_NAMES } from "@/lib/sheetsSchema";
import { dataHoraJogo, jogoAceitaPalpite } from "@/lib/jogoStatus";
import type { Jogo, StatusJogo } from "@/types";

export { dataHoraJogo, getStatusEfetivo, jogoAceitaPalpite } from "@/lib/jogoStatus";

function toJogo(row: Record<string, string>): Jogo {
  return {
    id: row.id,
    rodada: Number(row.rodada) || 0,
    data: row.data,
    hora: row.hora,
    timeMandante: row.timeMandante,
    timeVisitante: row.timeVisitante,
    placarMandante: row.placarMandante === "" ? null : Number(row.placarMandante),
    placarVisitante: row.placarVisitante === "" ? null : Number(row.placarVisitante),
    status: (row.status as StatusJogo) || "nao_iniciado",
  };
}

export async function listarJogos(): Promise<Jogo[]> {
  await initializeSpreadsheet();
  const rows = await getData(SHEET_NAMES.JOGOS);
  return rows
    .map(toJogo)
    .sort((a, b) => a.rodada - b.rodada || dataHoraJogo(a).getTime() - dataHoraJogo(b).getTime());
}

export async function buscarJogoPorId(id: string): Promise<Jogo | null> {
  const jogos = await listarJogos();
  return jogos.find((j) => j.id === id) ?? null;
}

export async function listarJogosPorRodada(rodada: number): Promise<Jogo[]> {
  const jogos = await listarJogos();
  return jogos.filter((j) => j.rodada === rodada);
}

export async function listarProximosJogos(limite = 5): Promise<Jogo[]> {
  const jogos = await listarJogos();
  return jogos.filter((j) => jogoAceitaPalpite(j)).slice(0, limite);
}

export async function listarRodadas(): Promise<number[]> {
  const jogos = await listarJogos();
  return Array.from(new Set(jogos.map((j) => j.rodada))).sort((a, b) => a - b);
}

export interface NovoJogoInput {
  rodada: number;
  data: string;
  hora: string;
  timeMandante: string;
  timeVisitante: string;
}

export async function criarJogo(input: NovoJogoInput): Promise<Jogo> {
  await initializeSpreadsheet();
  const jogo: Jogo = {
    id: randomUUID(),
    rodada: input.rodada,
    data: input.data,
    hora: input.hora,
    timeMandante: input.timeMandante.trim(),
    timeVisitante: input.timeVisitante.trim(),
    placarMandante: null,
    placarVisitante: null,
    status: "nao_iniciado",
  };
  await insertData(SHEET_NAMES.JOGOS, {
    id: jogo.id,
    rodada: jogo.rodada,
    data: jogo.data,
    hora: jogo.hora,
    timeMandante: jogo.timeMandante,
    timeVisitante: jogo.timeVisitante,
    placarMandante: "",
    placarVisitante: "",
    status: jogo.status,
  });
  return jogo;
}

export async function editarJogo(id: string, input: NovoJogoInput): Promise<void> {
  await updateData(SHEET_NAMES.JOGOS, id, {
    rodada: input.rodada,
    data: input.data,
    hora: input.hora,
    timeMandante: input.timeMandante.trim(),
    timeVisitante: input.timeVisitante.trim(),
  });
}

export async function excluirJogo(id: string): Promise<void> {
  await deleteData(SHEET_NAMES.JOGOS, id);
}

/** Grava o placar oficial e marca o jogo como finalizado. */
export async function inserirResultado(
  jogoId: string,
  placarMandante: number,
  placarVisitante: number
): Promise<void> {
  await updateData(SHEET_NAMES.JOGOS, jogoId, {
    placarMandante,
    placarVisitante,
    status: "finalizado" satisfies StatusJogo,
  });
}
