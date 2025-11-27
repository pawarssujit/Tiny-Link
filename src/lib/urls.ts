const ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function isValidUrl(value: string) {
  if (!value) return false;
  try {
    new URL(ensureProtocol(value));
    return true;
  } catch {
    return false;
  }
}

export function ensureProtocol(value: string) {
  if (!/^https?:\/\//i.test(value)) {
    return `https://${value}`;
  }
  return value;
}

export function normalizeUrl(value: string) {
  const withProtocol = ensureProtocol(value.trim());
  const url = new URL(withProtocol);
  url.hash = "";
  return url.toString();
}

export function generateShortCode(length = 6) {
  let result = "";
  for (let i = 0; i < length; i += 1) {
    const index = Math.floor(Math.random() * ALPHABET.length);
    result += ALPHABET[index];
  }
  return result;
}

export function isValidShortCode(slug: string) {
  if (!slug) return false;
  return /^[A-Za-z0-9]{6,8}$/.test(slug);
}

