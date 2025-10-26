import { describe, test, expect, mock, beforeEach } from 'bun:test';
import { Ollama } from 'ollama';
import {
  validateOllamaConnection,
  getAvailableModels,
  checkModelAvailability,
  findBestAvailableModel,
  generateCompletion,
  OllamaError,
  initOllamaClient,
} from './ollama';

// Mock the Ollama client
const mockList = mock(() => Promise.resolve({
  models: [
    {
      name: 'llama3.2:latest',
      model: 'llama3.2',
      modified_at: '2024-01-01T00:00:00Z',
      size: 1000000,
      digest: 'abc123',
    },
    {
      name: 'llama3.1:latest',
      model: 'llama3.1',
      modified_at: '2024-01-01T00:00:00Z',
      size: 1000000,
      digest: 'def456',
    },
  ],
}));

const mockGenerate = mock(() => Promise.resolve({
  response: 'Generated emoji response',
  model: 'llama3.2:latest',
  created_at: '2024-01-01T00:00:00Z',
  done: true,
}));

// Mock Ollama constructor
mock.module('ollama', () => ({
  Ollama: class MockOllama {
    constructor(public config: any) {}
    list = mockList;
    generate = mockGenerate;
  },
}));

describe('initOllamaClient', () => {
  test('creates Ollama client with correct host', () => {
    const client = initOllamaClient();
    expect(client).toBeDefined();
    expect(client).toBeInstanceOf(Ollama);
  });
});

describe('validateOllamaConnection', () => {
  beforeEach(() => {
    mockList.mockClear();
  });

  test('succeeds when Ollama is running', async () => {
    mockList.mockResolvedValueOnce({
      models: [],
    });

    await expect(validateOllamaConnection()).resolves.toBeUndefined();
    expect(mockList).toHaveBeenCalledTimes(1);
  });

  test('throws OllamaError when connection is refused', async () => {
    const connectionError = new Error('fetch failed');
    mockList.mockRejectedValue(connectionError);

    await expect(validateOllamaConnection()).rejects.toThrow(OllamaError);
    await expect(validateOllamaConnection()).rejects.toThrow('Cannot connect to Ollama');
    await expect(validateOllamaConnection()).rejects.toThrow('Is Ollama running?');
  });

  test('throws OllamaError with ECONNREFUSED', async () => {
    const connectionError = new Error('ECONNREFUSED');
    mockList.mockRejectedValue(connectionError);

    await expect(validateOllamaConnection()).rejects.toThrow(OllamaError);
    await expect(validateOllamaConnection()).rejects.toThrow('Cannot connect to Ollama');
  });

  test('throws OllamaError on timeout', async () => {
    const timeoutError = new Error('Request aborted');
    timeoutError.name = 'AbortError';
    mockList.mockRejectedValue(timeoutError);

    await expect(validateOllamaConnection()).rejects.toThrow(OllamaError);
    await expect(validateOllamaConnection()).rejects.toThrow('timed out');
  });

  test('throws OllamaError on unknown error', async () => {
    const unknownError = new Error('Unknown error');
    mockList.mockRejectedValue(unknownError);

    await expect(validateOllamaConnection()).rejects.toThrow(OllamaError);
    await expect(validateOllamaConnection()).rejects.toThrow('Failed to connect to Ollama');
  });
});

describe('getAvailableModels', () => {
  beforeEach(() => {
    mockList.mockClear();
  });

  test('returns list of model names', async () => {
    mockList.mockResolvedValueOnce({
      models: [
        { name: 'llama3.2:latest', model: 'llama3.2', modified_at: '', size: 0, digest: '' },
        { name: 'llama3.1:latest', model: 'llama3.1', modified_at: '', size: 0, digest: '' },
        { name: 'codellama:latest', model: 'codellama', modified_at: '', size: 0, digest: '' },
      ],
    });

    const models = await getAvailableModels();

    expect(models).toEqual([
      'llama3.2:latest',
      'llama3.1:latest',
      'codellama:latest',
    ]);
  });

  test('returns empty array when no models available', async () => {
    mockList.mockResolvedValueOnce({ models: [] });

    const models = await getAvailableModels();

    expect(models).toEqual([]);
  });

  test('throws OllamaError on failure', async () => {
    mockList.mockRejectedValue(new Error('Network error'));

    await expect(getAvailableModels()).rejects.toThrow(OllamaError);
    await expect(getAvailableModels()).rejects.toThrow('Failed to fetch available models');
  });
});

describe('checkModelAvailability', () => {
  beforeEach(() => {
    mockList.mockClear();
  });

  test('returns true when model is available', async () => {
    mockList.mockResolvedValueOnce({
      models: [
        { name: 'llama3.2:latest', model: 'llama3.2', modified_at: '', size: 0, digest: '' },
      ],
    });

    const isAvailable = await checkModelAvailability('llama3.2:latest');

    expect(isAvailable).toBe(true);
  });

  test('returns true when model name matches without tag', async () => {
    mockList.mockResolvedValueOnce({
      models: [
        { name: 'llama3.2:latest', model: 'llama3.2', modified_at: '', size: 0, digest: '' },
      ],
    });

    const isAvailable = await checkModelAvailability('llama3.2');

    expect(isAvailable).toBe(true);
  });

  test('returns false when model is not available', async () => {
    mockList.mockResolvedValueOnce({
      models: [
        { name: 'llama3.2:latest', model: 'llama3.2', modified_at: '', size: 0, digest: '' },
      ],
    });

    const isAvailable = await checkModelAvailability('llama3.1:latest');

    expect(isAvailable).toBe(false);
  });

  test('returns false when no models are available', async () => {
    mockList.mockResolvedValueOnce({ models: [] });

    const isAvailable = await checkModelAvailability('llama3.2:latest');

    expect(isAvailable).toBe(false);
  });
});

describe('findBestAvailableModel', () => {
  beforeEach(() => {
    mockList.mockClear();
  });

  test('returns requested model when available', async () => {
    mockList.mockResolvedValue({
      models: [
        { name: 'llama3.2:latest', model: 'llama3.2', modified_at: '', size: 0, digest: '' },
        { name: 'custom-model:latest', model: 'custom-model', modified_at: '', size: 0, digest: '' },
      ],
    });

    const model = await findBestAvailableModel('custom-model:latest');

    expect(model).toBe('custom-model:latest');
  });

  test('normalizes requested model name when available', async () => {
    mockList.mockResolvedValue({
      models: [
        { name: 'llama3.2:latest', model: 'llama3.2', modified_at: '', size: 0, digest: '' },
      ],
    });

    const model = await findBestAvailableModel('llama3.2');

    expect(model).toBe('llama3.2:latest');
  });

  test('returns first available fallback model when requested model unavailable', async () => {
    mockList.mockResolvedValue({
      models: [
        { name: 'llama3.1:latest', model: 'llama3.1', modified_at: '', size: 0, digest: '' },
      ],
    });

    const model = await findBestAvailableModel('unavailable-model');

    expect(model).toBe('llama3.1:latest');
  });

  test('tries fallback models in order', async () => {
    // Only llama2:latest is available
    mockList.mockResolvedValue({
      models: [
        { name: 'llama2:latest', model: 'llama2', modified_at: '', size: 0, digest: '' },
      ],
    });

    const model = await findBestAvailableModel('unavailable-model');

    expect(model).toBe('llama2:latest');
  });

  test('throws error when no models available', async () => {
    mockList.mockResolvedValue({ models: [] });

    await expect(findBestAvailableModel('llama3.2:latest')).rejects.toThrow(OllamaError);
    await expect(findBestAvailableModel('llama3.2:latest')).rejects.toThrow('No models available');
    await expect(findBestAvailableModel('llama3.2:latest')).rejects.toThrow('ollama pull');
  });

  test('throws error with available models list when requested and fallbacks unavailable', async () => {
    mockList.mockResolvedValue({
      models: [
        { name: 'other-model:latest', model: 'other-model', modified_at: '', size: 0, digest: '' },
      ],
    });

    await expect(findBestAvailableModel('unavailable-model')).rejects.toThrow(OllamaError);
    await expect(findBestAvailableModel('unavailable-model')).rejects.toThrow('not found');
    await expect(findBestAvailableModel('unavailable-model')).rejects.toThrow('other-model:latest');
  });
});

describe('generateCompletion', () => {
  beforeEach(() => {
    mockGenerate.mockClear();
  });

  test('generates completion successfully', async () => {
    mockGenerate.mockResolvedValueOnce({
      response: 'Test response',
      model: 'llama3.2:latest',
      created_at: '2024-01-01T00:00:00Z',
      done: true,
    });

    const result = await generateCompletion('llama3.2:latest', 'Test prompt');

    expect(result).toBe('Test response');
    expect(mockGenerate).toHaveBeenCalledWith({
      model: 'llama3.2:latest',
      prompt: 'Test prompt',
      stream: false,
    });
  });

  test('throws OllamaError on timeout', async () => {
    const timeoutError = new Error('Request aborted');
    timeoutError.name = 'AbortError';
    mockGenerate.mockRejectedValue(timeoutError);

    await expect(generateCompletion('llama3.2:latest', 'Test')).rejects.toThrow(OllamaError);
    await expect(generateCompletion('llama3.2:latest', 'Test')).rejects.toThrow('timed out');
  });

  test('throws OllamaError on generation failure', async () => {
    mockGenerate.mockRejectedValue(new Error('Model error'));

    await expect(generateCompletion('llama3.2:latest', 'Test')).rejects.toThrow(OllamaError);
    await expect(generateCompletion('llama3.2:latest', 'Test')).rejects.toThrow('Failed to generate completion');
  });

  test('throws OllamaError on unknown error', async () => {
    mockGenerate.mockRejectedValue('Unknown error');

    await expect(generateCompletion('llama3.2:latest', 'Test')).rejects.toThrow(OllamaError);
    await expect(generateCompletion('llama3.2:latest', 'Test')).rejects.toThrow('Unknown error');
  });
});
