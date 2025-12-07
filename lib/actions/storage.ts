"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  uploadFile as uploadFileToR2,
  uploadImage as uploadImageToR2,
  getSignedDownloadUrl,
  deleteFile as deleteFileFromR2,
  fileExists,
  getFileMetadata,
  ALLOWED_FILE_TYPES,
  ALLOWED_IMAGE_TYPES,
} from "@/lib/storage";

async function getAuthenticatedUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return session.user;
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

export async function uploadFile(
  formData: FormData
): Promise<{ success: true; data: UploadResult } | { success: false; error: string }> {
  try {
    await getAuthenticatedUser();

    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;
    const isPublic = formData.get("isPublic") === "true";

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return { success: false, error: `File type ${file.type} is not allowed` };
    }

    const result = await uploadFileToR2(file, file.name, file.type, {
      folder: folder || "files",
      isPublic,
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function uploadImage(
  formData: FormData
): Promise<{ success: true; data: UploadResult } | { success: false; error: string }> {
  try {
    await getAuthenticatedUser();

    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;
    const isPublic = formData.get("isPublic") === "true";

    if (!file) {
      return { success: false, error: "No file provided" };
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return { success: false, error: `File type ${file.type} is not allowed` };
    }

    const result = await uploadImageToR2(file, file.name, file.type, {
      folder: folder || "images",
      isPublic,
    });

    return { success: true, data: result };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

export async function getFileUrl(
  key: string
): Promise<{ success: true; data: { url: string; key: string } } | { success: false; error: string }> {
  try {
    await getAuthenticatedUser();

    const exists = await fileExists(key);
    if (!exists) {
      return { success: false, error: "File not found" };
    }

    const url = await getSignedDownloadUrl(key, 3600);

    return { success: true, data: { url, key } };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get file URL",
    };
  }
}

export async function deleteFile(
  key: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await getAuthenticatedUser();

    const exists = await fileExists(key);
    if (!exists) {
      return { success: false, error: "File not found" };
    }

    await deleteFileFromR2(key);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete file",
    };
  }
}

export async function getFileMeta(key: string) {
  try {
    await getAuthenticatedUser();

    const exists = await fileExists(key);
    if (!exists) {
      return { success: false, error: "File not found" };
    }

    const metadata = await getFileMetadata(key);

    return { success: true, data: metadata };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get file metadata",
    };
  }
}

