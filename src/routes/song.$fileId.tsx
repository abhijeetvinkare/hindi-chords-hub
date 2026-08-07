import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

  // Google Drive's preview renders at a fixed desktop-ish width, so on narrow
  // screens we render the iframe at a virtual width and scale it down to fit.
  const VIRTUAL_WIDTH = 900;
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = width > 0 ? Math.min(1, width / VIRTUAL_WIDTH) : 1;
  const frameWidth = scale < 1 ? VIRTUAL_WIDTH : "100%";
  // Fixed viewer height reserved up-front so the Drive toolbar loading in
  // doesn't shift the page.
  const viewerHeight = "min(78vh, 900px)";

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

        <div
          ref={wrapRef}
          className="relative mt-6 w-full overflow-hidden rounded-xl border border-border bg-card"
          style={{ height: viewerHeight }}
        >
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-muted/40" aria-hidden="true" />
          )}
          <iframe
            src={previewUrl}
            title={title || "Chord sheet PDF"}
            allow="autoplay"
            onLoad={() => setLoaded(true)}
            style={{
              width: frameWidth,
              height: scale < 1 ? `calc(${viewerHeight} / ${scale})` : "100%",
              border: 0,
              transform: scale < 1 ? `scale(${scale})` : undefined,
              transformOrigin: "top left",
              display: "block",
            }}
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