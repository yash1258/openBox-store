# AGENTS.md
Guidance for agentic coding tools in this repository.

## Project Snapshot
- Stack: Next.js 16 App Router, React 19, TypeScript 5, Prisma, PostgreSQL, Tailwind CSS.
- Package manager: npm (`package-lock.json` present).
- Source alias: `@/*` maps to `src/*` (`tsconfig.json`).
- API endpoints: `src/app/api/**/route.ts`.
- Prisma schema: `prisma/schema.prisma`.
- Current state: no dedicated test runner is configured.

## Build, Lint, and Validation Commands
Run from repo root.

### Setup
```bash
npm install
cp .env.example .env.local
npm run db:push
npm run db:seed
```

### Dev and Production
```bash
npm run dev
npm run build
npm run start
```

### Lint
```bash
npm run lint
```

### Database / Prisma
```bash
npm run db:push
npm run db:generate
npm run db:seed
npm run db:studio
```

Also used in docs:
```bash
npx prisma migrate dev
npx prisma generate
npx prisma db pull
```

## Testing Status (Updated ✓)
- **Testing Framework:** Vitest (unit/integration) + Playwright (E2E)
- **Pre-commit:** Husky + lint-staged configured
- **CI/CD:** GitHub Actions workflow in `.github/workflows/ci.yml`

### Test Commands
```bash
npm run test              # Run Vitest in watch mode
npm run test:run          # Run Vitest once (CI)
npm run test:coverage     # Run tests with coverage report
npm run test:e2e          # Run Playwright E2E tests
npm run test:e2e:ui       # Run Playwright with UI
npm run test:all          # Run unit + E2E tests
```

### Quality Gate (CI)
```bash
npm run lint
npm run test:run
npm run build
```

## Running a Single Test

### Lint one file
```bash
npx eslint "src/app/api/orders/route.ts"
```

### Lint a specific scope
```bash
npx eslint "src/app/api/**/*.ts"
npx eslint "src/components/**/*.tsx"
```

### Targeted API verification
```bash
curl http://localhost:3000/api/capabilities
curl "http://localhost:3000/api/products?status=available" -H "x-api-key: dev-api-key-12345"
```

### Data sanity check
```bash
npm run db:studio
```

If a test framework is later added, add `test` scripts and update this file.

## Code Style Guidelines
The repo has style drift; prioritize low-noise diffs and file-local consistency.

### TypeScript and Types
- Use TypeScript for all new code.
- Keep strict typing (`strict: true` is enabled).
- Prefer explicit types for exported APIs and complex return values.
- Prefer `unknown` over `any` and narrow with guards.
- Validate external input with Zod at API/form boundaries.

### Imports
- Prefer `@/` imports for internal modules.
- Keep import order stable:
  1) framework and third-party,
  2) internal alias imports,
  3) relative imports.
- Avoid unrelated import reordering in touched files.

### Formatting
- Follow existing file style (quotes/semicolons are mixed).
- Do not do broad reformat-only changes.
- Keep long JSX props/objects readable with sensible wrapping.

### Naming
- Components/types/interfaces: `PascalCase`.
- Functions/variables/hooks: `camelCase`.
- Constants: `UPPER_SNAKE_CASE` for true constants.
- Next route handlers: uppercase exports (`GET`, `POST`, `PUT`, `DELETE`).

### React / Next.js
- Use Server Components by default.
- Add `"use client"` only when browser APIs/interactivity are needed.
- Keep client components focused on state and UI interactions.
- Use `next/link` for internal navigation.

### API Route Patterns
- Keep handlers thin: parse request, validate input, call lib layer, return structured response.
- Reuse response helpers in `src/lib/api-auth.ts` (`successResponse`, `errorResponse`) when practical.
- Return machine-readable error `code` values.
- Run auth checks early (`requireApiKey` or session checks).

### Error Handling
- Use `try/catch` around async route logic.
- Log server errors with context (`console.error`) but no secrets.
- Return safe, actionable client-facing messages.

### Prisma and Data Access
- Use shared client from `src/lib/prisma.ts`.
- Prefer `Promise.all` for independent queries.
- Keep filters/pagination explicit (`where`, `orderBy`, `skip`, `take`).
- Respect existing schema naming and relation patterns.

### Security and Validation
- Reuse schemas from `src/lib/validation.ts` when possible.
- Preserve rate-limiting behavior on auth-sensitive routes.
- Maintain auth split:
  - API key flow for agent/API usage.
  - Session flow for admin dashboard.
- Never commit secrets or hardcode production credentials.

## Docs and Change Hygiene
- Update docs when changing commands, env vars, or API contracts.
- Keep response envelopes consistent (`success`, `data`, optional `meta`).
- For behavior changes, include manual verification notes in PR descriptions.

## Cursor / Copilot Instructions Status
Checked these locations:
- `.cursor/rules/`
- `.cursorrules`
- `.github/copilot-instructions.md`

Result: none of these files currently exist in this repo.
If they are added later, treat them as higher-priority instructions and revise this file.

## Agent Pre-PR Checklist
```bash
npm run lint
npm run build
```
Then manually verify impacted pages/endpoints before handoff.
