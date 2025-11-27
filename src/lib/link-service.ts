import { Prisma } from "@prisma/client";

import prisma from "./prisma";
import {
  ensureProtocol,
  generateShortCode,
  isValidShortCode,
  isValidUrl,
  normalizeUrl,
} from "./urls";

type CreateLinkInput = {
  originalUrl: string;
  customCode?: string | null;
};

export class LinkError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.status = status;
  }
}

export async function listLinks(query?: string) {
  return prisma.link.findMany({
    where: query
      ? {
          OR: [
            {
              shortCode: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              originalUrl: {
                contains: query,
                mode: "insensitive",
              },
            },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
  });
}

export async function createLinkRecord({
  originalUrl,
  customCode,
}: CreateLinkInput) {
  const cleanedUrl = originalUrl.trim();
  if (!isValidUrl(cleanedUrl)) {
    throw new LinkError("Please provide a valid URL (https://example.com).");
  }

  let shortCode: string;

  if (customCode) {
    const normalizedCode = customCode.trim();
    if (!isValidShortCode(normalizedCode)) {
      throw new LinkError(
        "Custom codes must be 6-8 characters using only letters or numbers.",
      );
    }

    shortCode = normalizedCode;
    const exists = await prisma.link.findUnique({ where: { shortCode } });
    if (exists) {
      throw new LinkError("That short code already exists.", 409);
    }
  } else {
    shortCode = await generateUniqueShortCode();
  }

  const normalizedUrl = normalizeUrl(cleanedUrl);

  return prisma.link.create({
    data: {
      originalUrl: normalizedUrl,
      shortCode,
    },
  });
}

export async function deleteLinkRecord(shortCode: string) {
  if (!shortCode) {
    throw new LinkError("Missing short code.");
  }
  try {
    await prisma.link.delete({ where: { shortCode } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new LinkError("Short code not found.", 404);
    }
    throw error;
  }
}

export async function getLinkByShortCode(shortCode: string) {
  return prisma.link.findUnique({
    where: { shortCode },
  });
}

export async function getLinkSummary() {
  const aggregate = await prisma.link.aggregate({
    _count: { _all: true },
    _sum: { clickCount: true },
  });

  return {
    totalLinks: aggregate._count._all,
    totalClicks: aggregate._sum.clickCount ?? 0,
  };
}

export async function incrementClickCount(shortCode: string) {
  return prisma.link.update({
    where: { shortCode },
    data: {
      clickCount: { increment: 1 },
      lastClicked: new Date(),
    },
  });
}

async function generateUniqueShortCode(length = 6) {
  let collisionSafeCode = "";
  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    const candidate = generateShortCode(length);
    const exists = await prisma.link.findUnique({
      where: { shortCode: candidate },
    });

    if (!exists) {
      collisionSafeCode = candidate;
      break;
    }

    attempts += 1;
  }

  if (!collisionSafeCode) {
    throw new LinkError("Unable to find a free short code. Please try again.");
  }

  return collisionSafeCode;
}

export function getDisplayUrl(shortCode: string) {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  return `${base.replace(/\/$/, "")}/${shortCode}`;
}

export function formatDisplayUrl(originalUrl: string) {
  try {
    return new URL(ensureProtocol(originalUrl)).hostname;
  } catch {
    return originalUrl;
  }
}

