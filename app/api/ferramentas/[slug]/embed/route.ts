import { NextResponse } from "next/server";
import { findToolEmbed } from "@/app/lib/tools-server";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const embedUrl = await findToolEmbed((await params).slug);
    return NextResponse.json({ embedUrl }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Não foi possível abrir a ferramenta aqui." }, { status: 503 });
  }
}
