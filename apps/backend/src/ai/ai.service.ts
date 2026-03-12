import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ReportSchema } from '@colab/shared';
import type { AiClassificationResult } from '@colab/shared';
import { LLM_CLIENT_TOKEN } from './constants/llm-client.token';
import type { LlmClientPort } from './contracts/llm-client.port';

/**
 * Handles report classification using Gemini.
 */
@Injectable()
export class AiService {
  private static readonly MAX_ATTEMPTS: number = 3;
  private readonly logger: Logger = new Logger(AiService.name);
  constructor(
    @Inject(LLM_CLIENT_TOKEN)
    private readonly llmClient: LlmClientPort,
  ) {}
  /**
   * Classifies report description into category, priority and summary.
   */
  public async classifyReport(
    description: string,
    title: string,
  ): Promise<AiClassificationResult> {
    const prompt: string = this.buildPrompt({ description, title });
    let lastErrorMessage: string = 'Unknown AI error.';
    for (
      let attempt: number = 1;
      attempt <= AiService.MAX_ATTEMPTS;
      attempt += 1
    ) {
      try {
        const rawText: string =
          await this.llmClient.generateTextWithJsonResponse(prompt);
        const parsedText: string = this.extractJsonString({ rawText });
        const parsedObject: unknown = JSON.parse(parsedText);
        return ReportSchema.aiResponse.parse(parsedObject);
      } catch (err: unknown) {
        lastErrorMessage =
          err instanceof Error ? err.message : 'Unmapped AI exception.';
        this.logger.warn(
          `Gemini classification attempt ${attempt} failed: ${lastErrorMessage}`,
        );
      }
    }
    throw new InternalServerErrorException(
      `Failed to classify report with AI after retries: ${lastErrorMessage}`,
    );
  }
  private buildPrompt(params: {
    readonly description: string;
    readonly title: string;
  }): string {
    return [
      'You are an assistant that classifies urban issue reports.',
      'Analyze the citizen report and answer ONLY with valid JSON.',
      'The "category" field is free text suggested by AI.',
      'Suggested examples: Iluminação, Via Publica, Saneamento.',
      'Other categories are allowed when appropriate.',
      'Use this exact output format:',
      '{',
      '  "category": "string",',
      '  "priority": "Baixa | Média | Alta",',
      '  "summary": "formal technical summary of the issue in Brazilian Portuguese"',
      '}',
      'Rules:',
      '- Never add text outside JSON.',
      '- Keep summary impersonal and technical.',
      'Citizen report: ',
      `Title - "${params.title}"`,
      `Description - "${params.description}"`,
    ].join('\n');
  }
  private extractJsonString(params: { readonly rawText: string }): string {
    const normalizedText: string = params.rawText.trim();
    if (normalizedText.startsWith('{') && normalizedText.endsWith('}')) {
      return normalizedText;
    }
    const match: RegExpMatchArray | null = normalizedText.match(/\{[\s\S]*\}/);
    if (!match || !match[0]) {
      throw new Error('Could not extract JSON from AI response.');
    }
    return match[0];
  }
}
