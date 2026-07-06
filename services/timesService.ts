import { cache } from "react";
import { getData, insertData, updateData } from "@/lib/googleSheets";
import { initializeSpreadsheet } from "@/lib/initializeSpreadsheet";
import { SHEET_NAMES } from "@/lib/sheetsSchema";
import { listarJogos } from "@/services/jogosService";

// ponytail: escudo guardado como data URI direto na planilha (sem storage externo);
// por isso o limite de tamanho em validation.ts respeita o limite de célula do Sheets (50k chars).

/** Mapa nome do time -> escudo (data URI). Memoizado por request. */
export const listarEscudos = cache(async (): Promise<Record<string, string>> => {
  await initializeSpreadsheet();
  const rows = await getData(SHEET_NAMES.TIMES);
  const map: Record<string, string> = {};
  for (const row of rows) {
    if (row.escudo) map[row.nome] = row.escudo;
  }
  return map;
});

/** Nomes distintos de times: os que já têm jogo cadastrado + os que só têm escudo salvo. */
export async function listarNomesTimes(): Promise<string[]> {
  const [jogos, escudos] = await Promise.all([listarJogos(), listarEscudos()]);
  const nomes = new Set<string>();
  for (const jogo of jogos) {
    nomes.add(jogo.timeMandante);
    nomes.add(jogo.timeVisitante);
  }
  for (const nome of Object.keys(escudos)) nomes.add(nome);
  return Array.from(nomes).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export async function salvarEscudoTime(nome: string, escudo: string): Promise<void> {
  await initializeSpreadsheet();
  const rows = await getData(SHEET_NAMES.TIMES);
  const existe = rows.some((r) => r.nome === nome);
  if (existe) {
    await updateData(SHEET_NAMES.TIMES, nome, { escudo }, "nome");
  } else {
    await insertData(SHEET_NAMES.TIMES, { nome, escudo });
  }
}
