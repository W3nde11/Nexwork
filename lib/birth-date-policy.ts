export const MINIMUM_SIGNUP_AGE = 16;

export function parseBirthDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  date.setHours(0, 0, 0, 0);

  const isValidDate =
    date.getFullYear() === Number(year) &&
    date.getMonth() === Number(month) - 1 &&
    date.getDate() === Number(day);

  return isValidDate ? date : null;
}

export function getLatestAllowedBirthDate(referenceDate = new Date()): Date {
  const date = new Date(referenceDate);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(date.getFullYear() - MINIMUM_SIGNUP_AGE);
  return date;
}

export function formatDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getLatestAllowedBirthDateInputValue(referenceDate = new Date()): string {
  return formatDateInputValue(getLatestAllowedBirthDate(referenceDate));
}

export function isOldEnoughForSignup(value: string, referenceDate = new Date()): boolean {
  const birthDate = parseBirthDate(value);
  if (!birthDate) return false;

  return birthDate <= getLatestAllowedBirthDate(referenceDate);
}
