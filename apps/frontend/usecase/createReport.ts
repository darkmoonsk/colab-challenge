import type { CreateReportResponse, ReportInput } from "@colab/shared";
import { apiClient } from "@/services/api";

export async function createReport(
  input: ReportInput,
): Promise<CreateReportResponse> {
  const response = await apiClient.post<CreateReportResponse>(
    "/reports",
    input,
  );
  return response.data;
}
