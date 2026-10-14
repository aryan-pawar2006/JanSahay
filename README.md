# JanSahay AI

JanSahay helps citizens compare their profile with stored government-scheme rules, review required documents, and follow state-specific document guidance.

## What works

- Clerk sign-up and sign-in.
- A private citizen profile with only scheme-matching fields. Aadhaar numbers, bank details, and portal passwords are not requested or stored.
- Scheme discovery and eligibility explanations that separate matched, failed, and unknown conditions.
- A document checklist that starts at **Unknown** and stores one status per document type and citizen, even when multiple schemes require the same document.
- State-filtered document guides, preparation dashboard, and stored-information assistant.
- Administrator-only document guide create, update, verify, publish, archive, and scheme-reference flows.

## Data and trust labels

This build uses the project's managed PostgreSQL database through Drizzle. The originally requested MongoDB URI was not provided, so MongoDB/Mongoose is not connected.

Seed records are explicitly labeled **Demonstration** and **Unverified**. Their sample conditions are fictional and exist only to exercise profile matching and document preparation. They are not government scheme eligibility rules or benefit claims. The assistant runs in deterministic stored-guidance mode; it does not claim to be a live AI service or retrieve current government information.

Guides with unverified or outdated instructions are not presented as confirmed procedures. Fees and processing times are hidden from public guide responses unless the guide is verified. The app does not claim that any application will be approved.

## Run and check

Use the Replit workflows for **JanSahay AI** and **API Server**. The workspace is configured with:

- Web app: `artifacts/jansahay`
- Express API: `artifacts/api-server`
- API contract: `lib/api-spec/openapi.yaml`
- PostgreSQL models: `lib/db/src/schema`

Useful commands:

```bash
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/jansahay run typecheck
pnpm --filter @workspace/api-server run test
pnpm --filter @workspace/api-server run build
PORT=23914 BASE_PATH=/ pnpm --filter @workspace/jansahay run build
pnpm run typecheck
```

The API schema is generated from OpenAPI:

```bash
pnpm --filter @workspace/api-spec run codegen
```

## Administrator access

Admin API routes require a signed-in Clerk user with an `admin` role in the session's `publicMetadata` or `metadata`, or a user ID listed in `JANSAHAY_ADMIN_USER_IDS`. For the user-ID allowlist, set the same comma-separated IDs in `VITE_JANSAHAY_ADMIN_USER_IDS` so the client can show the admin navigation; user IDs are not credentials. Keep role assignment restricted to trusted administrators.

Only use the guide verification action after checking the linked official source. It records the source and review date. Editing content clears a guide's prior verified status; outdated or unverified content remains visibly labeled.
