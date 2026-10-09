import { SiteNav } from "@/app/components/site-nav";
import styles from "./detail.module.css";

/** Shared only by the article and its local fallback states. */
export function DetailShell({ children }: { children: React.ReactNode }) {
  return <div className={`home-page ${styles.detail}`}><SiteNav variant="home" />{children}</div>;
}
