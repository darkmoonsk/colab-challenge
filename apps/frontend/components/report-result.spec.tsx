import type { CreateReportResponse } from '@colab/shared';
import { render, screen } from '@testing-library/react';
import { ReportResult } from '@/components/report-result';

describe('ReportResult', () => {
  it('should render report data with high priority', () => {
    const inputResult: CreateReportResponse = {
      id: 'report-1',
      category: 'Via Pública',
      priority: 'Alta',
      summary: 'Buraco com risco de acidente.',
    };
    render(<ReportResult result={inputResult} />);
    expect(screen.getByText('Solicitação registrada')).toBeInTheDocument();
    expect(screen.getByText('report-1')).toBeInTheDocument();
    expect(screen.getByText('Via Pública')).toBeInTheDocument();
    expect(screen.getByText('Alta')).toBeInTheDocument();
    expect(screen.getByText('Buraco com risco de acidente.')).toBeInTheDocument();
  });
  it('should render report data with medium priority', () => {
    const inputResult: CreateReportResponse = {
      id: 'report-2',
      category: 'Iluminação',
      priority: 'Média',
      summary: 'Lâmpada apagada em rua residencial.',
    };
    render(<ReportResult result={inputResult} />);
    expect(screen.getByText('report-2')).toBeInTheDocument();
    expect(screen.getByText('Média')).toBeInTheDocument();
  });
  it('should render report data with low priority', () => {
    const inputResult: CreateReportResponse = {
      id: 'report-3',
      category: 'Limpeza',
      priority: 'Baixa',
      summary: 'Solicitação de varrição periódica.',
    };
    render(<ReportResult result={inputResult} />);
    expect(screen.getByText('report-3')).toBeInTheDocument();
    expect(screen.getByText('Baixa')).toBeInTheDocument();
  });
});
