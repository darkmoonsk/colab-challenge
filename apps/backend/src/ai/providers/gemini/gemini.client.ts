import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { LlmClientPort } from '../../contracts/llm-client.port';

/**
 * Gemini implementation for LLM text generation.
 */
@Injectable()
export class GeminiClient implements LlmClientPort {
  private static readonly DEFAULT_MODEL: string = 'gemini-3-flash-preview';
  private readonly client: GoogleGenAI;
  constructor() {
    const apiKey: string | undefined = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new InternalServerErrorException(
        'Missing GEMINI_API_KEY configuration.',
      );
    }
    this.client = new GoogleGenAI({ apiKey });
  }
  /**
   * Generates text from Gemini using a prompt.
   */
  public async generateTextWithJsonResponse(prompt: string): Promise<string> {
    const modelName: string =
      process.env.GEMINI_MODEL ?? GeminiClient.DEFAULT_MODEL;
    const response = await this.client.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });
    return this.extractText({ responseText: response.text });
  }
  private extractText(params: {
    readonly responseText: string | undefined;
  }): string {
    if (!params.responseText) {
      throw new InternalServerErrorException('Empty Gemini response content.');
    }
    return params.responseText;
  }
}
