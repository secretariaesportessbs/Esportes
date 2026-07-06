import { z } from "zod";

export const participanteSchema = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo").max(100),
  telefone: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .max(20)
    .regex(/^[\d()+\-\s]+$/, "Use apenas números e símbolos de telefone"),
  email: z.string().trim().email("E-mail inválido").max(150).optional().or(z.literal("")),
  cidade: z.string().trim().max(100).optional().or(z.literal("")),
});

export const palpiteSchema = z.object({
  participanteId: z.string().trim().min(1, "Selecione o participante"),
  jogoId: z.string().trim().min(1),
  placarMandante: z.coerce.number().int().min(0).max(50),
  placarVisitante: z.coerce.number().int().min(0).max(50),
});

export const jogoSchema = z.object({
  rodada: z.coerce.number().int().min(1),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  hora: z.string().regex(/^\d{2}:\d{2}$/, "Hora inválida"),
  timeMandante: z.string().trim().min(1, "Informe o time mandante"),
  timeVisitante: z.string().trim().min(1, "Informe o time visitante"),
});

export const resultadoSchema = z.object({
  jogoId: z.string().trim().min(1),
  placarMandante: z.coerce.number().int().min(0).max(50),
  placarVisitante: z.coerce.number().int().min(0).max(50),
});

export const loginSchema = z.object({
  senha: z.string().min(1, "Informe a senha"),
});

export const telefoneSchema = z.object({
  telefone: z
    .string()
    .trim()
    .min(10, "Telefone inválido")
    .regex(/^[\d()+\-\s]+$/, "Use apenas números e símbolos de telefone"),
});

export const configSchema = z.object({
  chave: z.string().trim().min(1),
  valor: z.string().trim().max(500),
});
