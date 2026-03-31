# TapTrack

A student behavior tracking app for teachers. Add students, record behaviors with timestamps, and visualize patterns with charts. Built with Next.js, React, TypeScript, Tailwind CSS, and Chart.js.

## Technologies

- **[Next.js](https://nextjs.org/)** - React framework (App Router)
- **[React](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Chart.js](https://www.chartjs.org/)** + **[react-chartjs-2](https://react-chartjs-2.js.org/)** - Data visualization
- **[Playwright](https://playwright.dev/)** - End-to-end testing
- **[ESLint](https://eslint.org/)** + **[Prettier](https://prettier.io/)** - Code quality and formatting
- **[Husky](https://typicode.github.io/husky/)** + **[lint-staged](https://github.com/lint-staged/lint-staged)** - Git hooks and pre-commit checks

## Features

- Add, edit, and delete students
- Record behaviors (Refusing work, Off task, Not in assigned space, Interrupting) with date/time
- Behavior history grouped by month with collapsible sections and pagination
- **Charts** — Behavior frequency, behaviors by day of week (stacked), and behaviors by time of day (line chart) with month filtering
- **Import/Export** — Export all data as JSON; import on another device to pick up where you left off
- Alphabetical student sorting and name search
- Local storage persistence

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

```bash
npm install
npm run dev
```

Navigate to `http://localhost:3000`.

## Testing

```bash
npm test
```

## Project Structure

```
app/              # Pages (home, create student, student profile, add/edit behavior)
components/       # UI components (forms, lists, modals, toast, icons)
components/charts # Chart.js chart components
lib/              # Data layer (types, localStorage CRUD, hooks, utilities)
e2e/              # Playwright end-to-end tests
```

## Pre-commit Hooks

This project uses Husky and lint-staged to run checks before commits:

- Prettier (auto-format)
- ESLint (auto-fix)
- Playwright e2e tests

All checks must pass before a commit is allowed.
