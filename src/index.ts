#!/usr/bin/env bun

import { Command } from 'commander';
import { validateSubject, validateEmojiCount } from './validators';
import { DEFAULT_MODEL, DEFAULT_EMOJI_COUNT, VALID_SUBJECTS } from './constants';
import { promptForShow, promptForSubject } from './prompts';

const program = new Command();

program
  .name('tv-show-emoji')
  .description('CLI tool to suggest emojis for TV show names using local LLM')
  .version('1.0.0')
  .option('--model <model>', 'LLM model to use', DEFAULT_MODEL)
  .option('--show <name>', 'TV show name')
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
  let show = options.show;
  let subject = options.subject;

  if (mode === 'interactive') {
    // Prompt for missing values in interactive mode
    if (!show) {
      show = await promptForShow();
    }
    if (!subject) {
      subject = await promptForSubject();
    }

    console.log('\nConfiguration:');
    console.log(`  TV Show: ${show}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Model: ${options.model}`);
    console.log(`  Emoji Count: ${options.emojiCount}`);
    console.log('\nProcessing request (to be implemented in tasks 1.4-1.6)...');
  } else {
    console.log('Non-interactive mode - processing request (to be implemented in tasks 1.4-1.6)');
    console.log(`  TV Show: ${show}`);
    console.log(`  Subject: ${subject}`);
    console.log(`  Model: ${options.model}`);
    console.log(`  Emoji Count: ${options.emojiCount}`);
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});