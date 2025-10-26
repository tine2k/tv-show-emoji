export interface EmojiResult {
  emoji: string;
  explanation: string;
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

/**
 * Validates that an explanation meets the requirements
 * - Single sentence (or reasonably short)
 * - Maximum 50 words
 */
function validateExplanation(explanation: string): void {
  const trimmed = explanation.trim();

  if (trimmed.length === 0) {
    throw new ParseError('Explanation cannot be empty');
  }

  // Count words (split by whitespace)
  const wordCount = trimmed.split(/\s+/).length;

  if (wordCount > 50) {
    throw new ParseError(`Explanation exceeds 50 words (has ${wordCount} words)`);
  }
}

/**
 * Checks if a string contains an emoji
 */
function containsEmoji(str: string): boolean {
  // Unicode ranges for emojis
  const emojiRegex = /[\p{Emoji}\u200d]/u;
  return emojiRegex.test(str);
}

/**
 * Extracts the first emoji from a string
 */
function extractEmoji(str: string): string | null {
  // Match emoji characters including modifiers and zero-width joiners
  const emojiMatch = str.match(/[\p{Emoji}\u200d\ufe0f]+/u);
  return emojiMatch ? emojiMatch[0] : null;
}

/**
 * Parses a single line containing emoji and explanation
 * Expected format: [emoji] - [explanation]
 * Also handles: [emoji]: [explanation], [emoji] [explanation], etc.
 */
function parseLine(line: string): EmojiResult | null {
  let trimmed = line.trim();

  // Skip empty lines
  if (!trimmed) {
    return null;
  }

  // Remove common list prefixes (numbers, bullets, etc.)
  // Handles: "1. ", "• ", "- ", etc.
  trimmed = trimmed.replace(/^[\d]+[\.)]\s*/, '').replace(/^[•\-*]\s*/, '').trim();

  // Skip lines that don't contain emojis
  if (!containsEmoji(trimmed)) {
    return null;
  }

  // Extract the emoji (should be at the start)
  const emoji = extractEmoji(trimmed);
  if (!emoji) {
    return null;
  }

  // Remove the emoji from the line to get the explanation part
  const withoutEmoji = trimmed.substring(emoji.length).trim();

  // Remove common separators (-, :, |, etc.) from the start
  const explanation = withoutEmoji.replace(/^[\s\-:|•]+/, '').trim();

  if (!explanation) {
    return null;
  }

  // Validate the explanation
  try {
    validateExplanation(explanation);
  } catch (error) {
    // If explanation is too long, truncate it to first sentence or 50 words
    const sentences = explanation.split(/[.!?]+/);
    const firstSentence = (sentences[0] || explanation).trim();
    const words = firstSentence.split(/\s+/);

    if (words.length > 50) {
      // Truncate to 50 words
      const truncated = words.slice(0, 50).join(' ');
      return { emoji, explanation: truncated };
    }

    return { emoji, explanation: firstSentence };
  }

  return { emoji, explanation };
}

/**
 * Parses LLM response to extract emoji results
 * @param response The raw response from the LLM
 * @param expectedCount The number of emojis expected
 * @returns Array of emoji results
 * @throws {ParseError} If response cannot be parsed or doesn't contain expected number of emojis
 */
export function parseEmojiResponse(response: string, expectedCount: number): EmojiResult[] {
  if (!response || response.trim().length === 0) {
    throw new ParseError('Response is empty');
  }

  // Split response into lines
  const lines = response.split('\n');
  const results: EmojiResult[] = [];

  // Parse each line
  for (const line of lines) {
    const parsed = parseLine(line);
    if (parsed) {
      results.push(parsed);
    }
  }

  // Validate we got the expected number of emojis
  if (results.length === 0) {
    throw new ParseError('No emojis found in response');
  }

  if (results.length < expectedCount) {
    throw new ParseError(
      `Expected ${expectedCount} emoji${expectedCount === 1 ? '' : 's'}, but only found ${results.length}`
    );
  }

  // If we got more than expected, take only the first N
  if (results.length > expectedCount) {
    return results.slice(0, expectedCount);
  }

  return results;
}
