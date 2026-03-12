import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '@/components/loading-spinner';

describe('LoadingSpinner', () => {
  it('should render spinner label', () => {
    const inputLabel = 'Processando... por favor aguarde.';
    render(<LoadingSpinner label={inputLabel} />);
    expect(screen.getByText(inputLabel)).toBeInTheDocument();
  });
});
