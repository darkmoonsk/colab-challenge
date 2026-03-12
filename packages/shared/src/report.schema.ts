import { z } from 'zod';

/**
 * Centralizes report input and AI response schemas.
 */
export class ReportSchema {
  public static readonly reportInput = z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().min(1),
    location: z.string().trim().min(1),
  });
  public static readonly aiResponse = z.object({
    category: z.string().trim().min(1),
    priority: z.enum(['Baixa', 'Média', 'Alta']),
    summary: z.string().trim().min(1),
  });
}
