import { Building2, Copyright, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const FOOTER_ITEMS: readonly string[] = [
  "Acessibilidade",
  "Termos de uso",
  "Privacidade",
  "Ajuda",
];

export function Footer() {
  const currentYear: number = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-violet-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-violet-900">
            <Building2 className="size-5" />
            <span className="text-base font-semibold">GovServices</span>
          </div>
          <nav className="flex flex-wrap items-center gap-2">
            {FOOTER_ITEMS.map((item: string) => (
              <Button
                key={item}
                type="button"
                variant="link"
                className="cursor-pointer text-violet-700 hover:no-underline"
              >
                {item}
              </Button>
            ))}
          </nav>
          <div className="flex items-center gap-2 text-sm text-violet-700">
            <ShieldCheck className="size-4" />
            <span>Serviços digitais seguros</span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 border-t border-violet-100 pt-3 text-xs text-violet-600">
          <Copyright className="size-3.5" />
          <span>{currentYear} GovServices. Todos os direitos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
