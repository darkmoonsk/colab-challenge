import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingSpinnerProps {
  readonly label: string;
}

export function LoadingSpinner({ label }: LoadingSpinnerProps) {
  return (
    <Card className="w-full shadow-sm">
      <CardContent className="flex items-center gap-3 py-3 text-violet-800">
        <Loader2 className="size-4 animate-spin text-violet-700" />
        <span className="text-sm font-medium">{label}</span>
      </CardContent>
    </Card>
  );
}
