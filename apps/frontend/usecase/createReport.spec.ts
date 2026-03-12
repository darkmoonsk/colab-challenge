import type { CreateReportResponse, ReportInput } from '@colab/shared';
import { apiClient } from '@/services/api';
import { createReport } from '@/usecase/createReport';

jest.mock('@/services/api', () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

describe('createReport', () => {
  it('should post report payload and return response data', async () => {
    const inputPayload: ReportInput = {
      title: 'Buraco na rua',
      description: 'Existe um buraco grande na via.',
      location: 'Lat -23.55052, Long -46.63331',
    };
    const mockResponseData: CreateReportResponse = {
      id: 'report-123',
      category: 'Via Pública',
      priority: 'Alta',
      summary: 'Buraco com risco para veículos.',
    };
    const mockPost = apiClient.post as jest.MockedFunction<typeof apiClient.post>;
    mockPost.mockResolvedValue({
      data: mockResponseData,
    });
    const actualResult = await createReport(inputPayload);
    expect(mockPost).toHaveBeenCalledWith('/reports', inputPayload);
    expect(actualResult).toEqual(mockResponseData);
  });
});
