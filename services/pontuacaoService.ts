import { getData, insertData, updateData } from "@/lib/googleSheets";
import { initializeSpreadsheet } from "@/lib/initializeSpreadsheet";
import { SHEET_NAMES } from "@/lib/sheetsSchema";
import type { Jogo, Palpite, RankingEntry, RankingRodadaEntry } from "@/types";
import { listarJogos } from "./jogosService";
import { listarPalpites, listarPalpitesDoParticipante } from "./palpitesService";
import { listarParticipantes } from "./participantesService";

type Categoria = "mandante" | "visitante" | "empate";

function categoria(placarMandante: number, placarVisitante: number): Categoria {
  if (placarMandante > placarVisitante) return "mandante";
  if (placarVisitante > placarMandante) return "visitante";
  return "empate";
}

/**
 * Regras de pontuação: acertar o resultado (vencedor ou empate) vale 3 pontos;
 * acertar o placar exato soma +5 pontos extras. Máximo de 8 pontos por jogo.
 */
export function calcularPontosPalpite(
  jogo: Pick<Jogo, "placarMandante" | "placarVisitante">,
  palpite: Pick<Palpite, "placarMandante" | "placarVisitante">
): { pontos: number; acertouResultado: boolean; placarExato: boolean } {
  if (jogo.placarMandante === null || jogo.placarVisitante === null) {
    return { pontos: 0, acertouResultado: false, placarExato: false };
  }

  const acertouResultado =
    categoria(jogo.placarMandante, jogo.placarVisitante) ===
    categoria(palpite.placarMandante, palpite.placarVisitante);
  const placarExato =
    jogo.placarMandante === palpite.placarMandante && jogo.placarVisitante === palpite.placarVisitante;

  let pontos = 0;
  if (acertouResultado) pontos += 3;
  if (placarExato) pontos += 5;

  return { pontos, acertouResultado, placarExato };
}

interface Acumulado {
  pontos: number;
  jogosAcertados: number;
  placaresExatos: number;
}

function acumularPontos(jogos: Jogo[], palpites: Palpite[]): Map<string, Acumulado> {
  const jogosPorId = new Map(jogos.map((j) => [j.id, j]));
  const acumulado = new Map<string, Acumulado>();

  for (const palpite of palpites) {
    const jogo = jogosPorId.get(palpite.jogoId);
    if (!jogo || jogo.placarMandante === null || jogo.placarVisitante === null) continue;

    const resultado = calcularPontosPalpite(jogo, palpite);
    const atual = acumulado.get(palpite.participanteId) ?? {
      pontos: 0,
      jogosAcertados: 0,
      placaresExatos: 0,
    };
    atual.pontos += resultado.pontos;
    if (resultado.acertouResultado) atual.jogosAcertados += 1;
    if (resultado.placarExato) atual.placaresExatos += 1;
    acumulado.set(palpite.participanteId, atual);
  }

  return acumulado;
}

/** Recalcula a pontuação de todos os participantes e grava na aba Pontuacao. */
export async function recalcularPontuacaoGeral(): Promise<void> {
  await initializeSpreadsheet();
  const [jogos, palpites, participantes, existentes] = await Promise.all([
    listarJogos(),
    listarPalpites(),
    listarParticipantes(),
    getData(SHEET_NAMES.PONTUACAO),
  ]);

  const acumulado = acumularPontos(jogos, palpites);
  const idsExistentes = new Set(existentes.map((r) => r.participanteId));

  for (const participante of participantes) {
    const dados = acumulado.get(participante.id) ?? {
      pontos: 0,
      jogosAcertados: 0,
      placaresExatos: 0,
    };
    const linha = {
      participanteId: participante.id,
      pontos: dados.pontos,
      jogosAcertados: dados.jogosAcertados,
      placaresExatos: dados.placaresExatos,
    };
    if (idsExistentes.has(participante.id)) {
      await updateData(SHEET_NAMES.PONTUACAO, participante.id, linha, "participanteId");
    } else {
      await insertData(SHEET_NAMES.PONTUACAO, linha);
    }
  }
}

function ordenarRanking(entradas: Omit<RankingEntry, "posicao">[]): RankingEntry[] {
  return entradas
    .sort(
      (a, b) =>
        b.pontos - a.pontos ||
        b.placaresExatos - a.placaresExatos ||
        b.jogosAcertados - a.jogosAcertados ||
        a.nome.localeCompare(b.nome, "pt-BR")
    )
    .map((entrada, i) => ({ ...entrada, posicao: i + 1 }));
}

/** Ranking geral, lido diretamente da aba Pontuacao (populada por recalcularPontuacaoGeral). */
export async function obterRankingGeral(): Promise<RankingEntry[]> {
  await initializeSpreadsheet();
  const [pontuacoes, participantes] = await Promise.all([
    getData(SHEET_NAMES.PONTUACAO),
    listarParticipantes(),
  ]);
  const nomesPorId = new Map(participantes.map((p) => [p.id, p.nome]));

  const entradas = pontuacoes
    .filter((row) => nomesPorId.has(row.participanteId))
    .map((row) => ({
      participanteId: row.participanteId,
      nome: nomesPorId.get(row.participanteId)!,
      pontos: Number(row.pontos) || 0,
      jogosAcertados: Number(row.jogosAcertados) || 0,
      placaresExatos: Number(row.placaresExatos) || 0,
    }));

  return ordenarRanking(entradas);
}

/** Ranking calculado sob demanda considerando apenas os jogos de uma rodada. */
export async function obterRankingPorRodada(rodada: number): Promise<RankingRodadaEntry[]> {
  await initializeSpreadsheet();
  const [jogos, palpites, participantes] = await Promise.all([
    listarJogos(),
    listarPalpites(),
    listarParticipantes(),
  ]);

  const jogosDaRodada = jogos.filter((j) => j.rodada === rodada);
  const idsJogosDaRodada = new Set(jogosDaRodada.map((j) => j.id));
  const palpitesDaRodada = palpites.filter((p) => idsJogosDaRodada.has(p.jogoId));

  const acumulado = acumularPontos(jogosDaRodada, palpitesDaRodada);
  const nomesPorId = new Map(participantes.map((p) => [p.id, p.nome]));

  const entradas = participantes
    .filter((p) => acumulado.has(p.id))
    .map((p) => {
      const dados = acumulado.get(p.id)!;
      return {
        participanteId: p.id,
        nome: nomesPorId.get(p.id)!,
        pontos: dados.pontos,
        jogosAcertados: dados.jogosAcertados,
        placaresExatos: dados.placaresExatos,
      };
    });

  return ordenarRanking(entradas).map((e) => ({ ...e, rodada }));
}

export interface DetalhePalpite {
  jogo: Jogo;
  palpite: Palpite;
  pontos: number;
  acertouResultado: boolean;
  placarExato: boolean;
}

/** Histórico de palpites de um participante, com a pontuação obtida em cada jogo já finalizado. */
export async function obterHistoricoParticipante(participanteId: string): Promise<DetalhePalpite[]> {
  const [jogos, palpites] = await Promise.all([listarJogos(), listarPalpitesDoParticipante(participanteId)]);
  const jogosPorId = new Map(jogos.map((j) => [j.id, j]));

  return palpites
    .map((palpite) => {
      const jogo = jogosPorId.get(palpite.jogoId);
      if (!jogo) return null;
      const resultado = calcularPontosPalpite(jogo, palpite);
      return { jogo, palpite, ...resultado };
    })
    .filter((item): item is DetalhePalpite => item !== null)
    .sort((a, b) => (a.jogo.data + a.jogo.hora).localeCompare(b.jogo.data + b.jogo.hora));
}
