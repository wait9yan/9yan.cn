# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Start: `pnpm start`
- Sync blogs: `pnpm blog:sync`
- Lint: `pnpm lint`
- Lint one file: `pnpm lint -- src/path/to/file.tsx`
- Fix lint: `pnpm lint:fix`
- Format: `pnpm format`
- Check format: `pnpm format:check`
- Type-check: `pnpm type-check`
- Local pre-commit check: `pnpm precommit`

## Key repo facts

- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Jotai, Motion.
- Use `pnpm`, not npm.
- Requires Node.js 20+.
- No test framework is currently configured; use lint + type-check + targeted manual verification.
- `@/*` maps to `src/*`.

## Architecture

- `src/app/layout.tsx` wires global metadata, `globals.css`, and the shared layout.
- Routes are simple App Router pages:
  - `src/app/(home)/page.tsx`
  - `src/app/blog/()/page.tsx`
  - `src/app/blog/[blog]/page.tsx`
  - `src/app/projects/page.tsx`
- `src/layout/index.tsx` is the app shell: nav, animated page container, background, config widget, footer.
- Theme/palette logic lives in `src/layout/ThemeContext.tsx`; it updates `<html>` via `class="dark"` and `data-theme` and persists to `localStorage`.
- Theme tokens live in `src/styles/globals.css`; change palette variables there instead of hardcoding colors in components.
- Config widget UI state is in `src/hooks/use-config.ts`.

## Blog pipeline

- Blog content is loaded from `public/blogs/<slug>/index.md`.
- `pnpm dev` and `pnpm build` both run `scripts/sync-blogs.js` first, which syncs `public/blogs` from the separate git branch `public/blogs`.
- Server-side blog loading is in `src/lib/blog/server.ts`.
- Frontmatter parsing is custom in `src/lib/blog/parser.ts`.
- Missing `summary` and `cover` are derived in `src/lib/blog/helpers.ts`.
- Markdown rendering is split across:
  - `src/lib/markdown-renderer.ts` for HTML + TOC generation
  - `src/hooks/use-markdown-render.tsx` for turning HTML into React nodes with custom image/code block handling
- Main blog UI:
  - `src/components/BlogCard.tsx`
  - `src/components/BlogPreview.tsx`

## Working style for this repo

- Reply to the user in Chinese unless they ask otherwise.
- Keep responses concise.
- Preserve existing style and naming patterns.
- Prefer named exports.
- Prefer server components; add `'use client'` only when needed.
- Use Tailwind and the existing palette system.
- Avoid unnecessary explanatory comments.

## Change hotspots

- Blog rendering changes usually require reading both `src/lib/markdown-renderer.ts` and `src/hooks/use-markdown-render.tsx`.
- Theme changes usually require reading both `src/layout/ThemeContext.tsx` and `src/styles/globals.css`.
- Build/dev startup changes must account for the automatic blog sync step.
