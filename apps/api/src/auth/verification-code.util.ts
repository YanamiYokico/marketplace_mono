import { randomInt } from 'crypto';

export function generateVerificationCode(): string {
  return randomInt(100000, 1_000_000).toString();
}
