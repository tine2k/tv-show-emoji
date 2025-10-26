# TV Show Emoji CLI - Product Requirements Document

## Executive Summary

TV Show Emoji CLI is a command-line application that generates emoji representations of TV shows based on specific aspects (plot, style, culture, actors, public perception). The tool leverages local LLMs via Ollama to provide creative, insightful emoji combinations with explanations, offering TV enthusiasts a fun and educational way to explore their favorite shows. Target audience includes CLI users, TV fans, and developers experimenting with local LLM integration.

## User Stories

- As a TV fan, I want to quickly understand a show's vibe through emojis so I can share it with friends
- As a developer, I want to experiment with local LLMs in a fun context without sending data to external APIs
- As a casual user, I want an intuitive interactive interface to explore different aspects of TV shows
- As a CLI enthusiast, I want a fast, offline tool that doesn't require internet connectivity

## Goals

- **Primary Goal**: Users should have fun and learn something about their favorite TV shows
- **Secondary Goals**:
  - Demonstrate practical local LLM usage
  - Provide a delightful CLI user experience
  - Make TV show analysis accessible and engaging

## Success Metrics

- Users successfully generate emoji representations in under 5 seconds
- Emoji selections are contextually relevant and insightful
- Users explore multiple subjects per session (engagement)
- Tool works reliably across all supported platforms

## Non-Goals

- Web interface or GUI (future consideration only)
- Real-time TV show data fetching from external APIs
- Social sharing features
- User accounts or data persistence
- Multi-language support (English only in v1)

## Requirements

### Functional Requirements

The goal is to build a command line interface (CLI) application that returns emojis about TV shows. The users can select their TV show and a specific subject (e.g. plot, style, culture, actors, public perception or others) and the tool returns a set of 3 emojis (amount configurable) that represents the subject of the show best. It also includes brief explanations (1 sentence per emoji) why the tool picked these emojis.

The tool should use a local LLM using Ollama.

The selection of TV show and subject should be in interactive mode.

#### Input & Validation
- TV show input should support autocomplete/fuzzy search for user comfort
- Subject selection from predefined list: overview, plot, style, culture, actors, public perception, themes, humor, drama, setting, mood, violence level, target demographic, romance elements, special effects
- The first subject "overview" is the default and provides a holistic view that combines aspects of all other subjects
- Custom subject input allowed with text sanitization
- Input validation with helpful error messages

#### Output Format
- Display n emojis prominently
- Provide 1-sentence explanation (max 50 words) for each emoji
- Use colored/formatted output for better readability
- Show processing indicator while LLM generates response

#### Error Handling
- Detect if Ollama is not running and provide setup instructions
- Handle missing models gracefully with download suggestions
- Validate TV show input and suggest alternatives for typos
- Timeout handling for slow LLM responses (60 second timeout)
- Graceful degradation if emoji rendering not supported

#### Data Sources
- Initial release: Hardcoded list of popular TV shows (top 100-200)
- TV show list should be easily extensible via configuration file
- Future: Option to allow free-form TV show input

### Non-Functional Requirements

#### Performance
- Response time: Under 5 seconds for emoji generation (model dependent)
- Startup time: Under 2 seconds
- Memory usage: Under 100MB (excluding Ollama process)

#### Reliability
- Offline capability: Full functionality without internet (after initial setup)
- Cross-platform consistency: Identical behavior on Mac, Linux, Windows
- Graceful handling of interrupted operations (Ctrl+C)

#### Accessibility
- Clear, readable terminal output
- Screen reader friendly (plain text fallback)
- Keyboard-only navigation

## Technology Requirements

### Core Technologies
- Language: TypeScript
- Runtime: Bun (includes built-in TypeScript support)
- Minimum Bun version: 1.0.0 or higher
- Build tool: bun build --compile for creating single executable

### Platform Support
- The tool should be a single executable that runs under Mac, Linux, and Windows
- Executable should be self-contained (no external dependencies except Ollama)

### User Experience
- The tool should let the user select a TV show with good comfort (autocomplete or fuzzy search)
- Interactive prompts using inquirer or prompts library
- Progress indicators for LLM processing

### LLM Integration
- The tool should have a CLI option to select the LLM to use (--model flag)
- Default to llama3.2:latest (good balance of speed and quality)
- Fallback models: llama3.2, mistral, phi3
- Validate model availability before processing
- Clear error messages if model not found with download instructions

### CLI Interface
- Command structure: `tv-show-emoji [options]`
- Options:
  - `--model <name>`: Specify Ollama model (default: llama3.2)
  - `--show <name>`: TV show name (skips interactive prompt)
  - `--subject <name>`: Subject to analyze (skips interactive prompt, default: overview)
    - Valid values: overview, plot, style, culture, actors, public perception, themes, humor, drama, setting, mood, violence level, target demographic, romance elements, special effects
  - `--emoji-count <number>`: Number of emojis to generate (1-30, default: 3)
  - `-h, --help`: Display help information with examples and subject list
  - `-v, --version`: Display version number

**Behavior Notes:**
- When both `--show` and `--subject` are provided, runs in non-interactive mode
- When only one is provided, prompts interactively for the missing value
- When neither is provided, runs fully interactive mode
- Invalid subject values show error and list valid options
- Emoji count must be between 1-30; values outside this range show error
- Model validation happens after connection check but before prompts

## Dependencies

### External Dependencies
- **Ollama**: Required, version 0.1.0 or higher
- Ollama must be running locally (default: http://localhost:11434)
- At least one compatible model must be downloaded

### Libraries
- @inquirer/prompts or prompts: Interactive CLI prompts
- chalk: Colored terminal output
- ora: Loading spinners
- commander: CLI argument parsing
- ollama: Ollama API client (official TypeScript SDK)

## Installation & Setup

### Prerequisites
1. Bun 1.0.0 or higher installed (for development)
2. Ollama installed and running
3. At least one LLM model downloaded (recommended: llama3.2)

### Installation Steps
```bash
# Option 1: Install from npm (future)
npm install -g tv-show-emoji

# Option 2: Download executable (recommended for end users)
# Download platform-specific binary from releases
# No runtime dependencies required - executable is standalone
chmod +x tv-show-emoji  # Mac/Linux only
```

### First-Time Setup
```bash
# Verify Ollama is running
ollama list

# Download recommended model if not present
ollama pull llama3.2
```

## User Flow

1. User launches tool (or provides arguments)
2. Tool validates Ollama connection
3. Tool validates selected model availability
4. If interactive mode:
   - Prompt for TV show (with autocomplete)
   - Prompt for subject
5. Show loading indicator
6. Generate LLM prompt with context
7. Get response from Ollama
8. Parse emojis and explanation from response
9. Display formatted output
10. Ask if user wants to analyze another aspect (y/n)

## Future Considerations

### Phase 2 Features
- Web interface version using the same core logic
- Multi-language support (Spanish, French, German)
- Emoji combination suggestions (multiple subjects at once)
- TV show comparison mode (compare two shows)
- Export results to image or shareable format

### Technical Improvements
- Streaming LLM responses for perceived speed
- Multiple LLM provider support (local, cloud optional)
- Plugin system for custom subjects
- TV show database from external API (TMDB, TVDB)

## Open Questions

1. Should we support TV show seasons/episodes individually? -> No
2. Should we include a confidence score with emoji selections? -> No
3. Should the tool suggest related TV shows to explore? -> No
