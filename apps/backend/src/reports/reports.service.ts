import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ReportSchema,
  type AiClassificationResult,
  type CreateReportResponse,
  type ReportInput,
} from '@colab/shared';
import { ZodError, z } from 'zod';
import { AiService } from '../ai/ai.service';
import { ReportsRepository } from './reports.repository';

/**
 * Orchestrates report creation and AI enrichment.
 */
@Injectable()
export class ReportsService {
  constructor(
    private readonly aiService: AiService,
    private readonly reportsRepository: ReportsRepository,
  ) {}
  /**
   * Validates, classifies and persists a report.
   */
  public async createReport(
    payload: ReportInput,
  ): Promise<CreateReportResponse> {
    const input: ReportInput = this.parseInput({ payload });
    const aiClassification: AiClassificationResult =
      await this.aiService.classifyReport(input.description, input.title);
    const createdReport = await this.reportsRepository.createReportRecord({
      title: input.title,
      description: input.description,
      location: input.location,
      aiCategory: aiClassification.category,
      aiPriority: aiClassification.priority,
      aiSummary: aiClassification.summary,
    });
    return {
      id: createdReport.id,
      category: createdReport.aiCategory,
      priority: createdReport.aiPriority as 'Baixa' | 'Média' | 'Alta',
      summary: createdReport.aiSummary,
    };
  }
  private parseInput(params: { readonly payload: ReportInput }): ReportInput {
    try {
      return ReportSchema.reportInput.parse(params.payload);
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        throw new BadRequestException(z.flattenError(err));
      }
      throw err;
    }
  }
}
