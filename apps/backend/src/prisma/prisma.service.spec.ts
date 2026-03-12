import { PrismaService } from './prisma.service';

const mockConnect = jest.fn();
const mockDisconnect = jest.fn();

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn().mockImplementation((params: unknown) => params),
}));

jest.mock('@prisma/client', () => ({
  PrismaClient: class {
    public $connect = mockConnect;
    public $disconnect = mockDisconnect;
  },
}));

describe('PrismaService', () => {
  const originalEnvironment: NodeJS.ProcessEnv = process.env;
  beforeEach(() => {
    process.env = { ...originalEnvironment };
    process.env.DATABASE_URL = 'postgresql://test';
    mockConnect.mockReset();
    mockDisconnect.mockReset();
  });
  afterAll(() => {
    process.env = originalEnvironment;
  });
  it('should throw when DATABASE_URL is missing', () => {
    delete process.env.DATABASE_URL;
    expect(() => new PrismaService()).toThrow(
      new Error('Missing DATABASE_URL configuration.'),
    );
  });
  it('should connect on module init', async () => {
    mockConnect.mockResolvedValue(undefined);
    const prismaService = new PrismaService();
    await prismaService.onModuleInit();
    expect(mockConnect).toHaveBeenCalledTimes(1);
  });
  it('should disconnect on module destroy', async () => {
    mockDisconnect.mockResolvedValue(undefined);
    const prismaService = new PrismaService();
    await prismaService.onModuleDestroy();
    expect(mockDisconnect).toHaveBeenCalledTimes(1);
  });
});
