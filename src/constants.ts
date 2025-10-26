export const VALID_SUBJECTS = [
  'overall',
  'character',
  'relationship',
  'plot',
  'setting',
  'theme',
  'episode',
  'season',
  'mood',
  'location',
  'genre',
  'conflict',
  'emotion',
  'symbol'
] as const;

export type Subject = typeof VALID_SUBJECTS[number];

export const DEFAULT_MODEL = 'llama3.2:latest';
export const DEFAULT_EMOJI_COUNT = 3;
export const MIN_EMOJI_COUNT = 1;
export const MAX_EMOJI_COUNT = 30;

// Ollama configuration
export const OLLAMA_BASE_URL = 'http://localhost:11434';
export const OLLAMA_TIMEOUT = 60000; // 60 seconds

// Fallback models to try if requested model is not available
export const FALLBACK_MODELS = [
  'llama3.2:latest',
  'llama3.1:latest',
  'llama2:latest',
] as const;
