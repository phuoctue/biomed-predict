# Code Quality Setup Guide

## Overview
This project uses `lint-staged` and `prettier` to maintain code quality. Due to Windows compatibility issues with Git hooks, we run linting manually before commits rather than through automatic pre-commit hooks.

## Before Committing

Run this command to format and lint your staged files:

```bash
npm run lint:staged
```

This will:
- Run Prettier on all TypeScript, JavaScript, JSON, Markdown, and CSS files
- Format code according to the project's style guidelines

## If You Want Automatic Formatting

To format all files in the project:

```bash
npm run format
```

## Available Scripts

- `npm run dev` - Start development servers (backend + frontend)
- `npm run build` - Build both backend and frontend
- `npm run lint` - Run ESLint on both apps
- `npm run format` - Format all files with Prettier
- `npm run lint:staged` - Run Prettier on staged files (before commit)

## Notes

- Husky (Git hooks) has been removed due to Windows compatibility issues
- All developers should run `npm run lint:staged` before committing
- CI/CD pipeline can enforce linting checks on the server
