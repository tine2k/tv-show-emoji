
<!-- BACKLOG.MD MCP GUIDELINES START -->

<CRITICAL_INSTRUCTION>

## BACKLOG WORKFLOW INSTRUCTIONS

This project uses Backlog.md MCP for all task and project management activities.

**CRITICAL GUIDANCE**

- If your client supports MCP resources, read `backlog://workflow/overview` to understand when and how to use Backlog for this project.
- If your client only supports tools or the above request fails, call `backlog.get_workflow_overview()` tool to load the tool-oriented overview (it lists the matching guide tools).

- **First time working here?** Read the overview resource IMMEDIATELY to learn the workflow
- **Already familiar?** You should have the overview cached ("## Backlog.md Overview (MCP)")
- **When to read it**: BEFORE creating tasks, or when you're unsure whether to track work

These guides cover:
- Decision framework for when to create tasks
- Search-first workflow to avoid duplicates
- Links to detailed guides for task creation, execution, and completion
- MCP tools reference

You MUST read the overview resource to understand the complete workflow. The information is NOT summarized here.

</CRITICAL_INSTRUCTION>

<!-- BACKLOG.MD MCP GUIDELINES END -->

## GIT WORKTREE AND TASK WORKFLOW

**CRITICAL: Each task must be implemented in its own git worktree**

### Starting a Task

When beginning work on a Backlog task:

1. **Create a dedicated worktree** for the task in a separate directory:
   ```bash
   git worktree add ../tv-show-emoji-task-X.Y task-X.Y
   cd ../tv-show-emoji-task-X.Y
   ```
   - Use the naming convention: `../tv-show-emoji-task-X.Y` where X.Y is the task ID
   - This creates a new branch `task-X.Y` and checks it out in the worktree directory

2. **Work isolation:** All development for the task happens in this dedicated worktree
   - Run tests: `bun test`
   - Run the application: `bun run dev`
   - Make commits as needed during development

### Completing a Task

When finishing a Backlog task:

1. **Ensure all tests pass** in the worktree: `bun test`

2. **Create final commit(s)** that include:
   - All code/documentation changes made for the task
   - The updated task markdown file from the backlog/ directory
   - Clear commit message referencing the task ID

3. **Switch back to main worktree and merge:**
   ```bash
   cd /Users/tine2k/Documents/git/tv-show-emoji
   git merge --no-ff task-X.Y -m "Complete task-X.Y: [Description]

   - [Change 1]
   - [Change 2]

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude <noreply@anthropic.com>"
   ```

4. **Mark task as completed** using MCP tools

5. **Clean up the worktree:**
   ```bash
   git worktree remove ../tv-show-emoji-task-X.Y
   git branch -d task-X.Y
   ```

### Benefits

- **Isolation:** Each task has its own working directory, preventing conflicts
- **Context switching:** Easily switch between tasks without stashing changes
- **Clean history:** Each task results in a clear merge commit
- **Safety:** Main branch remains stable during development

### Example Complete Workflow

```bash
# Start task-1.7
git worktree add ../tv-show-emoji-task-1.7 task-1.7
cd ../tv-show-emoji-task-1.7

# ... implement changes ...
# ... write tests ...
bun test

# Commit changes
git add .
git commit -m "Implement comprehensive error handling"

# Return to main worktree and merge
cd /Users/tine2k/Documents/git/tv-show-emoji
git merge --no-ff task-1.7 -m "Complete task-1.7: Implement comprehensive error handling

- Add error handling for API calls
- Add validation error messages
- Include error recovery strategies

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Clean up
git worktree remove ../tv-show-emoji-task-1.7
git branch -d task-1.7
```

## TESTING REQUIREMENTS

**CRITICAL: All functionality must include unit tests**

When implementing any feature, function, or module:

1. **Write unit tests alongside the implementation** - tests are not optional
2. **Test coverage requirements:**
   - All public functions and methods must have tests
   - Test both happy paths and error cases
   - Include edge cases and boundary conditions
3. **Testing framework:** Use Bun's built-in test runner (`bun test`)
4. **Test file naming:** Use `.test.ts` suffix and place test files in the same directory as the source file
5. **Test organization:** Keep tests next to their source (e.g., `src/validators.ts` → `src/validators.test.ts`)
6. **Run tests before completion:** Always run `bun test` to ensure all tests pass before marking a task as complete

**Example test structure:**
```typescript
import { describe, test, expect } from 'bun:test';
import { validateEmojiCount } from './validators';

describe('validateEmojiCount', () => {
  test('accepts valid count within range', () => {
    expect(validateEmojiCount('5')).toBe(5);
  });

  test('rejects count below minimum', () => {
    expect(() => validateEmojiCount('0')).toThrow();
  });

  test('rejects count above maximum', () => {
    expect(() => validateEmojiCount('31')).toThrow();
  });
});
```

This ensures code quality, prevents regressions, and makes refactoring safer.
