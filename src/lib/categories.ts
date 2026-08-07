import { useCallback, useEffect, useState } from "react";

export const CATEGORIES = ["Worship", "Praise", "Christmas", "Easter"] as const;
export type Category = (typeof CATEGORIES)[number];

const STORAGE_KEY = "hwc.categories.v1";

type Tags = Record<string, Category>;

function read(): Tags {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Tags) : {};
  } catch {
    return {};
  }
}

export function useCategoryTags() {
  const [tags, setTags] = useState<Tags>({});

  useEffect(() => {
    setTags(read());
  }, []);

  const setTag = useCallback((title: string, category: Category | null) => {
    setTags((prev) => {
      const next = { ...prev };
      if (category) next[title] = category;
      else delete next[title];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return { tags, setTag };
}