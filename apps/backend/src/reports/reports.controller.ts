import {
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import type { CreateReportResponse, ReportInput } from '@colab/shared';
import { ReportsService } from './reports.service';

/**
 * Exposes report HTTP endpoints.
 */
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}
  /**
   * Creates a report and returns AI enrichment metadata.
   */
  @Post()
  public async createReport(
    @Body() payload: ReportInput,
  ): Promise<CreateReportResponse> {
    try {
      return await this.reportsService.createReport(payload);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'BadRequestException') {
        throw err;
      }
      throw new InternalServerErrorException('Could not create report.');
    }
  }
}
