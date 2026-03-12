import { Injectable } from '@nestjs/common';
import { Report } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface CreateReportRecordParams {
  readonly title: string;
  readonly description: string;
  readonly location: string;
  readonly aiCategory: string;
  readonly aiPriority: string;
  readonly aiSummary: string;
}

/**
 * Encapsulates report persistence operations.
 */
@Injectable()
export class ReportsRepository {
  constructor(private readonly prismaService: PrismaService) {}
  /**
   * Persists a report and returns the created record.
   */
  public async createReportRecord(
    params: CreateReportRecordParams,
  ): Promise<Report> {
    return this.prismaService.report.create({
      data: {
        title: params.title,
        description: params.description,
        location: params.location,
        aiCategory: params.aiCategory,
        aiPriority: params.aiPriority,
        aiSummary: params.aiSummary,
      },
    });
  }
}
