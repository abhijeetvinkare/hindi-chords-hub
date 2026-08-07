import { createServerFn } from "@tanstack/react-start";

export type Song = {
  id: string;
  title: string;
  modifiedTime: string;
};

export type SongsResult = { songs: Song[]; configured: boolean };

export const listSongs = createServerFn({ method: "GET" }).handler(
  async (): Promise<SongsResult> => {
    const folderId = "1kWgKH7SuXZFMHV0JBfd4A3WePtpPWfZO";
    const apiKey = process.env["GOOGLE_DRIVE_API_KEY"];
    if (!apiKey) return { songs: [], configured: false };

    const songs: Song[] = [];
    let pageToken: string | undefined;

    do {
      const params = new URLSearchParams({
        q: `'${folderId}' in parents and mimeType='application/pdf' and trashed=false`,
        fields: "nextPageToken, files(id,name,modifiedTime)",
        orderBy: "name",
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
        files?: { id: string; name: string; modifiedTime?: string }[];
      };
      for (const f of data.files ?? []) {
        songs.push({
          id: f.id,
          title: f.name.replace(/\.pdf$/i, ""),
          modifiedTime: f.modifiedTime ?? "",
        });
      }
      pageToken = data.nextPageToken;
    } while (pageToken);

    return { songs, configured: true };
  },
);