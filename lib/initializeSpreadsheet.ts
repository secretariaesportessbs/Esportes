import { createSheetWithHeaders, ensureColumns, listSheetTitles } from "./googleSheets";
import { SHEET_HEADERS } from "./sheetsSchema";

let initialized = false;
let initPromise: Promise<void> | null = null;

/**
 * Garante que todas as abas obrigatórias existam com as colunas necessárias.
 * Idempotente: não recria abas nem duplica colunas já existentes.
 * Chamada uma vez por processo (cacheada em memória).
 */
export async function initializeSpreadsheet(): Promise<void> {
  if (initialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    console.log("[initializeSpreadsheet] verificando planilha...");
    const existingTitles = await listSheetTitles();

    for (const [sheetName, headers] of Object.entries(SHEET_HEADERS)) {
      if (!existingTitles.includes(sheetName)) {
        console.log(`[initializeSpreadsheet] aba "${sheetName}" não existe, criando...`);
        await createSheetWithHeaders(sheetName, headers);
        console.log(`[initializeSpreadsheet] aba "${sheetName}" criada com colunas: ${headers.join(", ")}`);
        continue;
      }

      const missing = await ensureColumns(sheetName, headers);
      if (missing.length > 0) {
        console.log(`[initializeSpreadsheet] aba "${sheetName}": colunas adicionadas: ${missing.join(", ")}`);
      } else {
        console.log(`[initializeSpreadsheet] aba "${sheetName}": ok, nenhuma alteração necessária`);
      }
    }

    initialized = true;
    console.log("[initializeSpreadsheet] concluído.");
  })();

  return initPromise;
}
