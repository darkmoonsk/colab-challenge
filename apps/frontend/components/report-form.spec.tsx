import type { ReportInput } from '@colab/shared';
import { fireEvent, render, screen } from '@testing-library/react';
import { ReportForm } from '@/components/report-form';

describe('ReportForm', () => {
  function getDefaultValues(): ReportInput {
    return {
      title: 'Buraco na rua',
      description: 'Existe um buraco na avenida principal.',
      location: 'Lat -23.55052, Long -46.63331',
    };
  }
  it('should render controlled field values', () => {
    const inputValues = getDefaultValues();
    render(
      <ReportForm
        values={inputValues}
        isSubmitting={false}
        onChangeValues={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    expect(screen.getByLabelText('Título')).toHaveValue(inputValues.title);
    expect(screen.getByLabelText('Descrição')).toHaveValue(inputValues.description);
    expect(screen.getByLabelText('Localização')).toHaveValue(inputValues.location);
  });
  it('should call onChangeValues when title changes', () => {
    const inputValues = getDefaultValues();
    const mockOnChangeValues = jest.fn();
    render(
      <ReportForm
        values={inputValues}
        isSubmitting={false}
        onChangeValues={mockOnChangeValues}
        onSubmit={jest.fn()}
      />,
    );
    const titleInput = screen.getByLabelText('Título');
    fireEvent.change(titleInput, {
      target: { name: 'title', value: 'Semáforo quebrado' },
    });
    expect(mockOnChangeValues).toHaveBeenCalled();
    expect(mockOnChangeValues).toHaveBeenLastCalledWith({
      ...inputValues,
      title: 'Semáforo quebrado',
    });
  });
  it('should call onSubmit when form submits', () => {
    const inputValues = getDefaultValues();
    const mockOnSubmit = jest.fn();
    render(
      <ReportForm
        values={inputValues}
        isSubmitting={false}
        onChangeValues={jest.fn()}
        onSubmit={mockOnSubmit}
      />,
    );
    const submitButton = screen.getByRole('button', { name: 'Enviar solicitação' });
    fireEvent.click(submitButton);
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });
  it('should disable submit button while submitting', () => {
    render(
      <ReportForm
        values={getDefaultValues()}
        isSubmitting
        onChangeValues={jest.fn()}
        onSubmit={jest.fn()}
      />,
    );
    const submitButton = screen.getByRole('button', { name: 'Processando...' });
    expect(submitButton).toBeDisabled();
  });
});
