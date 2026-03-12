import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import type { CreateReportResponse, ReportInput } from '@colab/shared';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

describe('ReportsController', () => {
  let reportsController: ReportsController;
  let mockReportsService: jest.Mocked<Pick<ReportsService, 'createReport'>>;
  beforeEach(() => {
    mockReportsService = {
      createReport: jest.fn(),
    };
    reportsController = new ReportsController(
      mockReportsService as ReportsService,
    );
  });
  it('should return created report response', async () => {
    const inputPayload: ReportInput = {
      title: 'Buraco grande',
      description: 'Existe um buraco no cruzamento.',
      location: 'Rua das Flores, 200',
    };
    const expectedResponse: CreateReportResponse = {
      id: 'report-1',
      category: 'Via Pública',
      priority: 'Alta',
      summary: 'Buraco com risco de acidente.',
    };
    mockReportsService.createReport.mockResolvedValue(expectedResponse);
    const actualResult = await reportsController.createReport(inputPayload);
    expect(actualResult).toEqual(expectedResponse);
    expect(mockReportsService.createReport).toHaveBeenCalledWith(inputPayload);
  });
  it('should rethrow bad request exception', async () => {
    const inputPayload: ReportInput = {
      title: '  ',
      description: 'Descricao valida.',
      location: 'Rua das Flores, 200',
    };
    const expectedException: BadRequestException = new BadRequestException(
      'Invalid payload.',
    );
    mockReportsService.createReport.mockRejectedValue(expectedException);
    await expect(reportsController.createReport(inputPayload)).rejects.toBe(
      expectedException,
    );
  });
  it('should throw internal server error for unknown failures', async () => {
    const inputPayload: ReportInput = {
      title: 'Buraco grande',
      description: 'Existe um buraco no cruzamento.',
      location: 'Rua das Flores, 200',
    };
    mockReportsService.createReport.mockRejectedValue(
      new Error('Unexpected failure.'),
    );
    await expect(reportsController.createReport(inputPayload)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
