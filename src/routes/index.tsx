import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, FileMusic, Loader2, RefreshCw, Search, Tag } from "lucide-react";
import { useMemo, useState } from "react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { CATEGORIES, useCategoryTags, type Category } from "@/lib/categories";
import { listSongs } from "@/lib/drive.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hindi Worship Chords — Chord Sheets for Hindi Worship Songs" },
      {
        name: "description",
        content:
          "Browse and read chord sheets for Hindi Christian worship songs. Search by title, filter by category, and view PDFs right in your browser.",
      },
      { property: "og:title", content: "Hindi Worship Chords" },
      {
        property: "og:description",
        content: "A clean, searchable library of Hindi worship song chord sheets.",
      },
    ],
  }),
  component: Library,
});

function Library() {
  const fetchSongs = useServerFn(listSongs);
  const { data, isPending, isFetching, error, refetch } = useQuery({
    queryKey: ["songs"],
    queryFn: () => fetchSongs(),
  });
  const { tags, setTag } = useCategoryTags();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<string>("All");

  const songs = data?.songs ?? [];

  const effectiveCategory = (title: string, driveCategory: string) =>
    tags[title] ?? driveCategory ?? "";

  const tabs = useMemo(() => {
    const set = new Set<string>(CATEGORIES);
    for (const c of data?.categories ?? []) set.add(c);
    for (const s of songs) if (s.category) set.add(s.category);
    set.delete("Uncategorized");
    set.delete("Hindi Hymns");
    const preferred = ["Praise", "Worship", "Christmas", "Easter"];
    const ordered = preferred.filter((c) => set.has(c));
    const rest = [...set].filter((c) => !preferred.includes(c)).sort();
    return ["All", ...ordered, ...rest];
  }, [data?.categories, songs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return songs.filter((s) => {
      if (q && !s.title.toLowerCase().includes(q)) return false;
      if (tab === "All") return true;
      return effectiveCategory(s.title, s.category) === tab;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [songs, query, tab, tags]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader>
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs..."
            aria-label="Search songs"
            className="h-9 pl-9"
          />
        </div>
      </SiteHeader>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Song library</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {songs.length} chord sheet{songs.length === 1 ? "" : "s"}, synced live from Google
              Drive.
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching}>
            <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
            Refresh
          </Button>
        </div>

        <div className="mt-6 -mx-1 flex gap-1 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                tab === t
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {isPending ? (
            <div className="flex items-center justify-center gap-2 py-24 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" /> Loading songs...
            </div>
          ) : error ? (
            <EmptyState
              icon={<AlertCircle className="size-5" />}
              title="We couldn't load the songs"
              body="The Google Drive request failed. Check the connection and try refreshing."
            />
          ) : data && !data.configured ? (
            <EmptyState
              icon={<AlertCircle className="size-5" />}
              title="Google Drive isn't connected yet"
              body="Add a Google Drive API key to start pulling chord sheets from the shared folder."
            />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={<FileMusic className="size-5" />}
              title="No songs here yet"
              body={
                query
                  ? "No titles match your search."
                  : "Nothing has been tagged into this category yet."
              }
            />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((song) => (
                <li
                  key={song.id}
                  className="group relative flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-sm"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-accent-foreground">
                    <FileMusic className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      to="/song/$fileId"
                      params={{ fileId: song.id }}
                      search={{ title: song.title }}
                      className="block truncate text-sm font-medium hover:text-primary"
                    >
                      {song.title}
                    </Link>
                    <p className="truncate text-xs text-muted-foreground">
                      {effectiveCategory(song.title, song.category)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        aria-label={`Tag ${song.title}`}
                      >
                        <Tag className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {CATEGORIES.map((c) => (
                        <DropdownMenuItem key={c} onClick={() => setTag(song.title, c as Category)}>
                          {c}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem onClick={() => setTag(song.title, null)}>
                        Clear tag
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
      <span className="mx-auto grid size-10 place-items-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </span>
      <h2 className="mt-4 text-base font-medium">{title}</h2>
      <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
