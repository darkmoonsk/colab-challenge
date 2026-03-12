import type { Report } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ReportsRepository } from './reports.repository';

describe('ReportsRepository', () => {
  let reportsRepository: ReportsRepository;
  let mockPrismaService: {
    readonly report: {
      readonly create: jest.Mock<Promise<Report>, [unknown]>;
    };
  };
  beforeEach(() => {
    mockPrismaService = {
      report: {
        create: jest.fn(),
      },
    };
    reportsRepository = new ReportsRepository(
      mockPrismaService as unknown as PrismaService,
    );
  });
  it('should persist report through prisma', async () => {
    const inputParams = {
      title: 'Buraco grande',
      description: 'Existe um buraco no cruzamento.',
      location: 'Rua das Flores, 200',
      aiCategory: 'Via Pública',
      aiPriority: 'Alta',
      aiSummary: 'Buraco com risco de acidente.',
    };
    const expectedReport: Report = {
      id: 'report-1',
      title: inputParams.title,
      description: inputParams.description,
      location: inputParams.location,
      aiCategory: inputParams.aiCategory,
      aiPriority: inputParams.aiPriority,
      aiSummary: inputParams.aiSummary,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    };
    mockPrismaService.report.create.mockResolvedValue(expectedReport);
    const actualResult = await reportsRepository.createReportRecord(inputParams);
    expect(mockPrismaService.report.create).toHaveBeenCalledWith({
      data: {
        title: inputParams.title,
        description: inputParams.description,
        location: inputParams.location,
        aiCategory: inputParams.aiCategory,
        aiPriority: inputParams.aiPriority,
        aiSummary: inputParams.aiSummary,
      },
    });
    expect(actualResult).toEqual(expectedReport);
  });
});
