import { describe, test, expect } from 'bun:test';
import { validateSubject, validateEmojiCount } from '../validators';
import { VALID_SUBJECTS } from '../constants';

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
