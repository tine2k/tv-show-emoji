#!/usr/bin/env bun

import { Command } from 'commander';
import { validateSubject, validateEmojiCount, validateTVShow } from './validators';
import { DEFAULT_MODEL, DEFAULT_EMOJI_COUNT, VALID_SUBJECTS } from './constants';
import { promptForShow, promptForSubject } from './prompts';
import { validateOllamaConnection, findBestAvailableModel, OllamaError, generateCompletion } from './ollama';
import { generatePrompt } from './prompt-generator';
import { parseEmojiResponse, ParseError } from './response-parser';
import { formatEmojiResults, formatError, shouldUseColors, getEmojiWarning } from './output-formatter';
import chalk from 'chalk';
import ora from 'ora';

const program = new Command();

program
  .name('tv-show-emoji')
  .description('CLI tool to suggest emojis for TV show names using local LLM')
  .version('1.0.0')
  .option('--model <model>', 'LLM model to use', DEFAULT_MODEL)
  .option('--show <name>', 'TV show name (must be from predefined list)', validateTVShow)
  .option('--subject <subject>', 'Subject to get emojis for', validateSubject)
  .option('--emoji-count <number>', 'Number of emojis to suggest (1-30)', validateEmojiCount, DEFAULT_EMOJI_COUNT)
  .addHelpText('after', `

Examples:
  Interactive mode:
    $ tv-show-emoji
    $ tv-show-emoji --model llama3.2

  Non-interactive mode:
    $ tv-show-emoji --show "Breaking Bad" --subject character
    $ tv-show-emoji --show "The Wire" --subject plot --emoji-count 10
    $ tv-show-emoji --show "Friends" --subject overall --model llama3.2

Valid subjects:
  ${VALID_SUBJECTS.join(', ')}

Default values:
  model: ${DEFAULT_MODEL}
  emoji-count: ${DEFAULT_EMOJI_COUNT}
`);

program.parse();

const options = program.opts();

type Mode = 'interactive' | 'non-interactive';

function detectMode(): Mode {
  // If both show and subject are provided, use non-interactive mode
  if (options.show && options.subject) {
    return 'non-interactive';
  }
  // Otherwise, use interactive mode
  return 'interactive';
}

const mode = detectMode();

// Track if we're in the middle of processing
let isProcessing = false;

/**
 * Handles graceful shutdown on SIGINT (Ctrl+C) and SIGTERM
 */
function setupSignalHandlers(): void {
  const handleShutdown = () => {
    const useColors = shouldUseColors();

    if (isProcessing) {
      // User interrupted during processing
      if (useColors) {
        console.log(chalk.yellow('\n\n⚠ Operation interrupted by user'));
        console.log(chalk.dim('👋 Thanks for using tv-show-emoji!\n'));
      } else {
        console.log('\n\nOperation interrupted by user');
        console.log('Thanks for using tv-show-emoji!\n');
      }
    } else {
      // Clean exit during idle/prompt
      if (useColors) {
        console.log(chalk.dim('\n\n👋 Thanks for using tv-show-emoji!\n'));
      } else {
        console.log('\n\nThanks for using tv-show-emoji!\n');
      }
    }

    process.exit(130); // Standard exit code for SIGINT
  };

  process.on('SIGINT', () => handleShutdown());
  process.on('SIGTERM', () => handleShutdown());
}

async function main() {
  // Set up signal handlers for clean shutdown
  setupSignalHandlers();

  // Display emoji rendering warning if needed (only in interactive mode)
  if (mode === 'interactive') {
    const emojiWarning = getEmojiWarning();
    if (emojiWarning) {
      console.log(emojiWarning);
    }
  }

  // Step 1: Validate Ollama connection
  try {
    if (mode === 'interactive') {
      console.log(chalk.dim('Checking Ollama connection...'));
    }
    await validateOllamaConnection();
  } catch (error) {
    if (error instanceof OllamaError) {
      console.error(chalk.red('\n✗ Ollama Connection Error\n'));
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }

  // Step 2: Validate and select model
  let selectedModel: string;
  try {
    selectedModel = await findBestAvailableModel(options.model);

    // Inform user if we're using a fallback model
    if (selectedModel !== options.model && mode === 'interactive') {
      console.log(chalk.yellow(`\n⚠ Model "${options.model}" not found, using "${selectedModel}" instead\n`));
    }
  } catch (error) {
    if (error instanceof OllamaError) {
      console.error(chalk.red('\n✗ Model Error\n'));
      console.error(error.message);
      process.exit(1);
    }
    throw error;
  }

  // Step 3: Get show (interactive mode)
  let show = options.show;

  if (mode === 'interactive' && !show) {
    show = await promptForShow();
  }

  // Step 4: Get subject
  let subject = options.subject;

  if (mode === 'interactive') {
    subject = await promptForSubject();
  }

  // Step 5: Generate prompt
  const prompt = generatePrompt({
    tvShow: show,
    subject,
    emojiCount: options.emojiCount,
  });

  // Step 6: Get completion from LLM
  let response: string;
  try {
    // Show loading spinner during LLM processing (only in TTY environments)
    const spinner = shouldUseColors()
      ? ora(`Generating emojis with ${selectedModel}...`).start()
      : null;

    try {
      isProcessing = true;
      response = await generateCompletion(selectedModel, prompt);
      isProcessing = false;

      if (spinner) {
        spinner.succeed('Emojis generated!');
      }
    } catch (error) {
      isProcessing = false;
      if (spinner) {
        spinner.fail('Failed to generate emojis');
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof OllamaError) {
      console.error(formatError(error));
      process.exit(1);
    }
    throw error;
  }

  // Step 7: Parse response
  try {
    const results = parseEmojiResponse(response, options.emojiCount);

    // Step 8: Display results
    const output = formatEmojiResults(results, {
      tvShow: show,
      subject,
      emojiCount: options.emojiCount,
      interactive: mode === 'interactive',
    });

    console.log(output);
  } catch (error) {
    if (error instanceof ParseError) {
      console.error(formatError(error));
      console.error(chalk.dim('\nRaw LLM response:'));
      console.error(chalk.dim(response));
      process.exit(1);
    }
    throw error;
  }

  // Step 9: Display friendly exit message
  const useColors = shouldUseColors();
  if (useColors) {
    console.log(chalk.dim('\n👋 Thanks for using tv-show-emoji!\n'));
  } else {
    console.log('\nThanks for using tv-show-emoji!\n');
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});