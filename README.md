# Hindi Chord Harmony

Lovable Prompt: Hindi Worship Chords Website

Build a modern, minimal website called "Hindi Worship Chords" for browsing and viewing Hindi Christian worship song chord sheets stored as PDFs in a Google Drive folder.

Data Source

The song PDFs live in this public Google Drive folder (shared as "Anyone with the link can view"): https://drive.google.com/drive/folders/1kWgKH7SuXZFMHV0JBfd4A3WePtpPWfZO?usp=sharing

Integrate live with the Google Drive API (Drive API v3, using an API key, since the folder is public) to fetch the list of PDF files from this folder at runtime — do not hardcode the song list, since new PDFs will be added to the folder over time.

Use each PDF's filename (without the .pdf extension) as the song title.

Poll/fetch the folder listing on page load (and provide a manual refresh button) so newly added songs appear without a code change.

Core Features

Song Library Page (Home)

Grid or list view of all songs pulled live from the Drive folder.

Each song card shows the song title (derived from filename).

Search bar at the top that filters songs by title in real time as the user types.

Category filter alongside search, using these fixed categories: Worship, Praise, Christmas, Easter, Hindi Hymns. Since categories aren't stored in Drive metadata, add a lightweight local tagging system (e.g. stored in the app's local state/localStorage) that lets an admin-like view assign a category to each song title; default/unassigned songs show under an "Uncategorized" tab until tagged.

An "All" tab/filter that shows every song regardless of category.

Song Detail / Viewer

Clicking a song opens a detail view showing:

The song title as a heading.

An embedded PDF viewer (inline, using an iframe or PDF.js-based viewer) pointing to the Drive file's preview URL so users can read the chords directly on the page.

A prominent "Open in Google Drive" / "Download PDF" button that opens the file's direct Drive link in a new tab, as a fallback in case the embedded viewer doesn't load.

Navigation

Simple top navbar with the site name "Hindi Worship Chords" and a search icon/bar.

Sidebar or horizontal tab bar for category filters.

Design Direction

Modern, minimal aesthetic: clean typography, generous white space, subtle borders/shadows instead of heavy decoration.

Full dark mode support with a toggle in the navbar; default to system preference.

Responsive design that works well on mobile (single column song list) and desktop (grid layout).

Use a neutral base palette (whites, grays, near-black) with a single accent color for buttons/links/active states.

Song cards should feel like a clean music/chords app — think a minimal Spotify-playlist-like list rather than a churchy or ornate look.

Technical Notes

Handle loading and error states gracefully (e.g. "Loading songs..." spinner, and a friendly error message if the Drive API call fails).

Handle an empty state if a category has no songs yet.

Keep the Google Drive API key configurable (as an environment variable) rather than hardcoded in the UI.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/75dd8b3b-09be-4dda-a4c5-c7f3440b567b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
