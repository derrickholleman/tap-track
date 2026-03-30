# TapTrack

A student behavior tracking app for teachers. Add students, record behaviors with timestamps, and view behavior history on individual student profiles. Built with Next.js 16, React 19, Tailwind CSS, and localStorage persistence.

## Technologies

- **[Next.js](https://nextjs.org/)** - React framework (App Router)
- **[React](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Code quality and formatting
- **[Husky](https://typicode.github.io/husky/)** + **[lint-staged](https://github.com/lint-staged/lint-staged)** - Git hooks and pre-commit checks

## Features

- Add, edit, and delete students
- Record student behaviors (Refusing work, Off task, Not in assigned space, Interrupting)
- Date and time tracking for each behavior
- Filter students by name on the home page
- Student profile pages with behavior history
- Edit and delete individual behaviors
- Delete student with confirmation modal
- Success toast notifications
- Local storage persistence

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000`.

### Build

Build the project for production:

```bash
npm run build
```

## Testing

Run end-to-end tests:

```bash
npm test
```

## Code Quality

Format code:

```bash
npm run format
```

Lint code:

```bash
npm run lint
```

## Project Structure

```
app/
├── page.tsx                              # Home page (student list + filter)
├── layout.tsx                            # Root layout with ToastProvider
├── globals.css                           # Global styles + Tailwind
├── create/
│   └── page.tsx                          # Create student form
└── [studentId]/
    ├── profile/
    │   └── page.tsx                      # Student profile + behavior list
    └── behavior/
        ├── add/
        │   └── page.tsx                  # Add behavior form
        └── [behaviorId]/
            └── edit/
                └── page.tsx              # Edit behavior form

components/
├── behavior-form.tsx                     # Shared form for add/edit behavior
├── behavior-list.tsx                     # Behavior list with edit/delete actions
├── delete-modal.tsx                      # Delete confirmation modal
├── filter-bar.tsx                        # Student search input
├── page-header.tsx                       # Reusable page header with back link
├── student-list.tsx                      # Student name link list
├── toast.tsx                             # Toast notification provider
└── icons/
    └── arrow-left.tsx                    # Back arrow icon

lib/
├── types.ts                              # Student, Behavior, BehaviorType definitions
├── storage.ts                            # localStorage CRUD service
├── use-students.ts                       # React hook wrapping storage with state
└── format-date.ts                        # Date formatting utilities

e2e/                                      # Playwright e2e tests
├── homePage.spec.ts
├── createStudent.spec.ts
├── studentProfile.spec.ts
└── behavior.spec.ts
```

## Pre-commit Hooks

This project uses Husky and lint-staged to run checks before commits:

- Prettier (auto-format)
- ESLint (auto-fix)
- Playwright e2e tests

All checks must pass before a commit is allowed.
