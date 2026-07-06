import type { Jogo, StatusJogo } from "@/types";

/** Data/hora de início do jogo, para validar se palpites ainda podem ser enviados. */
export function dataHoraJogo(jogo: Pick<Jogo, "data" | "hora">): Date {
  return new Date(`${jogo.data}T${jogo.hora}:00`);
}

/** Status real do jogo considerando o horário atual, além do status gravado na planilha. */
export function getStatusEfetivo(jogo: Jogo): StatusJogo {
  if (jogo.status === "finalizado" || jogo.placarMandante !== null) return "finalizado";
  if (Date.now() >= dataHoraJogo(jogo).getTime()) return "em_andamento";
  return "nao_iniciado";
}

export function jogoAceitaPalpite(jogo: Jogo): boolean {
  return getStatusEfetivo(jogo) === "nao_iniciado";
}
