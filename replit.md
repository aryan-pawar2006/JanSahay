# JanSahay AI

Citizen guidance for government-scheme discovery, eligibility explanations, and document preparation.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/jansahay` — React/Vite citizen, guide, assistant, and admin UI
- `artifacts/api-server` — Express endpoints and Clerk middleware
- `lib/api-spec/openapi.yaml` — source of truth for generated client/server validation
- `lib/db/src/schema` — PostgreSQL/Drizzle models
- `README.md` — operating notes, data provenance, and admin access

## Architecture decisions

- Scheme matching is deterministic and reports matched, failed, and unknown conditions separately.
- New checklist entries default to `unknown`; each citizen's status is keyed by canonical document type and reused across schemes.
- Demonstration records are never presented as verified government guidance.
- The assistant uses stored scheme and guide records only; it does not claim live retrieval or an active LLM.
- Admin guide edits invalidate prior verification; only the explicit verification action records a review source and date.

## Product

Citizens can save a minimal profile, compare it with stored scheme conditions, track preparation progress, and open relevant document guides. Administrators maintain guide content and verification status.

## User preferences

- Do not collect Aadhaar numbers, bank account details, or government-portal passwords for scheme matching.
- Make unverified, outdated, and demonstration records explicit; never invent deadlines, fees, eligibility rules, or application procedures.

## Gotchas

- Regenerate API client and Zod schemas after every OpenAPI change.
- The demo guide records have no verified application steps or links; keep the unverified-instructions fallback visible.
- Admin API access requires an admin role in Clerk session metadata or a configured server-side allowlist.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
