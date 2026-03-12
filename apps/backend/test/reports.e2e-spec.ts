import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AiService } from '../src/ai/ai.service';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { ReportsRepository } from '../src/reports/reports.repository';

describe('ReportsController (e2e)', () => {
  let application: INestApplication;
  const originalEnvironment: NodeJS.ProcessEnv = process.env;
  let mockAiService: { readonly classifyReport: jest.Mock };
  let mockReportsRepository: { readonly createReportRecord: jest.Mock };
  beforeEach(async () => {
    process.env = { ...originalEnvironment };
    process.env.GEMINI_API_KEY = 'test-api-key';
    mockAiService = {
      classifyReport: jest.fn().mockResolvedValue({
        category: 'Via Pública',
        priority: 'Alta',
        summary: 'Buraco com risco de acidente.',
      }),
    };
    mockReportsRepository = {
      createReportRecord: jest.fn().mockResolvedValue({
        id: 'report-1',
        title: 'Buraco grande',
        description: 'Existe um buraco no cruzamento.',
        location: 'Rua das Flores, 200',
        aiCategory: 'Via Pública',
        aiPriority: 'Alta',
        aiSummary: 'Buraco com risco de acidente.',
        createdAt: new Date(),
      }),
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
        enableShutdownHooks: jest.fn(),
      })
      .overrideProvider(AiService)
      .useValue(mockAiService)
      .overrideProvider(ReportsRepository)
      .useValue(mockReportsRepository)
      .compile();
    application = moduleFixture.createNestApplication();
    await application.init();
  });
  afterEach(async () => {
    if (application) {
      await application.close();
    }
  });
  afterAll(() => {
    process.env = originalEnvironment;
  });
  it('should create report and return category, priority and summary', async () => {
    const server: Parameters<typeof request>[0] =
      application.getHttpServer() as Parameters<typeof request>[0];
    const actualResponse = await request(server)
      .post('/reports')
      .send({
        title: 'Buraco grande',
        description: 'Existe um buraco no cruzamento.',
        location: 'Rua das Flores, 200',
      })
      .expect(201);
    expect(actualResponse.body).toEqual({
      id: 'report-1',
      category: 'Via Pública',
      priority: 'Alta',
      summary: 'Buraco com risco de acidente.',
    });
  });
  it('should return bad request for invalid payload', async () => {
    const server: Parameters<typeof request>[0] =
      application.getHttpServer() as Parameters<typeof request>[0];
    const actualResponse = await request(server)
      .post('/reports')
      .send({
        title: '',
        description: 'Existe um buraco no cruzamento.',
        location: 'Rua das Flores, 200',
      })
      .expect(400);
    expect(actualResponse.body.fieldErrors.title).toBeDefined();
    expect(mockAiService.classifyReport).not.toHaveBeenCalled();
    expect(mockReportsRepository.createReportRecord).not.toHaveBeenCalled();
  });
  it('should return internal server error when ai classification fails', async () => {
    mockAiService.classifyReport.mockRejectedValueOnce(
      new Error('AI unavailable.'),
    );
    const server: Parameters<typeof request>[0] =
      application.getHttpServer() as Parameters<typeof request>[0];
    const actualResponse = await request(server)
      .post('/reports')
      .send({
        title: 'Buraco grande',
        description: 'Existe um buraco no cruzamento.',
        location: 'Rua das Flores, 200',
      })
      .expect(500);
    expect(actualResponse.body).toEqual({
      statusCode: 500,
      message: 'Could not create report.',
      error: 'Internal Server Error',
    });
    expect(mockReportsRepository.createReportRecord).not.toHaveBeenCalled();
  });
});
