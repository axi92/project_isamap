import * as crypto from 'crypto';

export function hashString(string: string): string {
  return crypto.createHash('blake2b512').update(string).digest('hex');
}

export function verifyHash(
  stringUnhashed: string,
  hashedString: string,
): boolean {
  const inputHashed = hashString(stringUnhashed);
  try {
    return crypto.timingSafeEqual(
      Buffer.from(inputHashed, 'hex'),
      Buffer.from(hashedString, 'hex'),
    );
  } catch {
    return false;
  }
}
