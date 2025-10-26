import { describe, test, expect } from 'bun:test';
import { TV_SHOWS } from './tv-shows';

describe('TV_SHOWS', () => {
  test('contains at least 100 shows', () => {
    expect(TV_SHOWS.length).toBeGreaterThanOrEqual(100);
  });

  test('contains at most 200 shows', () => {
    expect(TV_SHOWS.length).toBeLessThanOrEqual(200);
  });

  test('all entries are non-empty strings', () => {
    TV_SHOWS.forEach(show => {
      expect(typeof show).toBe('string');
      expect(show.trim().length).toBeGreaterThan(0);
    });
  });

  test('contains no duplicate entries', () => {
    const uniqueShows = new Set(TV_SHOWS);
    expect(uniqueShows.size).toBe(TV_SHOWS.length);
  });

  test('entries are properly formatted (no leading/trailing whitespace)', () => {
    TV_SHOWS.forEach(show => {
      expect(show).toBe(show.trim());
    });
  });

  test('is sorted alphabetically', () => {
    const sorted = [...TV_SHOWS].sort((a, b) =>
      a.toLowerCase().localeCompare(b.toLowerCase())
    );

    // Compare each show with sorted version
    TV_SHOWS.forEach((show, index) => {
      expect(show).toBe(sorted[index]);
    });
  });

  test('contains some well-known shows', () => {
    const wellKnownShows = [
      'Breaking Bad',
      'Game of Thrones',
      'The Wire',
      'Friends',
      'The Sopranos'
    ];

    wellKnownShows.forEach(show => {
      expect(TV_SHOWS).toContain(show);
    });
  });
});
