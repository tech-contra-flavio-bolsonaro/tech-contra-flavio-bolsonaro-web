import type { ReactNode } from "react";

/** Presentational content only: the native parent owns focus, events and hit testing. */
export function PressSurface({ children }: { children: ReactNode }) {
  return <span data-press-content="">{children}</span>;
}
