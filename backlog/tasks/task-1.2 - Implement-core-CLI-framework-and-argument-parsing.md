---
id: task-1.2
title: Implement core CLI framework and argument parsing
status: Done
assignee:
  - Claude
created_date: '2025-10-26 16:31'
updated_date: '2025-10-26 16:55'
labels: []
dependencies: []
parent_task_id: task-1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Create the CLI entry point with argument parsing using commander, including all flags (--model, --show, --subject, --emoji-count, --help, --version). Implement validation logic and mode detection (interactive vs non-interactive).
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 CLI accepts all specified flags: --model, --show, --subject, --emoji-count, -h/--help, -v/--version
- [x] #2 Help command displays usage examples and complete subject list
- [x] #3 Version command displays current version number
- [x] #4 Subject validation ensures only valid values are accepted
- [x] #5 Emoji count validation enforces 1-30 range
- [x] #6 Mode detection correctly identifies interactive vs non-interactive based on provided flags
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Implementation Plan

### 1. Define Valid Subjects (src/constants.ts)
- Export valid subject values: character, relationship, plot, setting, theme, episode, season, overall
- Export default values for CLI options

### 2. Implement Validation Functions (src/validators.ts)
- `validateSubject(value: string)`: ensures value is in allowed subjects list
- `validateEmojiCount(value: string)`: ensures value is number 1-30, returns parsed number
- Both throw errors with helpful messages on validation failure

### 3. Unit Tests (src/__tests__/validators.test.ts)
- Test valid subjects pass validation
- Test invalid subjects throw errors with proper messages
- Test valid emoji counts (1, 15, 30)
- Test invalid emoji counts (0, 31, -5, non-numeric)
- Test edge cases (empty string, whitespace)

### 4. Configure Commander Options (src/index.ts)
- Add --model option (default: "llama3.2")
- Add --show option for TV show name
- Add --subject option with validateSubject parser
- Add --emoji-count option with validateEmojiCount parser (default: 5)
- Enhance help with usage examples and valid subjects list
- Keep existing -v/--version and -h/--help

### 5. Mode Detection Logic (src/index.ts)
- Implement detectMode() function
- Returns 'interactive' if --show OR --subject missing
- Returns 'non-interactive' if both provided
- Add placeholder console logs for different modes

### 6. Testing & Verification
- Run `bun test` to ensure all tests pass
- Manual CLI testing with various argument combinations
- Verify help and version outputs
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Summary

Successfully implemented all CLI framework functionality:

### Files Created:
- src/constants.ts: Valid subjects and default values
- src/validators.ts: Subject and emoji count validation functions
- src/__tests__/validators.test.ts: Comprehensive unit tests (14 tests, all passing)
- Updated src/index.ts: Full commander configuration with all options

### Acceptance Criteria Verified:
1. ✓ All flags working: --model, --show, --subject, --emoji-count, -h/--help, -v/--version
2. ✓ Help displays examples and complete subject list
3. ✓ Version displays 1.0.0
4. ✓ Subject validation with helpful error messages (case-insensitive)
5. ✓ Emoji count validation enforces 1-30 range
6. ✓ Mode detection: interactive (missing args) vs non-interactive (both --show and --subject)

### Testing:
- All 14 unit tests pass
- Manual CLI testing confirms all functionality
- Validation works correctly with helpful error messages
<!-- SECTION:NOTES:END -->
