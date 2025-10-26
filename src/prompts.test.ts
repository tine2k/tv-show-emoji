import { describe, test, expect } from 'bun:test';
import { sanitizeCustomSubject, filterTVShows } from './prompts';

describe('sanitizeCustomSubject', () => {
  test('trims whitespace', () => {
    expect(sanitizeCustomSubject('  test  ')).toBe('test');
    expect(sanitizeCustomSubject('\ttest\n')).toBe('test');
  });

  test('converts to lowercase', () => {
    expect(sanitizeCustomSubject('TEST')).toBe('test');
    expect(sanitizeCustomSubject('TeSt')).toBe('test');
  });

  test('removes special characters', () => {
    expect(sanitizeCustomSubject('test@#$%')).toBe('test');
    expect(sanitizeCustomSubject('hello!world?')).toBe('helloworld');
  });

  test('preserves hyphens', () => {
    expect(sanitizeCustomSubject('test-subject')).toBe('test-subject');
  });

  test('preserves spaces and normalizes multiple spaces', () => {
    expect(sanitizeCustomSubject('test   subject')).toBe('test subject');
    expect(sanitizeCustomSubject('test  multiple   spaces')).toBe('test multiple spaces');
  });

  test('handles empty input', () => {
    expect(sanitizeCustomSubject('')).toBe('');
    expect(sanitizeCustomSubject('   ')).toBe('');
  });

  test('combines all transformations', () => {
    expect(sanitizeCustomSubject('  Test@Subject#123  ')).toBe('testsubject123');
    expect(sanitizeCustomSubject('  My-Custom  Subject!  ')).toBe('my-custom subject');
  });
});

describe('filterTVShows', () => {
  test('returns default limit when input is empty', () => {
    const results = filterTVShows('');
    expect(results.length).toBeLessThanOrEqual(10);
  });

  test('returns custom limit when specified', () => {
    const results = filterTVShows('', 5);
    expect(results.length).toBe(5);
  });

  test('finds exact matches', () => {
    const results = filterTVShows('Friends');
    expect(results).toContain('Friends');
    expect(results[0]).toBe('Friends'); // Should be first due to exact match
  });

  test('finds shows starting with search term', () => {
    const results = filterTVShows('The');
    expect(results.length).toBeGreaterThan(0);
    results.forEach(show => {
      expect(show.toLowerCase().startsWith('the')).toBe(true);
    });
  });

  test('is case insensitive', () => {
    const lowerResults = filterTVShows('breaking');
    const upperResults = filterTVShows('BREAKING');
    expect(lowerResults).toEqual(upperResults);
  });

  test('finds shows containing search term', () => {
    const results = filterTVShows('bad');
    expect(results).toContain('Breaking Bad');
  });

  test('performs fuzzy matching', () => {
    // "bb" should match "Breaking Bad"
    const results = filterTVShows('bb');
    expect(results.some(show => show.includes('Breaking Bad') || show.includes('Bob\'s Burgers'))).toBe(true);
  });

  test('handles whitespace in search term', () => {
    const results = filterTVShows('  breaking  ');
    expect(results.length).toBeGreaterThan(0);
  });

  test('returns empty array when no matches found', () => {
    const results = filterTVShows('xyzabc123nonexistent');
    expect(results.length).toBe(0);
  });

  test('prioritizes exact matches over partial matches', () => {
    const results = filterTVShows('dark');
    const darkIndex = results.findIndex(show => show === 'Dark');
    if (darkIndex !== -1) {
      // If "Dark" is in results, it should be first
      expect(darkIndex).toBe(0);
    }
  });

  test('prioritizes starts-with over contains', () => {
    const results = filterTVShows('the office');
    // Shows starting with "The Office" should come before shows just containing those words
    const topResults = results.slice(0, 3);
    expect(topResults.some(show => show.startsWith('The Office'))).toBe(true);
  });
});
