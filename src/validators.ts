import { VALID_SUBJECTS, MIN_EMOJI_COUNT, MAX_EMOJI_COUNT } from './constants';
import { TV_SHOWS } from './data/tv-shows';
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

export function validateTVShow(value: string): string {
  const trimmed = value.trim();

  // Case-insensitive search for the show in the list
  const matchedShow = TV_SHOWS.find(
    show => show.toLowerCase() === trimmed.toLowerCase()
  );

  if (!matchedShow) {
    // Find similar shows to provide helpful suggestions
    const similarShows = TV_SHOWS.filter(show =>
      show.toLowerCase().includes(trimmed.toLowerCase())
    ).slice(0, 5);

    let errorMessage = `TV show "${value}" is not in the predefined list.`;

    if (similarShows.length > 0) {
      errorMessage += `\n\nDid you mean one of these?\n  ${similarShows.join('\n  ')}`;
    } else {
      errorMessage += `\n\nRun with --help to see how to list available shows.`;
    }

    throw new InvalidArgumentError(errorMessage);
  }

  // Return the correctly cased show name from the list
  return matchedShow;
}
