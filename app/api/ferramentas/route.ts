import { NextRequest, NextResponse } from "next/server";
import { listTools } from "@/app/lib/tools-server";

export async function GET(request: NextRequest) {
  const page = Number(request.nextUrl.searchParams.get("page") ?? "0");
  if (!Number.isSafeInteger(page) || page < 0 || page > 10000) {
    return NextResponse.json({ error: "Página inválida." }, { status: 400 });
  }
  try {
    return NextResponse.json(await listTools(page), { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Não foi possível carregar ferramentas." }, { status: 500 });
  }
}
