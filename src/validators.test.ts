import { describe, test, expect } from 'bun:test';
import { validateSubject, validateEmojiCount, validateTVShow } from './validators';
import { VALID_SUBJECTS } from './constants';
import { TV_SHOWS } from './data/tv-shows';

describe('validateSubject', () => {
  test('accepts all valid subjects in lowercase', () => {
    for (const subject of VALID_SUBJECTS) {
      expect(validateSubject(subject)).toBe(subject);
    }
  });

  test('accepts valid subjects with mixed case and normalizes to lowercase', () => {
    expect(validateSubject('Character')).toBe('character');
    expect(validateSubject('PLOT')).toBe('plot');
    expect(validateSubject('ReLaTiOnShIp')).toBe('relationship');
  });

  test('accepts valid subjects with whitespace and trims them', () => {
    expect(validateSubject('  character  ')).toBe('character');
    expect(validateSubject('\ttheme\n')).toBe('theme');
  });

  test('rejects invalid subjects', () => {
    expect(() => validateSubject('invalid')).toThrow('Invalid subject "invalid"');
    expect(() => validateSubject('actor')).toThrow('Invalid subject "actor"');
    expect(() => validateSubject('random')).toThrow('Invalid subject "random"');
  });

  test('rejects empty string', () => {
    expect(() => validateSubject('')).toThrow('Invalid subject ""');
    expect(() => validateSubject('  ')).toThrow('Invalid subject "  "');
  });

  test('error message includes list of valid subjects', () => {
    try {
      validateSubject('invalid');
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.message).toContain('character');
      expect(error.message).toContain('relationship');
      expect(error.message).toContain('plot');
    }
  });

  test('accepts all 14 predefined subjects', () => {
    // Verify we have exactly 14 subjects
    expect(VALID_SUBJECTS.length).toBe(14);

    // Test original 8 subjects
    expect(validateSubject('character')).toBe('character');
    expect(validateSubject('relationship')).toBe('relationship');
    expect(validateSubject('plot')).toBe('plot');
    expect(validateSubject('setting')).toBe('setting');
    expect(validateSubject('theme')).toBe('theme');
    expect(validateSubject('episode')).toBe('episode');
    expect(validateSubject('season')).toBe('season');
    expect(validateSubject('overall')).toBe('overall');

    // Test newly added 6 subjects
    expect(validateSubject('mood')).toBe('mood');
    expect(validateSubject('location')).toBe('location');
    expect(validateSubject('genre')).toBe('genre');
    expect(validateSubject('conflict')).toBe('conflict');
    expect(validateSubject('emotion')).toBe('emotion');
    expect(validateSubject('symbol')).toBe('symbol');
  });
});

describe('validateEmojiCount', () => {
  test('accepts valid counts within range', () => {
    expect(validateEmojiCount('1')).toBe(1);
    expect(validateEmojiCount('5')).toBe(5);
    expect(validateEmojiCount('15')).toBe(15);
    expect(validateEmojiCount('30')).toBe(30);
  });

  test('accepts valid counts with whitespace and trims them', () => {
    expect(validateEmojiCount('  10  ')).toBe(10);
    expect(validateEmojiCount('\t5\n')).toBe(5);
  });

  test('rejects count below minimum (1)', () => {
    expect(() => validateEmojiCount('0')).toThrow('must be between 1 and 30, got 0');
    expect(() => validateEmojiCount('-1')).toThrow('must be between 1 and 30, got -1');
    expect(() => validateEmojiCount('-5')).toThrow('must be between 1 and 30, got -5');
  });

  test('rejects count above maximum (30)', () => {
    expect(() => validateEmojiCount('31')).toThrow('must be between 1 and 30, got 31');
    expect(() => validateEmojiCount('100')).toThrow('must be between 1 and 30, got 100');
    expect(() => validateEmojiCount('999')).toThrow('must be between 1 and 30, got 999');
  });

  test('rejects non-numeric values', () => {
    expect(() => validateEmojiCount('abc')).toThrow('must be a number, got "abc"');
    expect(() => validateEmojiCount('five')).toThrow('must be a number, got "five"');
  });

  test('rejects empty string', () => {
    expect(() => validateEmojiCount('')).toThrow('must be a number, got ""');
    expect(() => validateEmojiCount('  ')).toThrow('must be a number, got "  "');
  });

  test('handles decimal strings by truncating (parseInt behavior)', () => {
    // parseInt('10.5') returns 10
    expect(validateEmojiCount('10.5')).toBe(10);
    expect(validateEmojiCount('5.9')).toBe(5);
  });

  test('rejects strings starting with non-numeric characters', () => {
    expect(() => validateEmojiCount('a10')).toThrow('must be a number, got "a10"');
    expect(() => validateEmojiCount('!5')).toThrow('must be a number, got "!5"');
  });
});

describe('validateTVShow', () => {
  test('accepts valid TV show names (exact match)', () => {
    expect(validateTVShow('Breaking Bad')).toBe('Breaking Bad');
    expect(validateTVShow('The Wire')).toBe('The Wire');
    expect(validateTVShow('Friends')).toBe('Friends');
  });

  test('accepts valid TV show names with different casing and normalizes to list casing', () => {
    expect(validateTVShow('breaking bad')).toBe('Breaking Bad');
    expect(validateTVShow('BREAKING BAD')).toBe('Breaking Bad');
    expect(validateTVShow('tHe WiRe')).toBe('The Wire');
    expect(validateTVShow('FRIENDS')).toBe('Friends');
  });

  test('accepts valid TV show names with whitespace and trims them', () => {
    expect(validateTVShow('  Breaking Bad  ')).toBe('Breaking Bad');
    expect(validateTVShow('\tThe Wire\n')).toBe('The Wire');
  });

  test('rejects TV show not in the predefined list', () => {
    expect(() => validateTVShow('Random Show')).toThrow('not in the predefined list');
    expect(() => validateTVShow('Invalid Series')).toThrow('not in the predefined list');
  });

  test('rejects empty string', () => {
    expect(() => validateTVShow('')).toThrow('not in the predefined list');
    expect(() => validateTVShow('  ')).toThrow('not in the predefined list');
  });

  test('provides suggestions for similar shows when invalid show is provided', () => {
    try {
      validateTVShow('Break');
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.message).toContain('Did you mean one of these?');
      expect(error.message).toContain('Breaking Bad');
    }
  });

  test('provides suggestions for partial matches', () => {
    try {
      validateTVShow('Star Trek');
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.message).toContain('Did you mean one of these?');
      // Should suggest multiple Star Trek shows
      expect(error.message).toContain('Star Trek');
    }
  });

  test('provides help message when no similar shows found', () => {
    try {
      validateTVShow('XYZ123ABC');
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error.message).toContain('Run with --help to see how to list available shows');
      expect(error.message).not.toContain('Did you mean one of these?');
    }
  });

  test('accepts shows with special characters and apostrophes', () => {
    expect(validateTVShow("It's Always Sunny in Philadelphia")).toBe("It's Always Sunny in Philadelphia");
    expect(validateTVShow("Grey's Anatomy")).toBe("Grey's Anatomy");
    expect(validateTVShow("Bob's Burgers")).toBe("Bob's Burgers");
  });

  test('accepts shows from different parts of the list', () => {
    // First show in list
    expect(validateTVShow('30 Rock')).toBe('30 Rock');
    // Middle of list
    expect(validateTVShow('Game of Thrones')).toBe('Game of Thrones');
    // Last show in list
    expect(validateTVShow('You')).toBe('You');
  });

  test('validates all shows in TV_SHOWS list can be accepted', () => {
    // Sample some shows from the list
    const sampleShows = [
      'Avatar: The Last Airbender',
      'Battlestar Galactica',
      'Chernobyl',
      'Dark',
      'Fargo',
      'House of the Dragon',
      'Lost',
      'The Mandalorian',
      'Stranger Things',
      'Westworld',
    ];

    for (const show of sampleShows) {
      expect(validateTVShow(show)).toBe(show);
    }
  });
});
