export type PublishedTool = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  credit: string;
  url: string;
  priority: number;
};

export type ToolCategory = { name: string; count: number };

export function httpsUrl(value: string): URL | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password ? url : null;
  } catch {
    return null;
  }
}
