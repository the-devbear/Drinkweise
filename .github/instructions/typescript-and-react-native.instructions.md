---
description: TypeScript and React Native development patterns for building scalable and maintainable applications.
applyTo: **/*.ts,**/*.tsx
---

# TypeScript and React Native Development Patterns

## TypeScript Configuration

- Strict mode enabled in [tsconfig.json](mdc:tsconfig.json)
- Use TypeScript for all code files
- Prefer interfaces over types for object shapes
- Use proper type imports from [src/lib/types/](mdc:src/lib/types/)

## Component Patterns

- Use functional components with TypeScript interfaces
- Export components as named exports
- Use proper prop interfaces with optional properties where needed
- Follow the pattern: exported component, subcomponents, helpers, static content, types

## State Management

- Use Redux Toolkit for global state (see [src/store/](mdc:src/store/))
- Use React Query for server state management
- Use MMKV for local storage persistence
- Follow the slice pattern: actions, models, middleware

## API Integration

- Use Supabase client from [src/lib/supabase.ts](mdc:src/lib/supabase.ts)
- Create typed service files in [src/api/](mdc:src/api/)
- Use React Query for data fetching with proper caching
- Handle errors gracefully with proper error boundaries

## Navigation

- Use Expo Router for file-based routing
- Follow the routing structure in [src/app/](mdc:src/app/)
- Use proper TypeScript for route parameters

## Styling

- Use NativeWind (Tailwind CSS) for styling
- Import global styles from [global.css](mdc:global.css)
- Use proper className patterns for responsive design
- Follow the theme configuration in [src/theme/](mdc:src/theme/)

## Error Handling

- Use Zod for runtime validation
- Implement proper error boundaries
- Use early returns for error conditions
- Avoid deeply nested if statements

## Performance

- Use React.memo for expensive components
- Use useMemo and useCallback appropriately
- Implement proper list virtualization with FlashList
- Use React Query's built-in caching mechanisms

## Common Patterns

- Feature-based component organization
- Service layer for API interactions
- Type-safe database operations
- Consistent error handling patterns
- Modular state management

## Common Patterns

- Feature-based component organization
- Service layer for API interactions
- Type-safe database operations
- Consistent error handling patterns
- Modular state management
