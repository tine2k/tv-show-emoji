
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
