import { NextResponse } from "next/server";

const startedAt = Date.now();

export async function GET() {
  return NextResponse.json({
    ok: true,
    version: "1.0",
    uptimeMs: Date.now() - startedAt,
    timestamp: new Date().toISOString(),
  });
}

