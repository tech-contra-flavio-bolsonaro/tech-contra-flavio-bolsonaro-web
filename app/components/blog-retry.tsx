"use client";
import { Button } from "@/components/ui/button";
import { HomeArrow } from "./home-arrow";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export function BlogRetry({ home = false }: { home?: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  if (home) return (
    <Button className="home-button home-button-yellow" size="lg" disabled={pending} onClick={() => startTransition(() => router.refresh())}>
      {pending ? "Tentando novamente…" : "Tentar novamente"}<HomeArrow />
    </Button>
  );
  return (
    <button
      className="blog-button"
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      {pending ? "Tentando novamente…" : "Tentar novamente"}
    </button>
  );
}
