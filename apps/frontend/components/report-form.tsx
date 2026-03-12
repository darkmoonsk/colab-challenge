import type { ReportInput } from "@colab/shared";
import { type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReportFormProps {
  readonly values: ReportInput;
  readonly isSubmitting: boolean;
  readonly onChangeValues: (values: ReportInput) => void;
  readonly onSubmit: () => void;
}

export function ReportForm({
  values,
  isSubmitting,
  onChangeValues,
  onSubmit,
}: ReportFormProps) {
  const inputClassName: string =
    "border-violet-200 focus-visible:border-violet-500 focus-visible:ring-violet-500/30";

  const updateValue = (params: {
    readonly fieldName: keyof ReportInput;
    readonly nextValue: string;
    readonly currentValues: ReportInput;
  }): ReportInput => {
    return {
      ...params.currentValues,
      [params.fieldName]: params.nextValue,
    };
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const fieldName: keyof ReportInput = event.target.name as keyof ReportInput;
    const nextValues: ReportInput = updateValue({
      fieldName,
      nextValue: event.target.value,
      currentValues: values,
    });
    onChangeValues(nextValues);
  };

  return (
    <form
      onSubmit={(event): void => {
        event.preventDefault();
        onSubmit();
      }}
      className="w-full"
    >
      <Card className="bg-white shadow-sm ring-violet-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-violet-900">
            Zeladoria Urbana Inteligente
          </CardTitle>
          <CardDescription className="text-violet-700">
            Envie sua solicitação para classificação automática por IA e rápido
            atendimento.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title" className="font-semibold text-violet-950">
              Título
            </Label>
            <Input
              id="title"
              name="title"
              value={values.title}
              onChange={handleInputChange}
              required
              className={inputClassName}
              placeholder="Ex.: Buraco na rua"
            />
          </div>
          <div className="grid gap-2">
            <Label
              htmlFor="description"
              className="font-semibold text-violet-950"
            >
              Descrição
            </Label>
            <Textarea
              id="description"
              name="description"
              value={values.description}
              onChange={handleInputChange}
              required
              rows={4}
              className={`${inputClassName} resize-none h-24`}
              placeholder="Descreva o problema encontrado"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="location" className="font-semibold text-violet-950">
              Localização
            </Label>
            <Input
              id="location"
              name="location"
              value={values.location}
              disabled
              required
              className={inputClassName}
              placeholder="Lat -23.5505, Long -46.6333"
            />
          </div>
          <div className="mt-1 flex justify-end flex-wrap gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="p-6 cursor-pointer hover:bg-violet-600 hover:scale-105 transition-all duration-300"
            >
              {isSubmitting ? "Processando..." : "Enviar solicitação"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
