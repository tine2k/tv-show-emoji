import { describe, test, expect } from 'bun:test';
import { formatEmojiResults, formatError } from './output-formatter';
import type { EmojiResult } from './response-parser';

describe('formatEmojiResults', () => {
  const sampleResults: EmojiResult[] = [
    { emoji: '💀', explanation: 'Death and mortality are central themes.' },
    { emoji: '🔬', explanation: 'Chemistry is both literal and metaphorical.' },
    { emoji: '⚗️', explanation: 'The lab represents the criminal descent.' },
  ];

  test('formats results in interactive mode', () => {
    const output = formatEmojiResults(sampleResults, {
      tvShow: 'Breaking Bad',
      subject: 'overall',
      emojiCount: 3,
      interactive: true,
    });

    expect(output).toContain('Emoji Suggestions');
    expect(output).toContain('💀');
    expect(output).toContain('🔬');
    expect(output).toContain('⚗️');
    expect(output).toContain('Death and mortality');
    expect(output).toContain('Chemistry');
    expect(output).toContain('Breaking Bad');
    expect(output).toContain('overall');
  });

  test('formats results in non-interactive mode', () => {
    const output = formatEmojiResults(sampleResults, {
      tvShow: 'Breaking Bad',
      subject: 'character',
      emojiCount: 3,
      interactive: false,
    });

    expect(output).toContain('💀');
    expect(output).toContain('🔬');
    expect(output).toContain('⚗️');
    expect(output).toContain('Death and mortality');
    // Should not have the fancy header in non-interactive mode
    expect(output).not.toContain('Emoji Suggestions');
  });

  test('includes numbering for results', () => {
    const output = formatEmojiResults(sampleResults, {
      tvShow: 'Breaking Bad',
      subject: 'plot',
      emojiCount: 3,
      interactive: false,
    });

    expect(output).toContain('1.');
    expect(output).toContain('2.');
    expect(output).toContain('3.');
  });

  test('formats single emoji result', () => {
    const singleResult: EmojiResult[] = [
      { emoji: '💔', explanation: 'Heartbreak defines the narrative.' },
    ];

    const output = formatEmojiResults(singleResult, {
      tvShow: 'The Crown',
      subject: 'emotion',
      emojiCount: 1,
      interactive: true,
    });

    expect(output).toContain('💔');
    expect(output).toContain('Heartbreak');
    expect(output).toContain('1 emoji');
    expect(output).not.toContain('emojis'); // singular form
  });

  test('formats maximum number of emojis (30)', () => {
    const manyResults: EmojiResult[] = Array.from({ length: 30 }, (_, i) => ({
      emoji: String.fromCodePoint(0x1F600 + i),
      explanation: `Explanation ${i + 1} for this emoji.`,
    }));

    const output = formatEmojiResults(manyResults, {
      tvShow: 'Test Show',
      subject: 'overall',
      emojiCount: 30,
      interactive: true,
    });

    expect(output).toContain('1.');
    expect(output).toContain('30.');
    expect(output).toContain('30 emojis');
  });

  test('handles special characters in TV show name', () => {
    const output = formatEmojiResults(sampleResults, {
      tvShow: 'It\'s Always Sunny in Philadelphia',
      subject: 'character',
      emojiCount: 3,
      interactive: true,
    });

    expect(output).toContain('It\'s Always Sunny in Philadelphia');
  });

  test('formats explanations correctly', () => {
    const resultsWithPunctuation: EmojiResult[] = [
      { emoji: '🎭', explanation: 'Theater, performance, and drama define the show!' },
      { emoji: '🎬', explanation: 'Cinema and filmmaking are central themes.' },
    ];

    const output = formatEmojiResults(resultsWithPunctuation, {
      tvShow: 'The Show',
      subject: 'theme',
      emojiCount: 2,
      interactive: false,
    });

    expect(output).toContain('Theater, performance, and drama define the show!');
    expect(output).toContain('Cinema and filmmaking are central themes.');
  });

  test('output contains line breaks for readability', () => {
    const output = formatEmojiResults(sampleResults, {
      tvShow: 'Breaking Bad',
      subject: 'overall',
      emojiCount: 3,
      interactive: true,
    });

    // Should have multiple lines
    const lines = output.split('\n');
    expect(lines.length).toBeGreaterThan(3);
  });

  test('handles empty results array', () => {
    const output = formatEmojiResults([], {
      tvShow: 'Test Show',
      subject: 'overall',
      emojiCount: 0,
      interactive: true,
    });

    // Should not crash, should produce some output
    expect(output).toBeDefined();
    expect(typeof output).toBe('string');
  });

  test('displays all subjects correctly', () => {
    const subjects = ['character', 'plot', 'theme', 'mood', 'setting'];

    subjects.forEach(subject => {
      const output = formatEmojiResults(sampleResults, {
        tvShow: 'Test Show',
        subject,
        emojiCount: 3,
        interactive: true,
      });

      expect(output).toContain(subject);
    });
  });

  test('includes footer in interactive mode', () => {
    const output = formatEmojiResults(sampleResults, {
      tvShow: 'Breaking Bad',
      subject: 'overall',
      emojiCount: 3,
      interactive: true,
    });

    expect(output).toContain('Generated');
    expect(output).toContain('Breaking Bad');
    expect(output).toContain('overall');
  });

  test('does not include footer in non-interactive mode', () => {
    const output = formatEmojiResults(sampleResults, {
      tvShow: 'Breaking Bad',
      subject: 'overall',
      emojiCount: 3,
      interactive: false,
    });

    expect(output).not.toContain('Generated');
  });
});

describe('formatError', () => {
  test('formats basic error message', () => {
    const error = new Error('Something went wrong');
    const output = formatError(error);

    expect(output).toContain('Error');
    expect(output).toContain('Something went wrong');
  });

  test('formats error with special characters', () => {
    const error = new Error('Failed to parse: "Breaking Bad" - invalid format');
    const output = formatError(error);

    expect(output).toContain('Failed to parse');
    expect(output).toContain('"Breaking Bad"');
  });

  test('includes error marker', () => {
    const error = new Error('Test error');
    const output = formatError(error);

    expect(output).toContain('✗');
  });

  test('handles empty error message', () => {
    const error = new Error('');
    const output = formatError(error);

    expect(output).toBeDefined();
    expect(typeof output).toBe('string');
  });

  test('handles error with multiline message', () => {
    const error = new Error('Line 1\nLine 2\nLine 3');
    const output = formatError(error);

    expect(output).toContain('Line 1');
    expect(output).toContain('Line 2');
    expect(output).toContain('Line 3');
  });
});
