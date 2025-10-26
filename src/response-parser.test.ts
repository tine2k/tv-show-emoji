import { describe, test, expect } from 'bun:test';
import { parseEmojiResponse, ParseError } from './response-parser';

describe('parseEmojiResponse', () => {
  test('parses valid response with dash separator', () => {
    const response = `
💀 - Death and mortality are central themes explored through the protagonist's journey.
🔬 - Chemistry is both the literal profession and metaphor for transformation.
⚗️ - The lab represents the descent into the criminal underworld.
    `.trim();

    const results = parseEmojiResponse(response, 3);

    expect(results).toHaveLength(3);
    expect(results[0].emoji).toBe('💀');
    expect(results[0].explanation).toContain('Death and mortality');
    expect(results[1].emoji).toBe('🔬');
    expect(results[2].emoji).toBe('⚗️');
  });

  test('parses valid response with colon separator', () => {
    const response = `
👨‍👩‍👧‍👦: The show focuses on dysfunctional family dynamics and relationships.
☕: The coffee shop is the central gathering place for the group.
💑: Romance and dating are recurring themes throughout the series.
    `.trim();

    const results = parseEmojiResponse(response, 3);

    expect(results).toHaveLength(3);
    expect(results[0].emoji).toBe('👨‍👩‍👧‍👦');
    expect(results[1].emoji).toBe('☕');
    expect(results[2].emoji).toBe('💑');
  });

  test('parses response with numbering', () => {
    const response = `
1. 🎭 - Theater and performance are central to the show's premise.
2. 🌆 - The city setting plays a crucial role in the narrative.
3. 💼 - Corporate culture and workplace dynamics drive the plot.
    `.trim();

    const results = parseEmojiResponse(response, 3);

    expect(results).toHaveLength(3);
    expect(results[0].emoji).toBe('🎭');
    expect(results[1].emoji).toBe('🌆');
    expect(results[2].emoji).toBe('💼');
  });

  test('parses response with bullet points', () => {
    const response = `
• 🏠 - The house serves as a character itself throughout the series.
• 👪 - Family bonds are tested and transformed over time.
• 💰 - Money and greed drive many of the character decisions.
    `.trim();

    const results = parseEmojiResponse(response, 3);

    expect(results).toHaveLength(3);
    expect(results[0].emoji).toBe('🏠');
    expect(results[1].emoji).toBe('👪');
    expect(results[2].emoji).toBe('💰');
  });

  test('parses response without separators', () => {
    const response = `
🎬 Movie making and Hollywood culture define the show's world.
🌟 Fame and celebrity are explored through multiple character arcs.
📺 Television industry critique is a meta-theme throughout.
    `.trim();

    const results = parseEmojiResponse(response, 3);

    expect(results).toHaveLength(3);
    expect(results[0].emoji).toBe('🎬');
    expect(results[1].emoji).toBe('🌟');
    expect(results[2].emoji).toBe('📺');
  });

  test('handles single emoji request', () => {
    const response = '💔 - Heartbreak and emotional turmoil dominate the narrative.';

    const results = parseEmojiResponse(response, 1);

    expect(results).toHaveLength(1);
    expect(results[0].emoji).toBe('💔');
    expect(results[0].explanation).toContain('Heartbreak');
  });

  test('handles maximum emoji count (30)', () => {
    // Generate 30 emoji lines
    const lines = Array.from({ length: 30 }, (_, i) =>
      `${String.fromCodePoint(0x1F600 + i)} - Explanation ${i + 1} for this emoji.`
    );
    const response = lines.join('\n');

    const results = parseEmojiResponse(response, 30);

    expect(results).toHaveLength(30);
  });

  test('truncates when more emojis than expected', () => {
    const response = `
🏆 - Victory and competition are central themes.
🎯 - Goals and aspirations drive the characters.
💪 - Strength and perseverance are highlighted.
🌟 - Excellence and achievement are celebrated.
    `.trim();

    const results = parseEmojiResponse(response, 2);

    expect(results).toHaveLength(2);
    expect(results[0].emoji).toBe('🏆');
    expect(results[1].emoji).toBe('🎯');
  });

  test('throws error when no emojis found', () => {
    const response = 'This is just text without any emojis.';

    expect(() => parseEmojiResponse(response, 3)).toThrow(ParseError);
    expect(() => parseEmojiResponse(response, 3)).toThrow('No emojis found');
  });

  test('throws error when empty response', () => {
    expect(() => parseEmojiResponse('', 3)).toThrow(ParseError);
    expect(() => parseEmojiResponse('', 3)).toThrow('Response is empty');
  });

  test('throws error when fewer emojis than expected', () => {
    const response = `
🎭 - Theater is important.
🎬 - Cinema plays a role.
    `.trim();

    expect(() => parseEmojiResponse(response, 5)).toThrow(ParseError);
    expect(() => parseEmojiResponse(response, 5)).toThrow('Expected 5 emojis, but only found 2');
  });

  test('handles explanations with punctuation', () => {
    const response = `
❓ - Mystery, intrigue, and suspense drive the plot forward!
🔍 - Investigation and detective work are central to each episode.
🕵️ - The protagonist's clever deductions solve complex cases.
    `.trim();

    const results = parseEmojiResponse(response, 3);

    expect(results).toHaveLength(3);
    expect(results[0].explanation).toContain('Mystery');
    expect(results[1].explanation).toContain('Investigation');
    expect(results[2].explanation).toContain('protagonist');
  });

  test('handles multi-part emojis (skin tones)', () => {
    const response = '👍🏽 - Approval and positivity are common themes.';

    const results = parseEmojiResponse(response, 1);

    expect(results).toHaveLength(1);
    expect(results[0].emoji).toContain('👍');
  });

  test('handles compound emojis (flags)', () => {
    const response = '🇺🇸 - American culture and values are explored throughout.';

    const results = parseEmojiResponse(response, 1);

    expect(results).toHaveLength(1);
    expect(results[0].explanation).toContain('American culture');
  });

  test('skips empty lines', () => {
    const response = `
🎨 - Art and creativity are celebrated.

🖌️ - The artistic process is a recurring motif.


🎭 - Performance and expression are key themes.
    `.trim();

    const results = parseEmojiResponse(response, 3);

    expect(results).toHaveLength(3);
    expect(results[0].emoji).toBe('🎨');
    expect(results[1].emoji).toBe('🖌️');
    expect(results[2].emoji).toBe('🎭');
  });

  test('handles responses with extra text before emojis', () => {
    const response = `
Here are the emojis you requested:

🌊 - Water and ocean themes represent freedom and adventure.
⛵ - Sailing captures the spirit of exploration.
🏴‍☠️ - Piracy and rebellion against authority are central.
    `.trim();

    const results = parseEmojiResponse(response, 3);

    expect(results).toHaveLength(3);
    expect(results[0].emoji).toBe('🌊');
    expect(results[1].emoji).toBe('⛵');
    expect(results[2].emoji).toBe('🏴‍☠️');
  });

  test('truncates overly long explanations to 50 words', () => {
    const longExplanation = 'This is a very long explanation that exceeds the fifty word limit ' +
      'and should be truncated to meet the requirements. ' +
      'It contains many words that discuss various aspects of the show including character development, ' +
      'plot progression, thematic elements, visual style, and narrative structure in great detail ' +
      'that goes beyond what is necessary for a brief explanation.';

    const response = `🎬 - ${longExplanation}`;

    const results = parseEmojiResponse(response, 1);

    expect(results).toHaveLength(1);
    const wordCount = results[0].explanation.split(/\s+/).length;
    expect(wordCount).toBeLessThanOrEqual(50);
  });

  test('handles various emoji formats in same response', () => {
    const response = `
1. 🎵 - Music is integral to the show's identity
• 🎸 - Guitar and rock culture are central themes
🎤 - Performance and stage presence drive the narrative
    `.trim();

    const results = parseEmojiResponse(response, 3);

    expect(results).toHaveLength(3);
    expect(results[0].emoji).toBe('🎵');
    expect(results[1].emoji).toBe('🎸');
    expect(results[2].emoji).toBe('🎤');
  });

  test('preserves explanation content accurately', () => {
    const response = `
💔 - Heartbreak and emotional turmoil define the protagonist's journey through loss.
🌹 - Romance blossoms unexpectedly despite challenging circumstances.
😢 - Tears flow as characters confront their deepest fears.
    `.trim();

    const results = parseEmojiResponse(response, 3);

    expect(results[0].explanation).toBe('Heartbreak and emotional turmoil define the protagonist\'s journey through loss.');
    expect(results[1].explanation).toBe('Romance blossoms unexpectedly despite challenging circumstances.');
    expect(results[2].explanation).toBe('Tears flow as characters confront their deepest fears.');
  });
});
