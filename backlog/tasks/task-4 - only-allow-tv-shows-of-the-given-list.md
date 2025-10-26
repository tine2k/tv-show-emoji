---
id: task-4
title: only allow tv shows of the given list
status: Done
assignee: []
created_date: '2025-10-26 19:00'
updated_date: '2025-10-26 19:29'
labels: []
dependencies: []
priority: medium
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Currently, users can enter any TV show name (free text input) via the `promptForShow()` function. This task will restrict the input to only allow TV shows from the predefined list in `src/data/tv-shows.ts`.

The user experience should change from a free-text input to a select/autocomplete interface similar to how the subject selection works, where users can search through and select from the TV_SHOWS list.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Users can only select TV shows from the predefined TV_SHOWS list
- [x] #2 The interface provides autocomplete/filtering functionality to help users find shows quickly
- [x] #3 The fuzzy search functionality from filterTVShows is integrated into the prompt
- [x] #4 Validation ensures only shows from the list can be selected (no custom entries)
- [x] #5 All existing tests pass
- [x] #6 New unit tests are added to verify the selection and filtering behavior
- [x] #7 The CLI works in both interactive and non-interactive modes (--show parameter validates against the list)
- [x] #8 Error messages are clear when a user tries to use an invalid show name via CLI parameters
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Implementation Plan

### 1. Update `promptForShow()` in src/prompts.ts
- Replace the current `input()` prompt with an autocomplete-enabled selection interface
- Use `@inquirer/prompts` autocomplete functionality (may need to check available prompt types)
- Integrate the existing `filterTVShows()` function to provide search/filtering
- Remove the ability to enter custom show names

### 2. Add TV show validation in src/validators.ts
- Create a new `validateTVShow()` function that checks if a show name exists in the TV_SHOWS list
- Use case-insensitive comparison to handle variations
- Return the exact show name from the list (to normalize casing)
- Provide clear error messages for invalid show names

### 3. Update CLI argument validation in src/index.ts
- Apply the `validateTVShow()` validator to the `--show` option in commander
- Ensure that when users provide `--show` via command line, it's validated against the list
- Display helpful error message listing available shows or suggesting similar matches

### 4. Update tests
- Add unit tests for `validateTVShow()` in a new or existing test file
- Test valid show names (exact match, case variations)
- Test invalid show names (not in list)
- Update any existing tests that may be affected by the prompt change
- Run all tests to ensure nothing breaks

### 5. Documentation
- Update help text in CLI to mention that only predefined shows are accepted
- Consider adding a command/flag to list all available shows (optional enhancement)

## Technical Considerations

- The `@inquirer/prompts` library may need to use a different prompt type for autocomplete (check if `autocomplete` from `@inquirer/autocomplete` is available, or use `input` with custom source function)
- The existing `filterTVShows()` function is already well-implemented for fuzzy matching
- Need to ensure the UX is smooth - showing initial list of shows and filtering as user types
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Summary

### Changes Made

1. **Updated promptForShow() in [src/prompts.ts](src/prompts.ts:10-26)**
   - Replaced free-text `input()` prompt with `search()` prompt from @inquirer/prompts
   - Integrated existing `filterTVShows()` function for fuzzy search
   - Shows initial 10 TV shows when no input is provided
   - Dynamically filters as user types

2. **Added validateTVShow() in [src/validators.ts](src/validators.ts:36-63)**
   - Case-insensitive validation against TV_SHOWS list
   - Returns correctly-cased show name from the list
   - Provides helpful suggestions for partial matches (up to 5 similar shows)
   - Clear error message when no similar shows found

3. **Updated CLI in [src/index.ts](src/index.ts:21)**
   - Added `validateTVShow` validator to `--show` option
   - Updated help text to indicate show must be from predefined list

4. **Added comprehensive tests in [src/validators.test.ts](src/validators.test.ts:117-211)**
   - 11 test cases covering:
     - Exact matches
     - Case-insensitive matching
     - Whitespace handling
     - Invalid shows
     - Suggestion system
     - Special characters and apostrophes
     - Shows from different parts of the list

### Testing Results

- All 151 tests pass (including 11 new tests for validateTVShow)
- Non-interactive mode tests:
  - ✅ Valid show: 'Breaking Bad' works
  - ✅ Case-insensitive: 'breaking bad' works
  - ✅ Invalid show: 'Invalid Show' shows error
  - ✅ Partial match: 'Breaking' suggests 'Breaking Bad'
  - ✅ Multiple suggestions: 'star trek' shows all 5 Star Trek shows
  - ✅ Exact match with special chars: 'Star Trek: The Next Generation' works

### User Experience Improvements

1. **Interactive Mode**: Users can now search through 198 TV shows with fuzzy matching instead of typing freely
2. **Non-Interactive Mode**: Clear validation with helpful suggestions when an invalid show is provided
3. **Error Messages**: Context-aware error messages that suggest similar shows or provide help guidance
<!-- SECTION:NOTES:END -->
