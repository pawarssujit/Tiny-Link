import { NextResponse } from "next/server";

import {
  LinkError,
  deleteLinkRecord,
  getLinkByShortCode,
} from "@/lib/link-service";

type RouteContext = {
  params: Promise<{ code: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { code } = await context.params;
  const link = await getLinkByShortCode(code);

  if (!link) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 });
  }

  return NextResponse.json({ link });
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { code } = await context.params;
    await deleteLinkRecord(code);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof LinkError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      );
    }
    const message =
      error instanceof Error ? error.message : "Unable to delete link.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

