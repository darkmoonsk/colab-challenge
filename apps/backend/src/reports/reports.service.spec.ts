import { BadRequestException } from '@nestjs/common';
import type { AiClassificationResult, ReportInput } from '@colab/shared';
import { AiService } from '../ai/ai.service';
import { ReportsRepository } from './reports.repository';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let reportsService: ReportsService;
  let mockAiService: jest.Mocked<Pick<AiService, 'classifyReport'>>;
  let mockReportsRepository: jest.Mocked<
    Pick<ReportsRepository, 'createReportRecord'>
  >;
  beforeEach(() => {
    mockAiService = {
      classifyReport: jest.fn(),
    };
    mockReportsRepository = {
      createReportRecord: jest.fn(),
    };
    reportsService = new ReportsService(
      mockAiService as AiService,
      mockReportsRepository as ReportsRepository,
    );
  });
  it('should create report with ai enrichment', async () => {
    const inputPayload: ReportInput = {
      title: 'Buraco grande',
      description: 'Existe um buraco no cruzamento.',
      location: 'Rua das Flores, 200',
    };
    const mockAiClassification: AiClassificationResult = {
      category: 'Via Pública',
      priority: 'Alta',
      summary: 'Buraco com risco de acidente.',
    };
    mockAiService.classifyReport.mockResolvedValue(mockAiClassification);
    mockReportsRepository.createReportRecord.mockResolvedValue({
      id: 'report-1',
      title: inputPayload.title,
      description: inputPayload.description,
      location: inputPayload.location,
      aiCategory: mockAiClassification.category,
      aiPriority: mockAiClassification.priority,
      aiSummary: mockAiClassification.summary,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    } as never);
    const actualResult = await reportsService.createReport(inputPayload);
    expect(mockAiService.classifyReport).toHaveBeenCalledWith(
      inputPayload.description,
      inputPayload.title,
    );
    expect(mockReportsRepository.createReportRecord).toHaveBeenCalledWith({
      title: inputPayload.title,
      description: inputPayload.description,
      location: inputPayload.location,
      aiCategory: mockAiClassification.category,
      aiPriority: mockAiClassification.priority,
      aiSummary: mockAiClassification.summary,
    });
    expect(actualResult).toEqual({
      id: 'report-1',
      category: 'Via Pública',
      priority: 'Alta',
      summary: 'Buraco com risco de acidente.',
    });
  });
  it('should throw bad request exception for invalid payload', async () => {
    const invalidPayload: ReportInput = {
      title: '  ',
      description: 'Descricao valida.',
      location: 'Endereco valido',
    };
    await expect(reportsService.createReport(invalidPayload)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockAiService.classifyReport).not.toHaveBeenCalled();
    expect(mockReportsRepository.createReportRecord).not.toHaveBeenCalled();
  });
});
