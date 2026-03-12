import type { CreateReportResponse, ReportPriority } from '@colab/shared';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportResultProps {
  readonly result: CreateReportResponse;
}

function getPriorityBadgeVariant(
  priority: ReportPriority,
): 'destructive' | 'secondary' | 'default' {
  if (priority === 'Alta') {
    return 'destructive';
  }
  if (priority === 'Média') {
    return 'secondary';
  }
  return 'default';
}

export function ReportResult({ result }: ReportResultProps) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-green-700">
          Solicitação registrada
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <p className="text-sm text-violet-950">
          <span className="font-semibold">ID:</span> {result.id}
        </p>
        <p className="text-sm text-violet-950">
          <span className="font-semibold">Categoria:</span> {result.category}
        </p>
        <p className="text-sm text-violet-950">
          <span className="font-semibold">Prioridade:</span>{' '}
          <Badge
            variant={getPriorityBadgeVariant(result.priority)}
            className="align-middle"
          >
            {result.priority}
          </Badge>
        </p>
        <p className="text-sm text-violet-950">
          <span className="font-semibold">Resumo:</span> {result.summary}
        </p>
      </CardContent>
    </Card>
  );
}
