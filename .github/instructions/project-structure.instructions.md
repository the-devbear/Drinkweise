---
description: A guide for React Native/Expo project structure, including directory conventions, naming conventions, and common patterns.
applyTo: src/**
---

# React Native/Expo Project Structure Guide

## Project Overview

This is a React Native/Expo application with Supabase backend integration, following modern development patterns and best practices.

## Key Entry Points

- Main entry: [expo-router/entry](mdc:package.json) (configured in package.json)
- App layout: [src/app/\_layout.tsx](mdc:src/app/_layout.tsx)
- Environment config: [env.js](mdc:env.js)
- Supabase config: [src/lib/supabase.ts](mdc:src/lib/supabase.ts)

## Directory Structure Conventions

### Source Code Organization (`src/`)

- **`app/`**: Expo Router pages and layouts using file-based routing
  - `(auth)/`: Authentication screens
  - `(app)/`: Main app screens with nested navigation
  - `onboarding.tsx`: Onboarding flow
- **`components/`**: Reusable UI components organized by feature
  - `ui/`: Base UI components (Button, Text, etc.)
  - `auth/`: Authentication-related components
  - `shared/`: Shared components across features
  - Feature-specific folders (e.g., `drink-session/`, `profile/`)
- **`lib/`**: Core utilities and configurations
  - `utils/`: Helper functions and utilities
  - `types/`: TypeScript type definitions
  - `storage/`: Local storage utilities
  - `query/`: React Query configurations
- **`store/`**: Redux Toolkit state management
  - Organized by feature (e.g., user, feature-specific slices)
  - Each feature has actions, models, and middleware
- **`providers/`**: React context providers
- **`theme/`**: Design system and theming
- **`api/`**: API service layer
  - Organized by domain (e.g., user, feature-specific services)
  - Follow pattern: interfaces, models, services, errors

### Database and Backend (`supabase/`)

- **`migrations/`**: Database schema migrations
- **`seeds/`**: Seed data for development
- **`config.toml`**: Supabase configuration

## Key Technologies

- **Frontend**: React Native with Expo SDK
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Redux Toolkit with persistence middleware
- **Data Fetching**: TanStack Query (React Query)
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Storage**: MMKV for local storage
- **Forms**: React Hook Form with Zod validation

## Naming Conventions

- **Files**: kebab-case (e.g., `feature-name.service.ts`)
- **Directories**: kebab-case (e.g., `feature-name/`)
- **Components**: PascalCase (e.g., `FeatureNameItem.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useFeatureName`)
- **Types/Interfaces**: PascalCase (e.g., `FeatureNameModel`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_AGE_IN_MILLISECONDS`)

## Import Path Aliases

Configured in [tsconfig.json](mdc:tsconfig.json):

- `@project-name/*` → `./src/*`
- `@project-name/ui/*` → `./src/components/ui/*`
- `@env` → `./src/lib/environment.js`

## Common Patterns

- Feature-based organization in components and store
- Service layer pattern for API interactions
- Type-safe database operations with generated types
- Consistent error handling across the application
- Modular state management with Redux Toolkit slices

