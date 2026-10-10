import { listTools } from "@/app/lib/tools-server";
import { ToolFeed, type InitialTools } from "./tool-feed";

// Server-rendered so the home links to tools without JavaScript (issue #102).
// A database failure falls back to the browser fetch the feed already does.
export async function HomeTools() {
  const initial: InitialTools | undefined = await listTools(0).then(
    ({ items, hasMore }) => ({ items, hasMore, category: null }),
    (error) => {
      console.error("home: falha ao listar ferramentas", error);
      return undefined;
    },
  );
  return <ToolFeed limit={3} variant="home" initial={initial} />;
}
