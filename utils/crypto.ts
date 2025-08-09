// utils/crypto.ts

export function encodePasswordBase64 (password: string): string {
  return typeof window !== 'undefined'
    ? btoa(password)
    : Buffer.from(password, 'utf-8').toString('base64')
}

export function decodePasswordBase64 (encoded: string): string {
  return typeof window !== 'undefined'
    ? atob(encoded)
    : Buffer.from(encoded, 'base64').toString('utf-8')
}
