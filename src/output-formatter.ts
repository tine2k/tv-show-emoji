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
 * Detects if terminal likely supports emoji rendering
 * - Check TERM environment variable for known limited terminals
 * - Check LANG/LC_ALL for UTF-8 support
 */
export function supportsEmoji(): boolean {
  const term = process.env.TERM?.toLowerCase() || '';
  const lang = process.env.LANG?.toUpperCase() || process.env.LC_ALL?.toUpperCase() || '';

  // Known terminals with limited emoji support
  const limitedTerminals = ['dumb', 'cons25', 'emacs', 'linux'];
  if (limitedTerminals.includes(term)) {
    return false;
  }

  // Check for UTF-8 encoding support (required for emojis)
  if (lang && !lang.includes('UTF-8') && !lang.includes('UTF8')) {
    return false;
  }

  // If we have a TTY and UTF-8, assume emoji support
  return process.stdout.isTTY;
}

/**
 * Gets an emoji rendering warning message if emojis may not display correctly
 */
export function getEmojiWarning(): string | null {
  if (!supportsEmoji()) {
    const useColors = shouldUseColors();
    if (useColors) {
      return chalk.yellow('⚠ Note: Your terminal may not display emojis correctly. Output will be in plain text.\n');
    } else {
      return 'Note: Your terminal may not display emojis correctly. Output will be in plain text.\n';
    }
  }
  return null;
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
