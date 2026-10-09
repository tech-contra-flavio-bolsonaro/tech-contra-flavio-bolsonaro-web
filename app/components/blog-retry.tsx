"use client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
export function BlogRetry() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
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
