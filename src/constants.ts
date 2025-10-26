export const VALID_SUBJECTS = [
  'character',
  'relationship',
  'plot',
  'setting',
  'theme',
  'episode',
  'season',
  'overall',
  'mood',
  'location',
  'genre',
  'conflict',
  'emotion',
  'symbol'
] as const;

export type Subject = typeof VALID_SUBJECTS[number];

export const DEFAULT_MODEL = 'llama3.2';
export const DEFAULT_EMOJI_COUNT = 5;
export const MIN_EMOJI_COUNT = 1;
export const MAX_EMOJI_COUNT = 30;
