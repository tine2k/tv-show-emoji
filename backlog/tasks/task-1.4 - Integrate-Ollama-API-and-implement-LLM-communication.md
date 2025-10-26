---
id: task-1.4
title: Integrate Ollama API and implement LLM communication
status: Done
assignee:
  - Claude
created_date: '2025-10-26 16:31'
updated_date: '2025-10-26 18:46'
labels: []
dependencies: []
parent_task_id: task-1
priority: high
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Implement Ollama connection validation, model availability checking, and API communication for generating emoji recommendations. Handle model selection with defaults and fallbacks.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Tool validates Ollama is running at http://localhost:11434
- [x] #2 Model availability is checked before prompting user
- [x] #3 Default model is llama3.2:latest with fallback support
- [x] #4 LLM requests include 60-second timeout
- [x] #5 API integration uses official Ollama TypeScript SDK
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
## Implementation Plan

### Files to Create/Modify

1. **New file: src/ollama.ts** - Core Ollama integration module
2. **New file: src/ollama.test.ts** - Unit tests for Ollama integration
3. **Modify: src/constants.ts** - Add Ollama-related constants
4. **Modify: src/index.ts** - Integrate Ollama validation into main flow

### Implementation Steps

#### Step 1: Add Ollama constants to src/constants.ts
- Add OLLAMA_BASE_URL = 'http://localhost:11434'
- Add OLLAMA_TIMEOUT = 60000 (60 seconds)
- Update DEFAULT_MODEL = 'llama3.2:latest' (add :latest tag)
- Add FALLBACK_MODELS array

#### Step 2: Create Ollama integration module (src/ollama.ts)
Functions:
- initOllamaClient() - Initialize Ollama SDK client
- validateOllamaConnection() - Check if Ollama is running
- checkModelAvailability(modelName) - Verify model exists
- getAvailableModels() - Fetch all available models
- findBestAvailableModel(requestedModel) - Try requested model, fall back to alternatives

#### Step 3: Write comprehensive unit tests (src/ollama.test.ts)
- Connection validation (success/failure)
- Model availability checks
- Timeout handling
- Fallback model logic
- Use mocking to avoid Ollama dependency

#### Step 4: Integrate into main application (src/index.ts)
- Validate Ollama connection before processing
- Check model availability with fallback
- Display helpful error messages

#### Step 5: Run tests and verify
- Execute bun test
- Verify all acceptance criteria met

### Acceptance Criteria Mapping
- AC #1: validateOllamaConnection()
- AC #2: checkModelAvailability() + main integration
- AC #3: Constants + findBestAvailableModel()
- AC #4: OLLAMA_TIMEOUT constant + client config
- AC #5: Use official ollama package
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
## Implementation Completed

### Files Created:
1. **src/ollama.ts** - Core Ollama integration module with:
   - initOllamaClient() - Initializes Ollama SDK client
   - validateOllamaConnection() - Validates Ollama is running
   - getAvailableModels() - Fetches list of available models
   - checkModelAvailability() - Checks if specific model exists
   - findBestAvailableModel() - Tries requested model, falls back to alternatives
   - generateCompletion() - Generates LLM completions with timeout
   - OllamaError class for custom error handling

2. **src/ollama.test.ts** - Comprehensive unit tests (28 test cases)
   - All connection validation scenarios
   - Model availability checking
   - Fallback logic
   - Timeout handling
   - Error cases with helpful messages

### Files Modified:
1. **src/constants.ts** - Added:
   - OLLAMA_BASE_URL = 'http://localhost:11434'
   - OLLAMA_TIMEOUT = 60000 (60 seconds)
   - Updated DEFAULT_MODEL to 'llama3.2:latest'
   - FALLBACK_MODELS array

2. **src/constants.test.ts** - Added tests for new Ollama constants

3. **src/index.ts** - Integrated Ollama validation:
   - Validates connection before processing
   - Checks model availability with fallback
   - Displays helpful error messages with actionable instructions
   - Shows which model will be used (warns if fallback used)

### Test Results:
✓ All 80 tests passing
✓ 946 expect() calls successful

### Key Features:
- Proper error handling with actionable messages (e.g., 'ollama serve', 'ollama pull')
- 60-second timeout on all requests
- Automatic fallback to alternative models
- Model name normalization (handles :latest tag)
- Comprehensive test coverage with mocking
<!-- SECTION:NOTES:END -->
