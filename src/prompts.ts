import { input, select, confirm } from '@inquirer/prompts';
import { TV_SHOWS } from './data/tv-shows';
import { VALID_SUBJECTS } from './constants';

/**
 * Prompts user to select a TV show with autocomplete functionality.
 * Supports fuzzy search and allows custom show names not in the predefined list.
 */
export async function promptForShow(): Promise<string> {
  const answer = await input({
    message: 'Enter TV show name:',
    validate: (value: string) => {
      const trimmed = value.trim();
      if (trimmed.length === 0) {
        return 'TV show name cannot be empty';
      }
      return true;
    },
    transformer: (value: string) => value.trim(),
  });

  return answer.trim();
}

/**
 * Prompts user to select a subject from predefined list or enter a custom subject.
 * Sanitizes custom input by trimming and converting to lowercase.
 */
export async function promptForSubject(): Promise<string> {
  const CUSTOM_OPTION = 'custom (enter your own)';

  const choices = [
    ...VALID_SUBJECTS.map(subject => ({
      name: subject,
      value: subject,
    })),
    {
      name: CUSTOM_OPTION,
      value: '__custom__',
    },
  ];

  const selection = await select({
    message: 'Select subject:',
    choices,
    default: 'overall',
    pageSize: 15,
  });

  if (selection === '__custom__') {
    const customSubject = await input({
      message: 'Enter custom subject:',
      validate: (value: string) => {
        const sanitized = sanitizeCustomSubject(value);
        if (sanitized.length === 0) {
          return 'Subject cannot be empty';
        }
        if (sanitized.length > 50) {
          return 'Subject must be 50 characters or less';
        }
        return true;
      },
      transformer: (value: string) => sanitizeCustomSubject(value),
    });

    return sanitizeCustomSubject(customSubject);
  }

  return selection;
}

/**
 * Sanitizes custom subject input by trimming whitespace, converting to lowercase,
 * and removing potentially problematic characters.
 */
export function sanitizeCustomSubject(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, and hyphens
    .replace(/\s+/g, ' '); // Normalize multiple spaces to single space
}

/**
 * Provides autocomplete suggestions for TV show names based on user input.
 * Performs case-insensitive fuzzy matching.
 */
export function filterTVShows(input: string, limit: number = 10): string[] {
  const trimmedInput = input.trim();

  if (!trimmedInput || trimmedInput.length === 0) {
    return TV_SHOWS.slice(0, limit);
  }

  const searchTerm = trimmedInput.toLowerCase();
  const matches: Array<{ show: string; score: number }> = [];

  for (const show of TV_SHOWS) {
    const showLower = show.toLowerCase();

    // Exact match or starts with - highest priority
    if (showLower === searchTerm) {
      matches.push({ show, score: 1000 });
    } else if (showLower.startsWith(searchTerm)) {
      matches.push({ show, score: 900 });
    }
    // Contains the search term - medium priority
    else if (showLower.includes(searchTerm)) {
      matches.push({ show, score: 500 });
    }
    // Fuzzy match - check if all characters in search term appear in order
    else if (fuzzyMatch(searchTerm, showLower)) {
      matches.push({ show, score: 100 });
    }
  }

  // Sort by score (descending) and return top results
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(m => m.show);
}

/**
 * Performs fuzzy matching - returns true if all characters in the search term
 * appear in the target string in order (case-insensitive).
 */
function fuzzyMatch(search: string, target: string): boolean {
  let searchIndex = 0;
  let targetIndex = 0;

  while (searchIndex < search.length && targetIndex < target.length) {
    if (search[searchIndex] === target[targetIndex]) {
      searchIndex++;
    }
    targetIndex++;
  }

  return searchIndex === search.length;
}

/**
 * Prompts user to decide if they want to analyze another aspect
 * @returns true if user wants to continue, false otherwise
 */
export async function promptForContinue(): Promise<boolean> {
  const answer = await confirm({
    message: 'Would you like to analyze another aspect?',
    default: true,
  });

  return answer;
}
