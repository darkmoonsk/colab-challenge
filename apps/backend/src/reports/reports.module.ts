import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { ReportsController } from './reports.controller';
import { ReportsRepository } from './reports.repository';
import { ReportsService } from './reports.service';

/**
 * Aggregates report HTTP, business and persistence components.
 */
@Module({
  imports: [AiModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository],
})
export class ReportsModule {}
