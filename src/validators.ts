import { VALID_SUBJECTS, MIN_EMOJI_COUNT, MAX_EMOJI_COUNT } from './constants';
import { InvalidArgumentError } from 'commander';

export function validateSubject(value: string): string {
  const normalized = value.toLowerCase().trim();

  if (!VALID_SUBJECTS.includes(normalized as any)) {
    throw new InvalidArgumentError(
      `Invalid subject "${value}". Must be one of: ${VALID_SUBJECTS.join(', ')}`
    );
  }

  return normalized;
}

export function validateEmojiCount(value: string): number {
  const trimmed = value.trim();
  const num = parseInt(trimmed, 10);

  if (isNaN(num)) {
    throw new InvalidArgumentError(
      `Emoji count must be a number, got "${value}"`
    );
  }

  if (num < MIN_EMOJI_COUNT || num > MAX_EMOJI_COUNT) {
    throw new InvalidArgumentError(
      `Emoji count must be between ${MIN_EMOJI_COUNT} and ${MAX_EMOJI_COUNT}, got ${num}`
    );
  }

  return num;
}
