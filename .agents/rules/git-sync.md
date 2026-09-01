# Git Sync for Brain & Skills

## Overview
This rule enforces that all AI-generated project management artifacts (the "brain") and agent customizations ("skills") are continuously synced to the project's Git repository.

## Rules
1. **Continuous Tracking**: Whenever you generate or update a project artifact (such as `implementation_plan.md`, `task.md`, or `walkthrough.md`) in your working context (brain), you MUST immediately copy those files to the `.agents/plans/` directory in the project root.
2. **Git Commit**: After any significant progress, feature completion, or artifact sync (including changes to `.agents/skills` or `.agents/rules`), you MUST execute `git add` and `git commit` to store these changes in the project repository. 
3. **Commit Messages**: Use clear, descriptive commit messages describing what features were added or which artifacts were updated.

By following this, the project's "brain" and "skills" are permanently versioned alongside the source code.
