import chalk from 'chalk';
import type { EmojiResult } from './response-parser';

export interface FormatOptions {
  tvShow: string;
  subject: string;
  emojiCount: number;
  interactive: boolean;
}

/**
 * Detects if output should use colors
 * - Check NO_COLOR environment variable
 * - Check CI environment variable
 * - Check if output is a TTY
 */
export function shouldUseColors(): boolean {
  // Respect NO_COLOR standard (https://no-color.org/)
  if (process.env.NO_COLOR) {
    return false;
  }

  // Disable colors in CI environments
  if (process.env.CI) {
    return false;
  }

  // Check if stdout is a TTY
  if (!process.stdout.isTTY) {
    return false;
  }

  return true;
}

/**
 * Formats emoji results for CLI output with plain text fallback
 */
export function formatEmojiResults(results: EmojiResult[], options: FormatOptions): string {
  const { tvShow, subject, emojiCount, interactive } = options;
  const useColors = shouldUseColors();
  const lines: string[] = [];

  // Add header in interactive mode
  if (interactive) {
    lines.push('');
    if (useColors) {
      lines.push(chalk.bold.cyan('✨ Emoji Suggestions'));
      lines.push(chalk.dim('━'.repeat(50)));
    } else {
      lines.push('=== Emoji Suggestions ===');
      lines.push('');
    }
    lines.push('');
  }

  // Add each emoji with its explanation
  results.forEach((result, index) => {
    if (useColors) {
      // Enhanced visual hierarchy with colors
      const number = chalk.dim.gray(`${index + 1}.`);
      const emoji = `  ${result.emoji}  `;  // More spacing around emoji
      const explanation = chalk.white(result.explanation);

      lines.push(`${number} ${emoji} ${explanation}`);

      // Add subtle separator between items (except after last item)
      if (index < results.length - 1) {
        lines.push(chalk.dim('   │'));
      }
    } else {
      // Plain text mode for screen readers and piped output
      const number = `${index + 1}.`;
      const emoji = result.emoji;
      const explanation = result.explanation;

      lines.push(`${number} ${emoji} - ${explanation}`);
    }
  });

  // Add footer in interactive mode
  if (interactive) {
    lines.push('');
    if (useColors) {
      lines.push(chalk.dim('━'.repeat(50)));
      lines.push(chalk.dim(`Generated ${emojiCount} emoji${emojiCount === 1 ? '' : 's'} for "${tvShow}" (${subject})`));
    } else {
      lines.push(`Generated ${emojiCount} emoji${emojiCount === 1 ? '' : 's'} for "${tvShow}" (${subject})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Formats an error message for display
 */
export function formatError(error: Error): string {
  const useColors = shouldUseColors();

  if (useColors) {
    return chalk.red(`\n✗ Error: ${error.message}\n`);
  } else {
    return `\nError: ${error.message}\n`;
  }
}
