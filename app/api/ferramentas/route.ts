import { NextRequest, NextResponse } from "next/server";
import { listToolCategories, listTools } from "@/app/lib/tools-server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const page = Number(params.get("page") ?? "0");
  if (!Number.isSafeInteger(page) || page < 0 || page > 10000) {
    return NextResponse.json({ error: "Página inválida." }, { status: 400 });
  }
  const category = params.get("categoria")?.trim() || undefined;
  if (category && category.length > 60) {
    return NextResponse.json({ error: "Categoria inválida." }, { status: 400 });
  }
  try {
    const [result, categories] = await Promise.all([listTools(page, category), page === 0 ? listToolCategories() : undefined]);
    return NextResponse.json({ ...result, ...(categories ? { categories } : {}) }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar ferramentas." }, { status: 500 });
  }
}
