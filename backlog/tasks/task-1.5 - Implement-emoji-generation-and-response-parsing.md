---
id: task-1.5
title: Implement emoji generation and response parsing
status: Done
assignee:
  - Claude
created_date: '2025-10-26 16:31'
updated_date: '2025-10-26 18:54'
labels: []
dependencies: []
parent_task_id: task-1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the prompt engineering logic that requests emojis from the LLM based on TV show and subject. Parse the LLM response to extract emojis and their explanations.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Prompts generate contextually relevant emoji selections for each subject type
- [x] #2 Parser reliably extracts N emojis (1-30 configurable) from LLM response
- [x] #3 Each emoji includes 1-sentence explanation (max 50 words)
- [x] #4 Overview subject provides holistic view combining multiple aspects
- [x] #5 All 14 subjects produce appropriate emoji selections
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Implementation Plan

### Modules to Create

1. **Prompt Generator Module** (src/prompt-generator.ts)
   - Create contextually-aware prompts based on TV show, subject type, and emoji count
   - Specialized prompt instructions for each of the 14 subject types
   - Special handling for "overall" subject to combine multiple aspects
   - Output format instructions for parseable responses

2. **Response Parser Module** (src/response-parser.ts)
   - Extract emojis and explanations from LLM responses
   - Validate explanation length (1 sentence, max 50 words)
   - Validate emoji count matches request
   - Return structured data (EmojiResult[])

3. **Output Formatter Module** (src/output-formatter.ts)
   - Format emoji results for CLI display
   - Use chalk for colorization
   - Support both interactive and non-interactive modes

### Integration

- Update src/index.ts to use new modules
- Replace placeholder messages with actual emoji generation flow
- Add proper error handling

### Testing

- Unit tests for all new modules following project requirements
- Test all 14 subject types
- Test parsing edge cases and error conditions
- Mock Ollama responses for integration tests

### Technical Approach

- Prompt engineering with clear structured instructions
- Flexible parsing using regex/string parsing (not strict JSON)
- Validation at parsing time for emoji count and explanation length
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Summary

### Files Created

1. **src/prompt-generator.ts** - Generates contextually-aware prompts for all 14 subjects
2. **src/response-parser.ts** - Parses LLM responses with robust emoji extraction
3. **src/output-formatter.ts** - Formats results for CLI display with color support
4. **src/prompt-generator.test.ts** - Comprehensive tests for prompt generation (20 tests)
5. **src/response-parser.test.ts** - Comprehensive tests for parsing (21 tests)
6. **src/output-formatter.test.ts** - Comprehensive tests for formatting (14 tests)

### Files Modified

1. **src/index.ts** - Integrated new modules into main CLI flow

### Key Features Implemented

- Subject-specific prompt instructions for all 14 subjects (overall, character, relationship, plot, setting, theme, episode, season, mood, location, genre, conflict, emotion, symbol)
- Special handling for 'overall' subject to provide holistic view
- Robust response parsing that handles multiple formats (numbered lists, bullets, various separators)
- Automatic truncation of overly long explanations to 50 words
- Color-coded output with emoji numbering
- Support for both interactive and non-interactive modes
- Comprehensive error handling with helpful error messages

### Test Results

- All 132 tests pass (55 new tests added)
- Coverage includes happy paths, edge cases, and error conditions
- Tests verify all 14 subjects work correctly
<!-- SECTION:NOTES:END -->
