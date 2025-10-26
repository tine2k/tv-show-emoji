
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

## GIT COMMIT WORKFLOW

**CRITICAL: Whenever you complete a Backlog task:**

1. Mark the task as completed using the MCP tools
2. Create a git commit that includes:
   - All code/documentation changes made for the task
   - The updated task markdown file from the backlog/ directory
3. Use a clear commit message that references the task ID and describes what was accomplished

**Example:**
```bash
git add src/ backlog/tasks/task-1.1*.md
git commit -m "Complete task-1.1: Set up project infrastructure

- Initialize TypeScript/Bun project
- Install dependencies (inquirer, chalk, ora, commander, ollama)
- Configure build for single executable
- Add dev and build scripts

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

This ensures that task progress and code changes are synchronized in version control.

## TESTING REQUIREMENTS

**CRITICAL: All functionality must include unit tests**

When implementing any feature, function, or module:

1. **Write unit tests alongside the implementation** - tests are not optional
2. **Test coverage requirements:**
   - All public functions and methods must have tests
   - Test both happy paths and error cases
   - Include edge cases and boundary conditions
3. **Testing framework:** Use Bun's built-in test runner (`bun test`)
4. **Test file naming:** Place tests in `__tests__/` directories or use `.test.ts` suffix
5. **Test organization:** Mirror the source structure (e.g., `src/validators.ts` → `src/__tests__/validators.test.ts`)
6. **Run tests before completion:** Always run `bun test` to ensure all tests pass before marking a task as complete

**Example test structure:**
```typescript
import { describe, test, expect } from 'bun:test';
import { validateEmojiCount } from '../validators';

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
