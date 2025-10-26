import type { Subject } from './constants';

export interface PromptOptions {
  tvShow: string;
  subject: Subject;
  emojiCount: number;
}

/**
 * Subject-specific instructions for generating contextually relevant emojis
 */
const SUBJECT_INSTRUCTIONS: Record<Subject, string> = {
  overall: 'Consider the show holistically: its iconic characters, memorable plot points, central themes, overall mood, setting, and what makes it unique. Capture the essence of the entire show.',
  character: 'Focus on the main characters, their personalities, defining traits, character arcs, and memorable quirks. Think about what makes each character iconic.',
  relationship: 'Focus on key relationships between characters: friendships, romances, rivalries, family dynamics, and evolving connections throughout the show.',
  plot: 'Focus on major plot points, story arcs, narrative structure, plot twists, and the overall storytelling approach.',
  setting: 'Focus on where the show takes place: the locations, time period, physical environment, and how the setting influences the story.',
  theme: 'Focus on the underlying themes and messages: what the show explores about human nature, society, morality, or life.',
  episode: 'Focus on memorable individual episodes: iconic moments, standout episodes, episode structure, and episodic storytelling elements.',
  season: 'Focus on seasonal arcs, how the show evolves across seasons, seasonal themes, and the progression of the overall narrative.',
  mood: 'Focus on the emotional atmosphere and tone: whether it\'s dark, comedic, tense, heartwarming, suspenseful, or whimsical.',
  location: 'Focus on specific iconic locations within the show: recurring settings, memorable places, and location-based scenes.',
  genre: 'Focus on the show\'s genre elements: what makes it a drama, comedy, thriller, sci-fi, etc., and how it uses or subverts genre conventions.',
  conflict: 'Focus on the central conflicts and tensions: internal struggles, external battles, moral dilemmas, and antagonistic forces.',
  emotion: 'Focus on the emotional journey: what feelings the show evokes, emotional highs and lows, and the emotional resonance.',
  symbol: 'Focus on recurring symbols, motifs, visual metaphors, and symbolic elements that carry deeper meaning in the show.',
};

/**
 * Generates a prompt for the LLM to create emojis based on TV show and subject
 */
export function generatePrompt(options: PromptOptions): string {
  const { tvShow, subject, emojiCount } = options;
  const instruction = SUBJECT_INSTRUCTIONS[subject];

  return `You are an expert at analyzing TV shows and selecting emojis that capture their essence.

TV Show: "${tvShow}"
Subject: ${subject}
Task: ${instruction}

Please suggest ${emojiCount} emoji${emojiCount === 1 ? '' : 's'} that best represent${emojiCount === 1 ? 's' : ''} the ${subject} of "${tvShow}".

IMPORTANT FORMAT REQUIREMENTS:
- Provide exactly ${emojiCount} emoji${emojiCount === 1 ? '' : 's'}
- For each emoji, provide a single-sentence explanation (maximum 50 words)
- Use this exact format for each emoji:

[emoji] - [one-sentence explanation]

Example format:
💀 - Death and mortality are central themes explored through the protagonist's terminal diagnosis and transformation.
🔬 - Chemistry is both the literal profession and metaphor for transformation throughout the series.

Now provide your ${emojiCount} emoji${emojiCount === 1 ? '' : 's'} for "${tvShow}" focused on ${subject}:`;
}
