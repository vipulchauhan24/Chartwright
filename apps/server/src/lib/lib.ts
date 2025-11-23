export function base64UrlEncode(str: string) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-') // URL-safe replacements
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // Remove padding
}
