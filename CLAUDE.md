# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlexiStaff is a casual staff management platform for Australian SMEs (≤500 employees). It enables full-time employees to query, book, and manage part-time/casual staff resources with automated scheduling and data analytics.

**Status**: Pre-development (documentation phase complete, awaiting project initialization)

## Tech Stack

- **Frontend**: React 18 + Next.js + TypeScript + Tailwind CSS (Morandi color palette)
- **State**: Zustand (global) + TanStack Query (server)
- **Backend**: Node.js + TypeScript + Prisma ORM + PostgreSQL
- **Auth**: Azure AD / Okta SSO
- **Testing**: Vitest (unit) + Playwright (E2E)

## Commands

```bash
npm run lint          # ESLint
npm run type-check    # TypeScript checking
npm run test          # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright)
npm run format        # Prettier formatting
```

## Code Standards

### Formatting (CRITICAL)
- **Indentation**: Tab only, size 5 (no spaces)
- **File length**: ≤ 1000 lines (MANDATORY - must refactor if exceeded)
- **Function length**: ≤ 50 lines
- **Nesting depth**: ≤ 3 levels
- **Parameters**: ≤ 3 per function

### TypeScript
- All exported values MUST have explicit types
- `any` type is FORBIDDEN (no exceptions without whitelist approval)
- Strict mode enabled

### Naming Conventions
| Element | Convention | Example |
|---------|-----------|---------|
| Variables/Functions | camelCase | `userName`, `getUserById()` |
| Constants | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT` |
| Classes/Interfaces/Types | PascalCase | `UserService`, `BookingData` |
| Files | kebab-case | `user-service.ts` |
| Booleans | is/has/can/should prefix | `isActive`, `hasPermission` |

### Function Verbs
- `get`/`fetch` - retrieve data (sync/async)
- `create`/`update`/`delete` - CRUD operations
- `validate`/`check` - verification
- `calculate`/`format`/`parse` - data transformation
- `handle` - event handlers

## Architecture

### Core Principles
- **SOLID** - Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **KISS** - Keep It Simple
- **DRY** - Don't Repeat Yourself

### Frontend Structure
```
components/
├── ui/           # Base UI components (Button, Input, Modal)
├── features/     # Feature-specific components (BookingForm, StaffCard)
└── layouts/      # Page layouts (MainLayout, DashboardLayout)
```

### Patterns
- Hooks-first React (no class components)
- Platform Adapter pattern for backend services (storage, notifications, payments)
- Dependency injection over hard-coded dependencies
- Composition over inheritance

## Design System

**Morandi Color Palette** (low saturation, elegant):
- Primary: `#7C9CB5` (Morandi Blue)
- Success: `#8FAF9A` (Morandi Green)
- Warning: `#D4A574` (Morandi Orange)
- Error: `#C29A9A` (Morandi Red)
- Text: `#4A4A4A` (primary), `#7A7A7A` (secondary)

See `/design/design-system.md` for complete specifications.

## Git Workflow

**Branch Strategy** (Git Flow):
- `main` - production
- `develop` - development mainline
- `feature/*`, `bugfix/*`, `hotfix/*`, `release/*`

**Commits**: Conventional Commits format
```
<type>(<scope>): <subject>

Types: feat, fix, docs, style, refactor, test, chore
```

## Key Documentation

| Document | Purpose |
|----------|---------|
| `/PRD_landing_page.md` | Product requirements |
| `/design/design-system.md` | Complete design specs |
| `/rules/coding_rules.md` | SOLID/KISS/DRY principles |
| `/rules/coding-standards.md` | Naming, types, code style |
| `/rules/frontend/component.md` | React component patterns |
| `/rules/backend/api-design.md` | RESTful API standards |
