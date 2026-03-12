import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { LLM_CLIENT_TOKEN } from './constants/llm-client.token';
import { AiService } from './ai.service';
import { LlmClientPort } from './contracts/llm-client.port';

describe('AiService', () => {
  let aiService: AiService;
  let mockLlmClient: jest.Mocked<LlmClientPort>;
  beforeEach(async () => {
    mockLlmClient = {
      generateTextWithJsonResponse: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AiService,
        {
          provide: LLM_CLIENT_TOKEN,
          useValue: mockLlmClient,
        },
      ],
    }).compile();
    aiService = module.get<AiService>(AiService);
    mockLlmClient.generateTextWithJsonResponse.mockReset();
  });
  it('should parse ai response correctly', async () => {
    mockLlmClient.generateTextWithJsonResponse.mockResolvedValue(
      '{"category":"Via Pública","priority":"Alta","summary":"Buraco relevante na via publica."}',
    );
    const actualResult = await aiService.classifyReport(
      'Buraco grande na rua.',
      'Buraco grande',
    );
    expect(actualResult).toEqual({
      category: 'Via Pública',
      priority: 'Alta',
      summary: 'Buraco relevante na via publica.',
    });
  });
  it('should retry on invalid json and then succeed', async () => {
    mockLlmClient.generateTextWithJsonResponse
      .mockResolvedValueOnce('invalid-payload')
      .mockResolvedValueOnce(
        '{"category":"Saneamento","priority":"Média","summary":"Vazamento moderado."}',
      );
    const actualResult = await aiService.classifyReport(
      'Vazamento de agua.',
      'Vazamento',
    );
    expect(actualResult).toEqual({
      category: 'Saneamento',
      priority: 'Média',
      summary: 'Vazamento moderado.',
    });
    expect(mockLlmClient.generateTextWithJsonResponse.mock.calls).toHaveLength(
      2,
    );
  });
  it('should throw internal server error when all attempts fail', async () => {
    mockLlmClient.generateTextWithJsonResponse.mockResolvedValue(
      'invalid-payload',
    );
    await expect(
      aiService.classifyReport('Description', 'Title'),
    ).rejects.toThrow(InternalServerErrorException);
    expect(mockLlmClient.generateTextWithJsonResponse.mock.calls).toHaveLength(
      3,
    );
  });
});
