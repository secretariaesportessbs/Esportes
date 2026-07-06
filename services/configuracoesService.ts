import { getData, insertData, updateData } from "@/lib/googleSheets";
import { initializeSpreadsheet } from "@/lib/initializeSpreadsheet";
import { SHEET_NAMES } from "@/lib/sheetsSchema";

export async function obterConfiguracoes(): Promise<Record<string, string>> {
  await initializeSpreadsheet();
  const rows = await getData(SHEET_NAMES.CONFIGURACOES);
  const config: Record<string, string> = {};
  for (const row of rows) config[row.chave] = row.valor;
  return config;
}

export async function obterConfiguracao(chave: string, padrao = ""): Promise<string> {
  const config = await obterConfiguracoes();
  return config[chave] ?? padrao;
}

export async function definirConfiguracao(chave: string, valor: string): Promise<void> {
  await initializeSpreadsheet();
  const rows = await getData(SHEET_NAMES.CONFIGURACOES);
  const existe = rows.some((r) => r.chave === chave);
  if (existe) {
    await updateData(SHEET_NAMES.CONFIGURACOES, chave, { valor }, "chave");
  } else {
    await insertData(SHEET_NAMES.CONFIGURACOES, { chave, valor });
  }
}
