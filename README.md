# Trivet

Trivet is an open-source Next.js service that lets Ghost publishers offer “Sign in with Google” for members. The hosted service runs at https://trivet.contraption.co.

## Features

- Google OAuth for blog owners and Ghost members
- Guided onboarding with Ghost Admin API integration
- Member provisioning with “Trivet” labels
- Analytics for new vs returning sign-ins
- Embeddable One Tap script for Ghost Code Injection

## Tech Stack

- Next.js App Router + React 18 + TypeScript
- Postgres + Prisma Migrate
- Tailwind CSS + shadcn/ui + Lucide
- react-hook-form + Zod
- @tanstack/react-query

## Local Development

1. Copy `.env.example` to `.env` and fill in values.
2. Install dependencies:

```bash
pnpm install
```

3. Run migrations and generate Prisma client:

```bash
pnpm prisma:generate
pnpm prisma migrate dev
```

4. Start the dev server:

```bash
pnpm dev
```

## Scripts

- `pnpm check` - TypeScript typecheck
- `pnpm lint` - ESLint
- `pnpm format:check` - Biome formatting check
- `pnpm build` - Next.js production build

## Docker

```bash
docker build -t trivet .
docker run --rm -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  -e GOOGLE_OAUTH_CLIENT_ID=... \
  -e GOOGLE_OAUTH_CLIENT_SECRET=... \
  -e TRIVET_SESSION_SECRET=... \
  trivet
```

The container runs migrations on boot before starting the web server.

## Environment Variables

Required:

- `DATABASE_URL`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `TRIVET_SESSION_SECRET`

Optional:

- `TRIVET_PUBLIC_BASE_URL` (defaults to the request origin)

## License

MIT
