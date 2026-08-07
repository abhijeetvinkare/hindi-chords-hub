import { createServerFn } from "@tanstack/react-start";
import { categoryFromFolderName } from "./drive.server";

export type Song = {
  id: string;
  title: string;
  modifiedTime: string;
  category: string;
  folder: string;
};

export type SongsResult = { songs: Song[]; configured: boolean; categories: string[] };

export const listSongs = createServerFn({ method: "GET" }).handler(
  async (): Promise<SongsResult> => {
    const rootFolderId = "1kWgKH7SuXZFMHV0JBfd4A3WePtpPWfZO";
    const apiKey = process.env["GOOGLE_API_KEY"] ?? process.env["GOOGLE_DRIVE_API_KEY"];
    if (!apiKey) return { songs: [], configured: false, categories: [] };

    const songs: Song[] = [];
    const categories = new Set<string>();
    const seen = new Set<string>();

    type Entry = { id: string; name: string; category: string; folderName: string };
    const queue: Entry[] = [
      { id: rootFolderId, name: "root", category: "Uncategorized", folderName: "" },
    ];

    while (queue.length > 0) {
      const current = queue.shift()!;
      if (seen.has(current.id)) continue;
      seen.add(current.id);

      let pageToken: string | undefined;
      do {
        const params = new URLSearchParams({
          q: `'${current.id}' in parents and trashed=false`,
          fields: "nextPageToken, files(id,name,mimeType,modifiedTime)",
          orderBy: "folder,name",
          pageSize: "200",
          key: apiKey,
        });
        if (pageToken) params.set("pageToken", pageToken);

        const res = await fetch(`https://www.googleapis.com/drive/v3/files?${params.toString()}`);
        if (!res.ok) {
          const body = await res.text();
          console.error(`Drive API failed [${res.status}]: ${body}`);
          throw new Error(`Google Drive request failed [${res.status}]`);
        }
        const data = (await res.json()) as {
          nextPageToken?: string;
          files?: { id: string; name: string; mimeType: string; modifiedTime?: string }[];
        };

        for (const f of data.files ?? []) {
          if (f.mimeType === "application/vnd.google-apps.folder") {
            const category =
              current.id === rootFolderId ? categoryFromFolderName(f.name) : current.category;
            queue.push({ id: f.id, name: f.name, category, folderName: f.name });
            categories.add(category);
          } else if (f.mimeType === "application/pdf" || /\.pdf$/i.test(f.name)) {
            songs.push({
              id: f.id,
              title: f.name.replace(/\.pdf$/i, ""),
              modifiedTime: f.modifiedTime ?? "",
              category: current.category,
              folder: current.folderName,
            });
          }
        }
        pageToken = data.nextPageToken;
      } while (pageToken);
    }

    songs.sort((a, b) => a.title.localeCompare(b.title));
    return { songs, configured: true, categories: [...categories].sort() };
  },
);