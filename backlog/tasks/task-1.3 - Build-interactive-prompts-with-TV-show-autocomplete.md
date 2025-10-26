---
id: task-1.3
title: Build interactive prompts with TV show autocomplete
status: Done
assignee:
  - Claude
created_date: '2025-10-26 16:31'
updated_date: '2025-10-26 18:32'
labels: []
dependencies: []
parent_task_id: task-1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement interactive mode prompts for TV show selection (with autocomplete/fuzzy search) and subject selection. Create a curated list of 100-200 popular TV shows as configuration data.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 TV show selection includes autocomplete or fuzzy search functionality
- [x] #2 Subject selection displays all 14 predefined options plus custom input option
- [x] #3 TV show list includes 100-200 popular shows in easily extensible format
- [x] #4 Prompts only appear for missing values when in interactive mode
- [x] #5 User can input custom subject with text sanitization
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Implementation Plan

### Files to Create
1. `src/data/tv-shows.ts` - Curated list of 100-200 popular TV shows
2. `src/prompts.ts` - Interactive prompt functions using @inquirer/prompts
3. `src/prompts.test.ts` - Unit tests for prompt functions
4. `src/data/tv-shows.test.ts` - Validation tests for TV shows data

### Files to Modify
1. `src/constants.ts` - Add missing 6 subjects (mood, location, genre, conflict, emotion, symbol)
2. `src/index.ts` - Integrate prompts in interactive mode
3. `src/validators.test.ts` - Add tests for new subjects

### Implementation Steps
1. Create TV shows data file with 100-200 shows, organized alphabetically
2. Update constants to include all 14 subjects
3. Create prompts module with autocomplete for shows and select for subjects
4. Integrate prompts in index.ts interactive mode with conditional logic
5. Write comprehensive unit tests for all new functionality
6. Run tests to ensure everything passes

### Technical Approach
- Use @inquirer/prompts autocomplete for show selection with fuzzy filtering
- Allow custom show names not in predefined list
- Use select prompt for subjects with "Custom..." option
- Sanitize custom subject input (trim, lowercase)
- Export TV shows as typed constant array
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Complete

All acceptance criteria have been met:

1. **TV show selection with fuzzy search**: Implemented `filterTVShows()` function with multi-level matching (exact, starts-with, contains, fuzzy)
2. **Subject selection with all 14 options plus custom**: Implemented `promptForSubject()` with select prompt displaying all 14 predefined subjects plus "custom" option
3. **TV shows list**: Created 192 popular shows in alphabetically sorted format in `src/data/tv-shows.ts`
4. **Conditional prompting**: Integrated prompts in `src/index.ts` that only prompt for missing values in interactive mode
5. **Custom subject sanitization**: Implemented `sanitizeCustomSubject()` that trims, lowercases, removes special characters, and normalizes whitespace

## Files Created
- `src/data/tv-shows.ts` - 192 TV shows, alphabetically sorted
- `src/prompts.ts` - Interactive prompt functions with fuzzy search and sanitization
- `src/prompts.test.ts` - 18 unit tests for prompt functionality
- `src/data/tv-shows.test.ts` - 7 unit tests for TV shows data validation

## Files Modified
- `src/constants.ts` - Added 6 new subjects (mood, location, genre, conflict, emotion, symbol)
- `src/index.ts` - Integrated interactive prompts with conditional logic
- `src/validators.test.ts` - Added test for all 14 subjects

## Test Results
- All 40 tests passing
- 873 expect() calls executed successfully
<!-- SECTION:NOTES:END -->
