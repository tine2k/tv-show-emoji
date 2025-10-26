import { describe, test, expect } from 'bun:test';
import {
  DEFAULT_EMOJI_COUNT,
  MIN_EMOJI_COUNT,
  MAX_EMOJI_COUNT,
  DEFAULT_MODEL,
  OLLAMA_BASE_URL,
  OLLAMA_TIMEOUT,
  FALLBACK_MODELS,
} from './constants';

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
  test('default model is llama3.2:latest', () => {
    expect(DEFAULT_MODEL).toBe('llama3.2:latest');
  });

  test('default model includes tag', () => {
    expect(DEFAULT_MODEL).toContain(':');
  });
});

describe('Ollama configuration', () => {
  test('OLLAMA_BASE_URL is localhost', () => {
    expect(OLLAMA_BASE_URL).toBe('http://localhost:11434');
  });

  test('OLLAMA_TIMEOUT is 60 seconds', () => {
    expect(OLLAMA_TIMEOUT).toBe(60000);
  });

  test('OLLAMA_TIMEOUT is positive', () => {
    expect(OLLAMA_TIMEOUT).toBeGreaterThan(0);
  });
});

describe('FALLBACK_MODELS', () => {
  test('has fallback models defined', () => {
    expect(FALLBACK_MODELS.length).toBeGreaterThan(0);
  });

  test('first fallback is default model', () => {
    expect(FALLBACK_MODELS[0]).toBe(DEFAULT_MODEL);
  });

  test('all fallback models have tags', () => {
    for (const model of FALLBACK_MODELS) {
      expect(model).toContain(':');
    }
  });

  test('contains llama3.2:latest', () => {
    expect(FALLBACK_MODELS).toContain('llama3.2:latest');
  });
});
