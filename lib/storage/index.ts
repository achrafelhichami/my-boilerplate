import {
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "./client";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

const ALLOWED_FILE_TYPES = [
  ...ALLOWED_IMAGE_TYPES,
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadOptions {
  folder?: string;
  isPublic?: boolean;
  maxSize?: number;
  allowedTypes?: string[];
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  contentType: string;
}

function generateUniqueKey(filename: string, folder?: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const key = `${timestamp}-${randomString}-${sanitizedFilename}`;
  return folder ? `${folder}/${key}` : key;
}

function validateFile(
  file: File | Buffer,
  contentType: string,
  options: UploadOptions = {}
): void {
  const { maxSize = MAX_FILE_SIZE, allowedTypes = ALLOWED_FILE_TYPES } =
    options;

  const size = file instanceof File ? file.size : file.length;

  if (size > maxSize) {
    throw new Error(
      `File size exceeds maximum allowed size of ${maxSize / 1024 / 1024}MB`
    );
  }

  if (!allowedTypes.includes(contentType)) {
    throw new Error(`File type ${contentType} is not allowed`);
  }
}

export async function uploadFile(
  file: File | Buffer,
  filename: string,
  contentType: string,
  options: UploadOptions = {}
): Promise<UploadResult> {
  validateFile(file, contentType, options);

  const key = generateUniqueKey(filename, options.folder);
  const body =
    file instanceof File ? Buffer.from(await file.arrayBuffer()) : file;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
    CacheControl: "public, max-age=31536000",
  });

  await r2Client.send(command);

  const url =
    options.isPublic && R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/${key}`
      : await getSignedDownloadUrl(key);

  return {
    key,
    url,
    size: body.length,
    contentType,
  };
}

export async function uploadImage(
  file: File | Buffer,
  filename: string,
  contentType: string,
  options: Omit<UploadOptions, "allowedTypes" | "maxSize"> = {}
): Promise<UploadResult> {
  return uploadFile(file, filename, contentType, {
    ...options,
    folder: options.folder || "images",
    allowedTypes: ALLOWED_IMAGE_TYPES,
    maxSize: MAX_IMAGE_SIZE,
  });
}

export async function getSignedDownloadUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

export async function getSignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  await r2Client.send(command);
}

export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    await r2Client.send(command);
    return true;
  } catch {
    return false;
  }
}

export async function getFileMetadata(key: string) {
  const command = new HeadObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  const response = await r2Client.send(command);

  return {
    key,
    size: response.ContentLength,
    contentType: response.ContentType,
    lastModified: response.LastModified,
    etag: response.ETag,
  };
}

export {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
};
