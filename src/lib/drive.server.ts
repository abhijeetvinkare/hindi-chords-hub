const BASE_CATEGORIES = ["Worship", "Praise", "Christmas", "Easter", "Hindi Hymns"] as const;

/** Map a Drive subfolder name onto an existing category, or keep it as a new one. */
export function categoryFromFolderName(folderName: string): string {
  const name = folderName.trim();
  const lower = name.toLowerCase();
  for (const c of BASE_CATEGORIES) {
    if (lower.includes(c.toLowerCase())) return c;
  }
  if (lower.includes("hymn")) return "Hindi Hymns";
  return name
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());
}