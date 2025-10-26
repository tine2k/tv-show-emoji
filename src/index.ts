#!/usr/bin/env bun

import { Command } from 'commander';
import { validateSubject, validateEmojiCount, validateTVShow } from './validators';
import { DEFAULT_MODEL, DEFAULT_EMOJI_COUNT, VALID_SUBJECTS } from './constants';
import { promptForShow, promptForSubject, promptForContinue } from './prompts';
import { validateOllamaConnection, findBestAvailableModel, OllamaError, generateCompletion } from './ollama';
import { generatePrompt } from './prompt-generator';
import { parseEmojiResponse, ParseError } from './response-parser';
import { formatEmojiResults, formatError, shouldUseColors } from './output-formatter';
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

async function main() {
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

  // In interactive mode, loop to allow analyzing different aspects of the same show
  let continueAnalyzing = true;

  while (continueAnalyzing) {
    // Step 4: Get subject
    let subject = options.subject;

    if (mode === 'interactive') {
      // In loop, always prompt for subject (even if provided initially)
      subject = await promptForSubject();

      console.log('\nConfiguration:');
      console.log(`  TV Show: ${show}`);
      console.log(`  Subject: ${subject}`);
      console.log(`  Model: ${selectedModel}`);
      console.log(`  Emoji Count: ${options.emojiCount}`);
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
        response = await generateCompletion(selectedModel, prompt);

        if (spinner) {
          spinner.succeed('Emojis generated!');
        }
      } catch (error) {
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

    // Step 9: Ask if user wants to continue (interactive mode only)
    if (mode === 'interactive') {
      continueAnalyzing = await promptForContinue();

      if (continueAnalyzing) {
        console.log(''); // Add spacing before next iteration
      } else {
        // Friendly exit message
        const useColors = shouldUseColors();
        if (useColors) {
          console.log(chalk.dim('\n👋 Thanks for using tv-show-emoji!\n'));
        } else {
          console.log('\nThanks for using tv-show-emoji!\n');
        }
      }
    } else {
      // Non-interactive mode: exit after first iteration
      continueAnalyzing = false;
    }
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});