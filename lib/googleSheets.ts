import { cache } from "react";
import { google, sheets_v4 } from "googleapis";

// ponytail: módulo roda só no servidor (Server Actions/Route Handlers) — nunca importar em componente client.

let sheetsClient: sheets_v4.Sheets | null = null;

function getAuth() {
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!email || !privateKey) {
    throw new Error(
      "Credenciais do Google Service Account ausentes. Configure GOOGLE_CLIENT_EMAIL e GOOGLE_PRIVATE_KEY no .env"
    );
  }
  return new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets(): sheets_v4.Sheets {
  if (!sheetsClient) {
    sheetsClient = google.sheets({ version: "v4", auth: getAuth() });
  }
  return sheetsClient;
}

function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEET_ID não configurado no .env");
  return id;
}

function rowsToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) return [];
  const [header, ...data] = rows;
  return data
    .filter((row) => row.some((cell) => cell !== undefined && cell !== ""))
    .map((row) => {
      const obj: Record<string, string> = {};
      header.forEach((key, i) => {
        obj[key] = row[i] ?? "";
      });
      return obj;
    });
}

// ponytail: uma leitura crua por aba por request, deduplicada via React cache().
// getHeaders/getData/findRowById reaproveitam a mesma linha em vez de 3 chamadas separadas à API.
const getRawRows = cache(async (sheetName: string): Promise<string[][]> => {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSpreadsheetId(),
    range: `${sheetName}!A:ZZ`,
  });
  return (res.data.values as string[][]) ?? [];
});

/** Lê o cabeçalho (linha 1) de uma aba. */
export async function getHeaders(sheetName: string): Promise<string[]> {
  const rows = await getRawRows(sheetName);
  return rows[0] ?? [];
}

/** Lê todas as linhas de uma aba e retorna como objetos (chave = cabeçalho). */
export async function getData(sheetName: string): Promise<Record<string, string>[]> {
  return rowsToObjects(await getRawRows(sheetName));
}

/** Insere uma nova linha ao final da aba, respeitando a ordem das colunas do cabeçalho. */
export async function insertData(
  sheetName: string,
  data: Record<string, string | number>
): Promise<void> {
  const sheets = getSheets();
  const headers = await getHeaders(sheetName);
  const row = headers.map((h) => data[h] ?? "");
  await sheets.spreadsheets.values.append({
    spreadsheetId: getSpreadsheetId(),
    range: `${sheetName}!A:A`,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: [row] },
  });
}

async function findRowById(
  sheetName: string,
  idColumn: string,
  id: string
): Promise<{ rowNumber: number; headers: string[]; currentRow: string[] } | null> {
  const rows = await getRawRows(sheetName);
  if (rows.length === 0) return null;
  const headers = rows[0];
  const idIndex = headers.indexOf(idColumn);
  if (idIndex === -1) return null;
  const dataRowIndex = rows.findIndex((row, i) => i > 0 && row[idIndex] === id);
  if (dataRowIndex === -1) return null;
  // dataRowIndex já é o índice absoluto (0-based) da linha dentro da planilha, incluindo o cabeçalho.
  return { rowNumber: dataRowIndex, headers, currentRow: rows[dataRowIndex] };
}

/** Atualiza os campos informados na linha cuja coluna `idColumn` bate com `id`. Mantém as demais colunas. */
export async function updateData(
  sheetName: string,
  id: string,
  data: Record<string, string | number>,
  idColumn = "id"
): Promise<void> {
  const found = await findRowById(sheetName, idColumn, id);
  if (!found) throw new Error(`Registro "${id}" não encontrado em ${sheetName}`);
  const { rowNumber, headers, currentRow } = found;
  const newRow = headers.map((h, i) =>
    data[h] !== undefined ? String(data[h]) : currentRow[i] ?? ""
  );
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `${sheetName}!A${rowNumber + 1}:ZZ${rowNumber + 1}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [newRow] },
  });
}

/** Remove a linha cuja coluna `idColumn` bate com `id`. */
export async function deleteData(sheetName: string, id: string, idColumn = "id"): Promise<void> {
  const found = await findRowById(sheetName, idColumn, id);
  if (!found) return;
  const sheetId = await getSheetIdByName(sheetName);
  const sheets = getSheets();
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: getSpreadsheetId(),
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: found.rowNumber,
              endIndex: found.rowNumber + 1,
            },
          },
        },
      ],
    },
  });
}

export async function getSheetIdByName(sheetName: string): Promise<number> {
  const sheets = getSheets();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: getSpreadsheetId() });
  const sheet = meta.data.sheets?.find((s) => s.properties?.title === sheetName);
  if (!sheet || sheet.properties?.sheetId == null) {
    throw new Error(`Aba "${sheetName}" não encontrada na planilha`);
  }
  return sheet.properties.sheetId;
}

export async function listSheetTitles(): Promise<string[]> {
  const sheets = getSheets();
  const meta = await sheets.spreadsheets.get({ spreadsheetId: getSpreadsheetId() });
  return (meta.data.sheets ?? []).map((s) => s.properties?.title ?? "").filter(Boolean);
}

export async function createSheetWithHeaders(sheetName: string, headers: string[]): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: getSpreadsheetId(),
    requestBody: { requests: [{ addSheet: { properties: { title: sheetName } } }] },
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [headers] },
  });
}

/** Garante que as colunas obrigatórias existam no cabeçalho, adicionando ao final sem duplicar. */
export async function ensureColumns(sheetName: string, requiredHeaders: string[]): Promise<string[]> {
  const existing = await getHeaders(sheetName);
  const missing = requiredHeaders.filter((h) => !existing.includes(h));
  if (missing.length === 0) return [];
  const newHeaders = [...existing, ...missing];
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSpreadsheetId(),
    range: `${sheetName}!A1`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [newHeaders] },
  });
  return missing;
}
