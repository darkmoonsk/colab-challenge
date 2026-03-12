import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Exposes PrismaService application-wide.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
