import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/song/$fileId")({
  validateSearch: (search: Record<string, unknown>) => ({
    title: typeof search["title"] === "string" ? (search["title"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Chord sheet — Hindi Worship Chords" },
      {
        name: "description",
        content: "Read the chord sheet for this Hindi worship song right in your browser.",
      },
      { property: "og:title", content: "Chord sheet — Hindi Worship Chords" },
      {
        property: "og:description",
        content: "Read the chord sheet for this Hindi worship song right in your browser.",
      },
    ],
  }),
  component: SongDetail,
});

function SongDetail() {
  const { fileId } = Route.useParams();
  const { title } = Route.useSearch();
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
  const openUrl = `https://drive.google.com/file/d/${fileId}/view`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to library
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <h1 className="min-w-0 break-words text-xl font-semibold tracking-tight sm:text-3xl">
            {title || "Chord sheet"}
          </h1>
          <Button asChild size="sm">
            <a href={openUrl} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" /> Open in Google Drive
            </a>
          </Button>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
          <iframe
            src={previewUrl}
            title={title || "Chord sheet PDF"}
            className="h-[65vh] w-full sm:h-[75vh]"
            allow="autoplay"
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          If the sheet doesn&apos;t load above, use &ldquo;Open in Google Drive&rdquo; to view or
          download the PDF.
        </p>
      </main>
    </div>
  );
}