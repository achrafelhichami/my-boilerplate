export function getMagicLinkEmail(url: string) {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #333;">Sign in to your account</h1>
      <p style="color: #666; font-size: 16px;">Click the button below to sign in to your account. This link will expire in 10 minutes.</p>
      <a href="${url}" style="display: inline-block; background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">Sign In</a>
      <p style="color: #999; font-size: 14px; margin-top: 24px;">If you didn't request this email, you can safely ignore it.</p>
    </div>
  `;
}
