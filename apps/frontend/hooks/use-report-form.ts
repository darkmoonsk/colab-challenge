import type { CreateReportResponse, ReportInput } from "@colab/shared";
import { useEffect, useState } from "react";
import {
  formatCoordinatesToLocation,
  generateBrazilCoordinates,
} from "@/modules/location/location-simulator";
import { createReport } from "@/usecase/createReport";

interface UseReportFormOutput {
  readonly reportInput: ReportInput;
  readonly isSubmitting: boolean;
  readonly submitError: string;
  readonly result: CreateReportResponse | null;
  readonly setReportInput: (input: ReportInput) => void;
  readonly handleSubmit: () => Promise<void>;
}

const EMPTY_REPORT_INPUT: ReportInput = {
  title: "",
  description: "",
  location: "",
};

export function useReportForm(): UseReportFormOutput {
  const [reportInput, setReportInput] =
    useState<ReportInput>(EMPTY_REPORT_INPUT);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [result, setResult] = useState<CreateReportResponse | null>(null);

  useEffect((): void => {
    const coordinates = generateBrazilCoordinates();
    const location: string = formatCoordinatesToLocation(coordinates);
    setReportInput((currentInput: ReportInput) => ({
      ...currentInput,
      location,
    }));
  }, []);

  async function handleSubmit(): Promise<void> {
    if (!reportInput.location.trim()) {
      setSubmitError("Não foi possível gerar a localização automaticamente.");
      return;
    }
    try {
      setIsSubmitting(true);
      setSubmitError("");
      const createdReport: CreateReportResponse =
        await createReport(reportInput);
      setResult(createdReport);
    } catch {
      setSubmitError("Não foi possível enviar a solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    reportInput,
    isSubmitting,
    submitError,
    result,
    setReportInput,
    handleSubmit,
  };
}
