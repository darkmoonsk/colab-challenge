'use client';

import { Footer } from '@/components/footer';
import { Menu } from '@/components/menu';
import { LoadingSpinner } from '@/components/loading-spinner';
import { ReportForm } from '@/components/report-form';
import { ReportResult } from '@/components/report-result';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useReportForm } from '@/hooks/use-report-form';

export default function Home() {
  const {
    reportInput,
    isSubmitting,
    submitError,
    result,
    setReportInput,
    handleSubmit,
  } = useReportForm();

  return (
    <div className="min-h-screen bg-(--color-page)">
      <div className="px-4 py-5 sm:px-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <Menu />
          <main className="mx-auto my-10 flex w-full max-w-2xl flex-col gap-4">
            <ReportForm
              values={reportInput}
              isSubmitting={isSubmitting}
              onChangeValues={setReportInput}
              onSubmit={handleSubmit}
            />
            {isSubmitting ? (
              <LoadingSpinner label="Processando... por favor aguarde." />
            ) : null}
            {submitError ? (
              <Alert variant="destructive">
                <AlertTitle>Erro ao enviar solicitação</AlertTitle>
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            ) : null}
            {result ? <ReportResult result={result} /> : null}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
