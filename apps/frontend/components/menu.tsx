import Image from "next/image";
import { Bell, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const MENU_ITEMS: readonly string[] = [
  "Dashboard",
  "Relatórios",
  "Ocorrências",
  "Equipe",
];

export function Menu() {
  const leftButtonStyle =
    "cursor-pointer border-violet-200 text-violet-700 hover:bg-violet-50";

  return (
    <header className="w-full rounded-2xl border border-violet-200/80 bg-white/90 p-3 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        <div className="cursor-pointer flex min-w-fit items-center">
          <Image
            src="/logo.webp"
            alt="Logo da plataforma"
            width={75}
            height={75}
            className=" w-auto object-contain"
          />
        </div>
        <nav className="flex flex-1 flex-wrap items-center gap-2">
          {MENU_ITEMS.map((item: string) => (
            <Button
              key={item}
              type="button"
              variant="ghost"
              className="cursor-pointer text-lg p-6 text-violet-700 hover:bg-violet-50 hover:text-violet-900"
            >
              {item}
            </Button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button type="button" variant="outline" className={leftButtonStyle}>
            <Search className="size-4" />
            Buscar
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className={leftButtonStyle}
          >
            <Bell className="size-4" />
          </Button>
          <Button type="button" variant="outline" className={leftButtonStyle}>
            Admin
            <ChevronDown className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
