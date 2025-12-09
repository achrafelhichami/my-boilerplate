"use client";

import type { MagicLinkFormValues } from "@/lib/validations/auth";
import { authClient } from "../auth/auth-client";

export async function sendMagicLink(data: MagicLinkFormValues) {
  const result = await authClient.signIn.magicLink({
    email: data.email,
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to send magic link");
  }

  return result.data;
}

export async function loginWithGoogle() {
  const result = await authClient.signIn.social({
    provider: "google",
  });

  if (result.error) {
    throw new Error(result.error.message || "Failed to sign in with Google");
  }

  return result.data;
}

export async function logout() {
  const result = await authClient.signOut();

  if (result.error) {
    throw new Error(result.error.message || "Failed to sign out");
  }

  return result.data;
}
