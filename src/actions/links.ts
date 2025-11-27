"use server";

import { revalidatePath } from "next/cache";

import { LinkError, createLinkRecord, deleteLinkRecord } from "@/lib/link-service";

export type LinkActionState = {
  error?: string;
  success?: string;
  shortUrl?: string;
};

export async function createLink(
  _prevState: LinkActionState | undefined,
  formData: FormData,
) {
  try {
    const originalUrl = String(formData.get("originalUrl") ?? "");
    const customCode = String(formData.get("customCode") ?? "").trim() || null;

    const link = await createLinkRecord({ originalUrl, customCode });

    revalidatePath("/");

    return {
      success: "Link created successfully.",
      shortUrl: link.shortCode,
    } satisfies LinkActionState;
  } catch (error) {
    if (error instanceof LinkError) {
      return { error: error.message };
    }
    if (error instanceof Error) {
      return { error: error.message || "Unable to create link. Please try again." };
    }
    return { error: "Unable to create link. Please try again." };
  }
}

export async function deleteLink(shortCode: string) {
  try {
    await deleteLinkRecord(shortCode);
    revalidatePath("/");
  } catch (error) {
    console.error(error);
  }
}

