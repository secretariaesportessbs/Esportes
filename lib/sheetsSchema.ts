export const SHEET_NAMES = {
  PARTICIPANTES: "Participantes",
  JOGOS: "Jogos",
  PALPITES: "Palpites",
  PONTUACAO: "Pontuacao",
  CONFIGURACOES: "Configuracoes",
} as const;

export const SHEET_HEADERS: Record<string, string[]> = {
  [SHEET_NAMES.PARTICIPANTES]: ["id", "nome", "telefone", "email", "cidade", "criadoEm"],
  [SHEET_NAMES.JOGOS]: [
    "id",
    "rodada",
    "data",
    "hora",
    "timeMandante",
    "timeVisitante",
    "placarMandante",
    "placarVisitante",
    "status",
  ],
  [SHEET_NAMES.PALPITES]: [
    "id",
    "participanteId",
    "jogoId",
    "placarMandante",
    "placarVisitante",
    "criadoEm",
  ],
  [SHEET_NAMES.PONTUACAO]: ["participanteId", "pontos", "jogosAcertados", "placaresExatos"],
  [SHEET_NAMES.CONFIGURACOES]: ["chave", "valor"],
};
