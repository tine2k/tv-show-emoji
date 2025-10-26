#!/usr/bin/env bun

import { Command } from 'commander';

const program = new Command();

program
  .name('tv-show-emoji')
  .description('CLI tool to suggest emojis for TV show names using local LLM')
  .version('1.0.0');

program.parse();

console.log('TV Show Emoji CLI - Ready for development!');