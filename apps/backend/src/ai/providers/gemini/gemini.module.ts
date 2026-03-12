import { ExistingProvider, Module } from '@nestjs/common';
import { LLM_CLIENT_TOKEN } from '../../constants/llm-client.token';
import { LlmClientPort } from '../../contracts/llm-client.port';
import { GeminiClient } from './gemini.client';

const llmClientProvider: ExistingProvider<LlmClientPort> = {
  provide: LLM_CLIENT_TOKEN,
  useExisting: GeminiClient,
};

/**
 * Registers Gemini as the active LLM provider.
 */
@Module({
  providers: [GeminiClient, llmClientProvider],
  exports: [LLM_CLIENT_TOKEN],
})
export class GeminiModule {}
