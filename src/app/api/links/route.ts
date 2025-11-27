import { NextRequest, NextResponse } from "next/server";

import { LinkError, createLinkRecord, listLinks } from "@/lib/link-service";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q") ?? undefined;
  const links = await listLinks(query?.trim() ? query.trim() : undefined);
  return NextResponse.json({ links });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const originalUrl = String(body?.originalUrl ?? "");
    const customCode = body?.customCode
      ? String(body.customCode).trim() || undefined
      : undefined;

    if (!originalUrl) {
      return NextResponse.json(
        { error: "originalUrl is required." },
        { status: 400 },
      );
    }

    const link = await createLinkRecord({
      originalUrl,
      customCode,
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    if (error instanceof LinkError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    const message =
      error instanceof Error
        ? error.message
        : "Unable to create link. Please try again.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

