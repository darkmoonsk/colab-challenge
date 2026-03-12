import { InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { GeminiClient } from './gemini.client';

const mockGenerateContent = jest.fn();

jest.mock('@google/genai', () => ({
  GoogleGenAI: jest.fn().mockImplementation(() => ({
    models: {
      generateContent: mockGenerateContent,
    },
  })),
}));

describe('GeminiClient', () => {
  const originalEnvironment: NodeJS.ProcessEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnvironment };
    process.env.GEMINI_API_KEY = 'test-api-key';
    delete process.env.GEMINI_MODEL;
    mockGenerateContent.mockReset();
    jest.clearAllMocks();
  });
  afterAll(() => {
    process.env = originalEnvironment;
  });
  it('should throw when GEMINI_API_KEY is missing', () => {
    delete process.env.GEMINI_API_KEY;
    expect(() => new GeminiClient()).toThrow(InternalServerErrorException);
  });
  it('should generate json text using default model', async () => {
    mockGenerateContent.mockResolvedValue({
      text: '{"category":"Via Pública","priority":"Alta","summary":"Resumo."}',
    });
    const geminiClient = new GeminiClient();
    const actualResult = await geminiClient.generateTextWithJsonResponse(
      'Input prompt',
    );
    expect(actualResult).toBe(
      '{"category":"Via Pública","priority":"Alta","summary":"Resumo."}',
    );
    expect(GoogleGenAI).toHaveBeenCalledWith({ apiKey: 'test-api-key' });
    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-3-flash-preview',
      contents: 'Input prompt',
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });
  });
  it('should generate json text using model from environment', async () => {
    process.env.GEMINI_MODEL = 'gemini-custom';
    mockGenerateContent.mockResolvedValue({
      text: '{"category":"Saneamento","priority":"Média","summary":"Resumo."}',
    });
    const geminiClient = new GeminiClient();
    await geminiClient.generateTextWithJsonResponse('Input prompt');
    expect(mockGenerateContent).toHaveBeenCalledWith({
      model: 'gemini-custom',
      contents: 'Input prompt',
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });
  });
  it('should throw when gemini response text is empty', async () => {
    mockGenerateContent.mockResolvedValue({ text: undefined });
    const geminiClient = new GeminiClient();
    await expect(
      geminiClient.generateTextWithJsonResponse('Input prompt'),
    ).rejects.toThrow(InternalServerErrorException);
  });
});
