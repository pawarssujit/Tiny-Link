import { NextRequest, NextResponse } from "next/server";

import { getLinkByShortCode, incrementClickCount } from "@/lib/link-service";

type RouteContext = {
  params: Promise<{ shortCode: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { shortCode } = await context.params;
  const link = await getLinkByShortCode(shortCode);

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  await incrementClickCount(shortCode);
  return NextResponse.redirect(link.originalUrl, { status: 302 });
}

