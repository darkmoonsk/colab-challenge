import type { CreateReportResponse, ReportInput } from '@colab/shared';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  formatCoordinatesToLocation,
  generateBrazilCoordinates,
} from '@/modules/location/location-simulator';
import { createReport } from '@/usecase/createReport';
import { useReportForm } from '@/hooks/use-report-form';

jest.mock('@/modules/location/location-simulator', () => ({
  generateBrazilCoordinates: jest.fn(),
  formatCoordinatesToLocation: jest.fn(),
}));

jest.mock('@/usecase/createReport', () => ({
  createReport: jest.fn(),
}));

describe('useReportForm', () => {
  const mockGenerateBrazilCoordinates = jest.mocked(generateBrazilCoordinates);
  const mockFormatCoordinatesToLocation = jest.mocked(formatCoordinatesToLocation);
  const mockCreateReport = jest.mocked(createReport);
  beforeEach(() => {
    jest.clearAllMocks();
    mockGenerateBrazilCoordinates.mockReturnValue({
      latitude: -23.55052,
      longitude: -46.63331,
    });
  });
  it('should initialize location from simulator on mount', async () => {
    const expectedLocation = 'Lat -23.55052, Long -46.63331';
    mockFormatCoordinatesToLocation.mockReturnValue(expectedLocation);
    const { result } = renderHook(() => useReportForm());
    await waitFor(() => {
      expect(result.current.reportInput.location).toBe(expectedLocation);
    });
    expect(mockGenerateBrazilCoordinates).toHaveBeenCalledTimes(1);
  });
  it('should set error when location is empty before submit', async () => {
    mockFormatCoordinatesToLocation.mockReturnValue('');
    const { result } = renderHook(() => useReportForm());
    await waitFor(() => {
      expect(result.current.reportInput.location).toBe('');
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(mockCreateReport).not.toHaveBeenCalled();
    expect(result.current.submitError).toBe(
      'Não foi possível gerar a localização automaticamente.',
    );
  });
  it('should submit report and store result on success', async () => {
    const expectedLocation = 'Lat -23.55052, Long -46.63331';
    const inputReport: ReportInput = {
      title: 'Semáforo quebrado',
      description: 'O semáforo está apagado.',
      location: expectedLocation,
    };
    const expectedResult: CreateReportResponse = {
      id: 'report-1',
      category: 'Trânsito',
      priority: 'Alta',
      summary: 'Semáforo quebrado em via movimentada.',
    };
    mockFormatCoordinatesToLocation.mockReturnValue(expectedLocation);
    mockCreateReport.mockResolvedValue(expectedResult);
    const { result } = renderHook(() => useReportForm());
    await waitFor(() => {
      expect(result.current.reportInput.location).toBe(expectedLocation);
    });
    act(() => {
      result.current.setReportInput(inputReport);
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(mockCreateReport).toHaveBeenCalledWith(inputReport);
    expect(result.current.result).toEqual(expectedResult);
    expect(result.current.submitError).toBe('');
    expect(result.current.isSubmitting).toBe(false);
  });
  it('should set submit error when request fails', async () => {
    const expectedLocation = 'Lat -23.55052, Long -46.63331';
    mockFormatCoordinatesToLocation.mockReturnValue(expectedLocation);
    mockCreateReport.mockRejectedValue(new Error('request failed'));
    const { result } = renderHook(() => useReportForm());
    await waitFor(() => {
      expect(result.current.reportInput.location).toBe(expectedLocation);
    });
    act(() => {
      result.current.setReportInput({
        title: 'Lâmpada apagada',
        description: 'Poste com lâmpada apagada.',
        location: expectedLocation,
      });
    });
    await act(async () => {
      await result.current.handleSubmit();
    });
    expect(result.current.result).toBeNull();
    expect(result.current.submitError).toBe(
      'Não foi possível enviar a solicitação. Tente novamente.',
    );
    expect(result.current.isSubmitting).toBe(false);
  });
});
