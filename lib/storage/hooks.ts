"use client";

import { useState } from "react";
import {
  uploadFile as uploadFileAction,
  uploadImage as uploadImageAction,
  getFileUrl as getFileUrlAction,
  deleteFile as deleteFileAction,
} from "@/lib/actions/storage";

interface UploadOptions {
  type?: "file" | "image";
  folder?: string;
  isPublic?: boolean;
}

interface UploadResult {
  key: string;
  url: string;
  size?: number;
  contentType?: string;
}

interface UseUploadReturn {
  upload: (file: File, options?: UploadOptions) => Promise<UploadResult>;
  isUploading: boolean;
  error: string | null;
  reset: () => void;
}

export function useUpload(): UseUploadReturn {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setIsUploading(false);
    setError(null);
  };

  const upload = async (
    file: File,
    options: UploadOptions = {}
  ): Promise<UploadResult> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (options.folder) formData.append("folder", options.folder);
      if (options.isPublic) formData.append("isPublic", "true");

      const uploadAction =
        options.type === "image" ? uploadImageAction : uploadFileAction;
      const result = await uploadAction(formData);

      if (!result.success) {
        throw new Error(result.error);
      }

      return result.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading, error, reset };
}

export async function getFileUrl(key: string): Promise<string> {
  const result = await getFileUrlAction(key);

  if (!result.success) {
    throw new Error(result.error);
  }

  return result.data.url;
}

export async function deleteFile(key: string): Promise<void> {
  const result = await deleteFileAction(key);

  if (!result.success) {
    throw new Error(result.error);
  }
}
