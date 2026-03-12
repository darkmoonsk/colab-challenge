import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

/**
 * Provides Prisma database access and lifecycle handling.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString: string | undefined = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('Missing DATABASE_URL configuration.');
    }
    const adapter: PrismaPg = new PrismaPg({ connectionString });
    super({ adapter });
  }
  /**
   * Connects to the database when the Nest module starts.
   */
  public async onModuleInit(): Promise<void> {
    await this.$connect();
  }
  /**
   * Disconnects from the database when the Nest module is destroyed.
   */
  public async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
  /**
   * Enables Prisma shutdown hooks for graceful app close.
   */
  public enableShutdownHooks(application: INestApplication): void {
    process.on('beforeExit', () => {
      void application.close();
    });
  }
}
