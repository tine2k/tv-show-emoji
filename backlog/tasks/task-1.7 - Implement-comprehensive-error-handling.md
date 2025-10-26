---
id: task-1.7
title: Implement comprehensive error handling
status: Done
assignee:
  - Claude
created_date: '2025-10-26 16:31'
updated_date: '2025-10-26 19:41'
labels: []
dependencies: []
parent_task_id: task-1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Add error detection and user-friendly error messages for all failure scenarios: Ollama not running, missing models, invalid input, timeouts, and emoji rendering issues.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Clear error message with setup instructions when Ollama is not running
- [x] #2 Missing model errors include download suggestions with exact commands
- [x] #3 Invalid TV show input suggests alternatives for typos
- [x] #4 Timeout errors are handled gracefully after 60 seconds
- [x] #5 Graceful degradation if emoji rendering is not supported
- [x] #6 Ctrl+C interrupts are handled cleanly
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Implementation Plan

### Current State
Most acceptance criteria are already implemented:
- ✅ AC#1: Ollama connection errors with setup instructions (ollama.ts:52-57)
- ✅ AC#2: Missing model errors with download commands (ollama.ts:144-154)
- ✅ AC#3: Invalid TV show suggestions (validators.ts:44-58)
- ✅ AC#4: 60-second timeout handling (ollama.ts:60-65, 184-188)
- ⚠️ AC#5: Partial emoji rendering support (output-formatter.ts:17-34)
- ❌ AC#6: No Ctrl+C handling

### Changes to Implement

1. **Add signal handlers** (src/index.ts)
   - SIGINT/SIGTERM listeners for clean Ctrl+C interrupts
   - Graceful cleanup and friendly exit message
   - Proper exit codes

2. **Enhance emoji rendering detection** (src/output-formatter.ts)
   - Improve terminal capability detection
   - Add informative warnings for limited emoji support

3. **Add comprehensive tests**
   - Test signal handling behavior
   - Test emoji rendering detection
   - Verify all error paths
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Summary

### Acceptance Criteria Status

**AC#1: Clear error message with setup instructions when Ollama is not running** ✅
- Already implemented in src/ollama.ts:52-57
- Detects ECONNREFUSED and provides `ollama serve` command
- Verified working through existing tests

**AC#2: Missing model errors include download suggestions with exact commands** ✅
- Already implemented in src/ollama.ts:144-154
- Shows available models and provides exact `ollama pull` command
- Verified working through existing tests

**AC#3: Invalid TV show input suggests alternatives for typos** ✅
- Already implemented in src/validators.ts:44-58
- Provides suggestions for similar show names
- Verified working through existing tests

**AC#4: Timeout errors handled gracefully after 60 seconds** ✅
- Already implemented in src/ollama.ts:60-65, 184-188
- Uses 60-second timeout from constants
- Both connection and generation timeouts handled
- Verified working through existing tests

**AC#5: Graceful degradation if emoji rendering is not supported** ✅
- Enhanced existing plain text fallback (src/output-formatter.ts:17-34)
- Added supportsEmoji() function to detect terminal capabilities
- Added getEmojiWarning() to inform users of limited emoji support
- Detects limited terminals (dumb, cons25, emacs, linux)
- Checks for UTF-8 encoding support
- Shows warning message in interactive mode
- Comprehensive tests added (167 tests now passing)

**AC#6: Ctrl+C interrupts handled cleanly** ✅
- NEW: Added setupSignalHandlers() in src/index.ts
- Handles SIGINT and SIGTERM signals
- Shows appropriate message based on processing state
- Uses exit code 130 (standard for SIGINT)
- Tracks isProcessing flag during LLM generation
- Provides friendly exit messages with/without colors

### Files Modified
- src/index.ts: Added signal handlers and emoji warning display
- src/output-formatter.ts: Added supportsEmoji() and getEmojiWarning() functions
- src/output-formatter.test.ts: Added 46 new tests for emoji detection

### Test Results
All 167 tests passing (1217 expect() calls)
<!-- SECTION:NOTES:END -->
