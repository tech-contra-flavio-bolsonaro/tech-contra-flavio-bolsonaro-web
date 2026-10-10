import styles from "./listing.module.css";

export default function ListingLayout({ children }: { children: React.ReactNode }) {
  return <div className={`home-page ${styles.listing}`}>{children}</div>;
}
