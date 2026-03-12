import { z } from 'zod';
import { ReportSchema } from './report.schema.js';

export type ReportInput = z.infer<typeof ReportSchema.reportInput>;
export type AiClassificationResult = z.infer<typeof ReportSchema.aiResponse>;
export type ReportPriority = AiClassificationResult['priority'];
export interface CreateReportResponse extends AiClassificationResult {
  readonly id: string;
}
