import { Link } from "@tanstack/react-router";
import { Music4 } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";

export function SiteHeader({ children }: { children?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Music4 className="size-4" />
          </span>
          <span className="text-[0.95rem] font-semibold tracking-tight">Hindi Worship Chords</span>
        </Link>
        <div className="ml-auto flex flex-1 items-center justify-end gap-2">
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}