const defaultOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

function allowedOrigins(): Set<string> {
  const fromEnv = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return new Set([...defaultOrigins, ...fromEnv]);
}

/** CORS for browser forms: only allowlisted Origins (never reflect arbitrary). */
export function cors(request: Request) {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = {
    "Access-Control-Allow-Headers": "content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  };
  if (origin && allowedOrigins().has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}
