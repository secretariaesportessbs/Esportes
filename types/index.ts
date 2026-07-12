export type StatusJogo = "nao_iniciado" | "em_andamento" | "finalizado";

export const STATUS_JOGO_LABEL: Record<StatusJogo, string> = {
  nao_iniciado: "Não iniciado",
  em_andamento: "Em andamento",
  finalizado: "Finalizado",
};

export interface Participante {
  id: string;
  nome: string;
  telefone: string;
  senha: string;
  email?: string;
  cidade?: string;
  criadoEm: string;
}

export interface Jogo {
  id: string;
  rodada: number;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  timeMandante: string;
  timeVisitante: string;
  placarMandante: number | null;
  placarVisitante: number | null;
  status: StatusJogo;
}

export interface Palpite {
  id: string;
  participanteId: string;
  jogoId: string;
  placarMandante: number;
  placarVisitante: number;
  criadoEm: string;
}

export interface Pontuacao {
  participanteId: string;
  pontos: number;
  jogosAcertados: number;
  placaresExatos: number;
}

export interface Configuracao {
  chave: string;
  valor: string;
}

export interface RankingEntry {
  posicao: number;
  participanteId: string;
  nome: string;
  pontos: number;
  jogosAcertados: number;
  placaresExatos: number;
}

export interface RankingRodadaEntry extends RankingEntry {
  rodada: number;
}

export interface ActionResult<T = undefined> {
  success: boolean;
  message: string;
  data?: T;
  fieldErrors?: Record<string, string[]>;
}
