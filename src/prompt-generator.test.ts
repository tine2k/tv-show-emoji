import { describe, test, expect } from 'bun:test';
import { generatePrompt } from './prompt-generator';
import { VALID_SUBJECTS } from './constants';

describe('generatePrompt', () => {
  test('generates prompt with correct TV show name', () => {
    const prompt = generatePrompt({
      tvShow: 'Breaking Bad',
      subject: 'character',
      emojiCount: 3,
    });

    expect(prompt).toContain('"Breaking Bad"');
  });

  test('generates prompt with correct emoji count', () => {
    const prompt = generatePrompt({
      tvShow: 'The Wire',
      subject: 'plot',
      emojiCount: 5,
    });

    expect(prompt).toContain('5 emojis');
    expect(prompt).toContain('exactly 5 emojis');
  });

  test('uses singular form for single emoji', () => {
    const prompt = generatePrompt({
      tvShow: 'Friends',
      subject: 'mood',
      emojiCount: 1,
    });

    expect(prompt).toContain('1 emoji that best represents');
    expect(prompt).toContain('exactly 1 emoji');
    // Note: the word "emojis" may appear in example section, so we check for singular usage in the main prompt
  });

  test('includes subject-specific instructions for overall', () => {
    const prompt = generatePrompt({
      tvShow: 'The Sopranos',
      subject: 'overall',
      emojiCount: 3,
    });

    expect(prompt).toContain('holistically');
    expect(prompt).toContain('characters');
    expect(prompt).toContain('plot');
    expect(prompt).toContain('themes');
  });

  test('includes subject-specific instructions for character', () => {
    const prompt = generatePrompt({
      tvShow: 'Breaking Bad',
      subject: 'character',
      emojiCount: 3,
    });

    expect(prompt).toContain('characters');
    expect(prompt).toContain('personalities');
    expect(prompt).toContain('traits');
  });

  test('includes subject-specific instructions for relationship', () => {
    const prompt = generatePrompt({
      tvShow: 'Friends',
      subject: 'relationship',
      emojiCount: 3,
    });

    expect(prompt).toContain('relationships');
    expect(prompt).toContain('friendships');
    expect(prompt).toContain('romances');
  });

  test('includes subject-specific instructions for plot', () => {
    const prompt = generatePrompt({
      tvShow: 'Lost',
      subject: 'plot',
      emojiCount: 3,
    });

    expect(prompt).toContain('plot');
    expect(prompt).toContain('story');
    expect(prompt).toContain('narrative');
  });

  test('includes subject-specific instructions for theme', () => {
    const prompt = generatePrompt({
      tvShow: 'The Wire',
      subject: 'theme',
      emojiCount: 3,
    });

    expect(prompt).toContain('themes');
    expect(prompt).toContain('messages');
  });

  test('includes subject-specific instructions for mood', () => {
    const prompt = generatePrompt({
      tvShow: 'Stranger Things',
      subject: 'mood',
      emojiCount: 3,
    });

    expect(prompt).toContain('mood');
    expect(prompt).toContain('emotional atmosphere');
    expect(prompt).toContain('tone');
  });

  test('includes subject-specific instructions for symbol', () => {
    const prompt = generatePrompt({
      tvShow: 'Breaking Bad',
      subject: 'symbol',
      emojiCount: 3,
    });

    expect(prompt).toContain('symbols');
    expect(prompt).toContain('motifs');
    expect(prompt).toContain('symbolic');
  });

  test('includes format requirements', () => {
    const prompt = generatePrompt({
      tvShow: 'The Office',
      subject: 'character',
      emojiCount: 3,
    });

    expect(prompt).toContain('FORMAT REQUIREMENTS');
    expect(prompt).toContain('single-sentence explanation');
    expect(prompt).toContain('maximum 50 words');
    expect(prompt).toContain('[emoji] - [one-sentence explanation]');
  });

  test('includes example format', () => {
    const prompt = generatePrompt({
      tvShow: 'Game of Thrones',
      subject: 'conflict',
      emojiCount: 3,
    });

    expect(prompt).toContain('Example format:');
    expect(prompt).toContain('💀 -');
    expect(prompt).toContain('🔬 -');
  });

  test('generates prompts for all 14 subject types', () => {
    // Ensure all subjects can generate prompts without errors
    VALID_SUBJECTS.forEach(subject => {
      const prompt = generatePrompt({
        tvShow: 'Test Show',
        subject,
        emojiCount: 3,
      });

      expect(prompt).toBeTruthy();
      expect(prompt.length).toBeGreaterThan(100);
      expect(prompt).toContain('Test Show');
      expect(prompt).toContain(subject);
    });
  });

  test('generates different instructions for different subjects', () => {
    const characterPrompt = generatePrompt({
      tvShow: 'Test Show',
      subject: 'character',
      emojiCount: 3,
    });

    const plotPrompt = generatePrompt({
      tvShow: 'Test Show',
      subject: 'plot',
      emojiCount: 3,
    });

    // The prompts should be different (different instructions)
    expect(characterPrompt).not.toBe(plotPrompt);
    expect(characterPrompt).toContain('characters');
    expect(plotPrompt).toContain('plot');
    expect(plotPrompt).not.toContain('personalities');
  });

  test('handles special characters in TV show name', () => {
    const prompt = generatePrompt({
      tvShow: 'It\'s Always Sunny in Philadelphia',
      subject: 'character',
      emojiCount: 3,
    });

    expect(prompt).toContain('It\'s Always Sunny in Philadelphia');
  });

  test('handles large emoji counts', () => {
    const prompt = generatePrompt({
      tvShow: 'The Wire',
      subject: 'character',
      emojiCount: 30,
    });

    expect(prompt).toContain('30 emojis');
    expect(prompt).toContain('exactly 30 emojis');
  });
});
