---
id: task-1.6
title: Create formatted output and user experience enhancements
status: Done
assignee:
  - Claude
created_date: '2025-10-26 16:31'
updated_date: '2025-10-26 19:16'
labels: []
dependencies: []
parent_task_id: task-1
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement colored/formatted terminal output using chalk, loading indicators using ora, and post-generation prompt asking if user wants to analyze another aspect.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Emojis are displayed prominently with clear visual hierarchy
- [x] #2 Explanations are formatted with colors for better readability
- [x] #3 Loading spinner displays during LLM processing
- [x] #4 After results, user is asked if they want to analyze another aspect
- [x] #5 Output is screen reader friendly with plain text fallback
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Implementation Plan

### Current State Analysis
- Basic output formatting exists in src/output-formatter.ts
- chalk is already installed and used for basic coloring
- ora is installed but not yet used
- No loading indicators during LLM processing
- No post-generation prompt to analyze another aspect

### Implementation Steps

1. **Enhance Visual Hierarchy in output-formatter.ts** (AC #1, #2)
   - Make emojis larger/more prominent using spacing
   - Add color coding for different explanation sections
   - Improve the header/footer formatting
   - Add separators between emoji suggestions
   - Ensure non-interactive mode output is clean and parseable

2. **Add Loading Spinner in index.ts** (AC #3)
   - Import and configure ora spinner
   - Display spinner before calling generateCompletion()
   - Show appropriate message: "Generating emojis with [model]..."
   - Stop spinner before displaying results
   - Handle error cases (stop spinner before showing errors)

3. **Implement Post-Generation Loop** (AC #4)
   - Add promptForContinue() function in prompts.ts
   - After displaying results in interactive mode, ask user to continue
   - If yes, prompt for new subject (keep same show)
   - If no, exit gracefully
   - Wrap main logic in a loop for interactive mode only

4. **Screen Reader Accessibility** (AC #5)
   - Add environment variable check for NO_COLOR or CI environments
   - Create plain text fallback formatting function
   - Detect if output is being piped (not a TTY)
   - Disable colors and spinners in non-TTY environments

5. **Write Unit Tests**
   - Test enhanced formatting functions
   - Test plain text fallback mode
   - Test the continue prompt logic

### Files to Modify
- src/output-formatter.ts - Enhanced formatting
- src/index.ts - Add spinner and loop logic
- src/prompts.ts - Add continue prompt
- src/output-formatter.test.ts - Test enhancements
- src/prompts.test.ts - Test new prompt
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Summary

### Enhanced Visual Hierarchy (AC #1, #2)
- Added prominent spacing around emojis with '  emoji  ' format
- Implemented visual separators between items using '│' character
- Added styled header and footer with '━' line separators
- Color-coded different UI elements (dim gray for numbers, white for explanations)
- Distinguished interactive vs non-interactive output formats

### Loading Spinner (AC #3)
- Integrated ora spinner that displays during LLM processing
- Shows 'Generating emojis with [model]...' during generation
- Success state: 'Emojis generated!'
- Failure state: 'Failed to generate emojis'
- Only displays in TTY environments (respects shouldUseColors())

### Post-Generation Loop (AC #4)
- Added promptForContinue() function using inquirer confirm
- Implemented while loop in main() for interactive mode
- Keeps the same TV show, prompts for new subject
- Friendly exit message: 'Thanks for using tv-show-emoji!'
- Non-interactive mode exits after first iteration

### Screen Reader Accessibility (AC #5)
- Implemented shouldUseColors() function that checks:
  - NO_COLOR environment variable (https://no-color.org/)
  - CI environment variable
  - process.stdout.isTTY status
- Plain text fallback formatting:
  - Simple '=== Header ===' instead of styled separators
  - No ANSI color codes
  - Clean 'emoji - explanation' format
  - Spinner disabled in non-TTY environments

### Testing
- Added comprehensive tests for shouldUseColors() function
- Added tests for plain text mode formatting
- All 140 tests passing
- Verified NO_COLOR environment variable handling
- Tested TTY detection logic
<!-- SECTION:NOTES:END -->
