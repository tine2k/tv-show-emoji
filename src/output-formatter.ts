import chalk from 'chalk';
import type { EmojiResult } from './response-parser';

export interface FormatOptions {
  tvShow: string;
  subject: string;
  emojiCount: number;
  interactive: boolean;
}

/**
 * Formats emoji results for CLI output
 */
export function formatEmojiResults(results: EmojiResult[], options: FormatOptions): string {
  const { tvShow, subject, emojiCount, interactive } = options;
  const lines: string[] = [];

  // Add header in interactive mode
  if (interactive) {
    lines.push('');
    lines.push(chalk.bold.cyan('✨ Emoji Suggestions'));
    lines.push('');
  }

  // Add each emoji with its explanation
  results.forEach((result, index) => {
    const number = chalk.dim(`${index + 1}.`);
    const emoji = result.emoji;
    const explanation = result.explanation;

    lines.push(`${number} ${emoji}  ${chalk.white(explanation)}`);
  });

  // Add footer in interactive mode
  if (interactive) {
    lines.push('');
    lines.push(chalk.dim(`Generated ${emojiCount} emoji${emojiCount === 1 ? '' : 's'} for "${tvShow}" (${subject})`));
  }

  return lines.join('\n');
}

/**
 * Formats an error message for display
 */
export function formatError(error: Error): string {
  return chalk.red(`\n✗ Error: ${error.message}\n`);
}
