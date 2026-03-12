import { Module } from '@nestjs/common';
import { GeminiModule } from '../ai/providers/gemini/gemini.module';
import { AiService } from './ai.service';

/**
 * Provides AI classification services.
 */
@Module({
  imports: [GeminiModule],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
