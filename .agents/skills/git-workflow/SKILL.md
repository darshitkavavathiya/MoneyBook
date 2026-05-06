---
name: git-workflow
description: Standardized Git workflow for creating feature branches, committing code, and syncing the "Holy Trinity" of branches (develop, preview, master).
---

# Git Workflow Skill

This skill provides a standardized set of Git operations to streamline your development process, ensuring consistency across feature branches and reliable syncing across your environment branches (develop, preview, master).

## 1. New Branch Creation & Commit

**Shortcuts/Triggers:** 
- Type **`1`** or **`/branch`** (e.g., `1 add reports page`)
- "Create a new branch", "Commit this to a new branch"

**Workflow:**
1. **Determine Base Branch:** Ensure you are starting from the main development branch by default (`develop`).
   `git checkout develop`
   `git pull origin develop`
2. **Determine Branch Name:** Generate a semantic and descriptive branch name based on the task (e.g., `feat/user-auth`, `fix/navbar-alignment`, `refactor/api-routes`).
3. **Create Branch:** Create and switch to the new branch.
   `git checkout -b <branch_name>`
4. **Stage and Commit:** If there are uncommitted changes you wish to include, stage and commit them with a descriptive, conventional commit message.
   `git add .`
   `git commit -m "<type>: <brief description>"`
5. **Push:** (Optional, if the user wants to push immediately)
   `git push -u origin <branch_name>`

## 2. Syncing the "Holy Trinity" (Develop -> Preview -> Master)

**Shortcuts/Triggers:** 
- Type **`2`** or **`/sync`**
- "Sync holy trinity", "Sync branches", "Deploy to all branches"

**Workflow:**
This operation synchronizes your environment branches in a structured progression. Always ensure the starting branch (usually a feature branch or `develop`) is fully committed.

1. **Update Develop:** Bring `develop` up to date and push any new changes.
   `git checkout develop`
   `git pull origin develop`
   *(Merge your feature branch into develop here if not already done: `git merge <feature_branch>`)*
   `git push origin develop`

2. **Update Preview (Staging):** Merge `develop` into `preview` to prepare for staging/testing.
   `git checkout preview`
   `git pull origin preview`
   `git merge develop`
   `git push origin preview`

3. **Update Master (Production):** Merge `preview` into `master` for production deployment.
   `git checkout master`
   `git pull origin master`
   `git merge preview`
   `git push origin master`

4. **Return to Develop:** To continue working, return to the main development branch.
   `git checkout develop`

## 3. Best Practices & Preferences

As an AI agent, I will adhere to the following preferred best practices when executing these workflows:
- **Conventional Commits:** I will always use conventional commit prefixes (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`) to maintain a clean and readable history.
- **Pre-flight Checks:** I will run `git status` before checking out or merging branches to ensure a clean working tree and prevent merge conflicts from uncommitted work.
- **Safety First:** If a merge conflict occurs during syncing, I will immediately halt the process and inform you so we can resolve the conflicts safely before proceeding.
- **Traceability:** For syncing the environment branches, standard `merge` operations are preferred to preserve the exact history of when features were promoted between environments.
