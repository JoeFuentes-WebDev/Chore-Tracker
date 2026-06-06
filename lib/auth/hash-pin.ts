import bcrypt from "bcryptjs";

const PIN_SALT_ROUNDS = 10;
const PIN_PATTERN = /^\d{4}$/;

export function isValidPin(pin: string): boolean {
  return PIN_PATTERN.test(pin);
}

export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, PIN_SALT_ROUNDS);
}
