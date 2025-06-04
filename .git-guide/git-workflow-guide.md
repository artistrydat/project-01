# Git Workflow Guide: Feature Branch Development

## Overview

This guide walks you through creating a feature branch, working on it, and merging it back to the main branch.

## Prerequisites

- Git installed on your machine
- Repository already cloned locally
- Basic understanding of Git commands

## Step 1: Start from Main Branch

Always start by ensuring you're on the main branch and it's up to date.

```bash
# Switch to main branch
git checkout main

# Pull latest changes from remote
git pull origin main
```

## Step 2: Create a New Feature Branch

Create and switch to a new branch for your feature.

```bash
# Create and switch to new branch (replace 'feature-name' with your actual feature name)
git checkout -b feature/user-authentication

# Alternative: Create branch without switching
git branch feature/user-authentication
git checkout feature/user-authentication
```

**Branch Naming Convention:**

- `feature/feature-name` for new features
- `bugfix/bug-description` for bug fixes
- `hotfix/urgent-fix` for urgent fixes

## Step 3: Work on Your Feature

Make your changes, add files, and commit regularly.

```bash
# Check status of your changes
git status

# Add specific files
git add filename.js

# Or add all changed files
git add .

# Commit with descriptive message
git commit -m "Add user login functionality"

# Make more changes and commit as needed
git add .
git commit -m "Add password validation"
```

## Step 4: Keep Your Branch Updated (Optional but Recommended)

Regularly sync with main to avoid conflicts.

```bash
# Switch to main and pull latest changes
git checkout main
git pull origin main

# Switch back to your feature branch
git checkout feature/user-authentication

# Merge main into your feature branch
git merge main
```

## Step 5: Push Your Feature Branch

Push your feature branch to the remote repository.

```bash
# Push feature branch to remote
git push origin feature/user-authentication

# If first time pushing this branch
git push -u origin feature/user-authentication
```

## Step 6: Create a Pull Request (GitHub/GitLab)

1. Go to your repository on GitHub/GitLab
2. Click "New Pull Request" or "Merge Request"
3. Select your feature branch as source and main as target
4. Add title and description
5. Request reviewers if needed
6. Create the pull request

## Step 7: Code Review Process

- Wait for team review
- Address any feedback by making additional commits
- Push changes to the same branch (they'll appear in the PR automatically)

## Step 8: Merge to Main Branch

### Option A: Merge via Web Interface (Recommended)

1. Once approved, click "Merge Pull Request" on GitHub/GitLab
2. Choose merge type (usually "Create a merge commit")
3. Confirm the merge
4. Delete the feature branch when prompted

### Option B: Merge via Command Line

```bash
# Switch to main branch
git checkout main

# Pull latest changes
git pull origin main

# Merge your feature branch
git merge feature/user-authentication

# Push the merged changes
git push origin main
```

## Step 9: Clean Up

After successful merge, clean up your local branches.

```bash
# Switch to main
git checkout main

# Pull the latest changes (including your merged feature)
git pull origin main

# Delete local feature branch
git branch -d feature/user-authentication

# Delete remote feature branch (if not done via web interface)
git push origin --delete feature/user-authentication
```

## Step 10: Verify Everything

```bash
# Check current branch
git branch

# Check recent commits
git log --oneline -5

# Verify your feature is in main
git show main
```

## Common Commands Summary

| Command | Purpose |
|---------|---------|
| `git status` | Check current status |
| `git branch` | List all branches |
| `git checkout -b branch-name` | Create and switch to new branch |
| `git add .` | Stage all changes |
| `git commit -m "message"` | Commit changes |
| `git push origin branch-name` | Push branch to remote |
| `git pull origin main` | Pull latest from main |
| `git merge branch-name` | Merge branch into current branch |

## Best Practices

### Do's ✅

- Always start from updated main branch
- Use descriptive commit messages
- Commit frequently with small, logical changes
- Test your code before pushing
- Keep feature branches focused on single features
- Delete merged branches to keep repository clean

### Don'ts ❌

- Don't work directly on main branch
- Don't commit broken code
- Don't use vague commit messages like "fix stuff"
- Don't let feature branches become too large
- Don't forget to pull latest changes before starting

## Troubleshooting

### Merge Conflicts

If you encounter merge conflicts:

```bash
# After attempting merge, check conflicted files
git status

# Open conflicted files and resolve conflicts manually
# Look for <<<<<<< HEAD and >>>>>>> markers

# After resolving conflicts
git add .
git commit -m "Resolve merge conflicts"
```

### Undo Last Commit (if not pushed)

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Undo last commit and discard changes
git reset --hard HEAD~1
```

### Switch Branches with Uncommitted Changes

```bash
# Stash current changes
git stash

# Switch branches
git checkout other-branch

# Return and restore changes
git checkout feature/user-authentication
git stash pop
```

## Example Workflow

```bash
# 1. Start from main
git checkout main
git pull origin main

# 2. Create feature branch
git checkout -b feature/shopping-cart

# 3. Work and commit
git add src/cart.js
git commit -m "Add shopping cart component"

# 4. Push feature branch
git push -u origin feature/shopping-cart

# 5. Create PR via web interface

# 6. After approval, merge via web interface

# 7. Clean up
git checkout main
git pull origin main
git branch -d feature/shopping-cart
```

Remember: This workflow ensures code quality, enables collaboration, and maintains a clean project history!
