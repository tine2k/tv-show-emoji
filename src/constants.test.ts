import { describe, test, expect } from 'bun:test';
import { DEFAULT_EMOJI_COUNT, MIN_EMOJI_COUNT, MAX_EMOJI_COUNT, DEFAULT_MODEL } from './constants';

describe('DEFAULT_EMOJI_COUNT', () => {
  test('default emoji count is 3', () => {
    expect(DEFAULT_EMOJI_COUNT).toBe(3);
  });

  test('default is within valid range', () => {
    expect(DEFAULT_EMOJI_COUNT).toBeGreaterThanOrEqual(MIN_EMOJI_COUNT);
    expect(DEFAULT_EMOJI_COUNT).toBeLessThanOrEqual(MAX_EMOJI_COUNT);
  });
});

describe('emoji count bounds', () => {
  test('min emoji count is 1', () => {
    expect(MIN_EMOJI_COUNT).toBe(1);
  });

  test('max emoji count is 30', () => {
    expect(MAX_EMOJI_COUNT).toBe(30);
  });

  test('min is less than max', () => {
    expect(MIN_EMOJI_COUNT).toBeLessThan(MAX_EMOJI_COUNT);
  });
});

describe('DEFAULT_MODEL', () => {
  test('default model is llama3.2', () => {
    expect(DEFAULT_MODEL).toBe('llama3.2');
  });
});
