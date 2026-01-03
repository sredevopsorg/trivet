<div align="center">
  <a href="https://trivet.contraption.co">
    <img src="public/wordmark.svg" alt="Trivet" width="200">
  </a>
  <br /><br />
</div>

# Trivet

Trivet is an open-source Next.js service that lets Ghost publishers offer “Sign in with Google” for members. Sign up for the free hosted service at [trivet.contraption.co](https://trivet.contraption.co)

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

## Google OAuth Setup

Create an OAuth 2.0 Client ID in Google Cloud Console (Application type: Web).

Authorized JavaScript origins (include every origin where the Google button/One Tap runs):

- `http://localhost:3000`
- `https://trivet.contraption.co` (or your `TRIVET_PUBLIC_BASE_URL`)
- Any Ghost blog origins that will load One Tap with this client ID

Authorized redirect URIs:

- `http://localhost:3000/api/auth/callback`
- `https://trivet.contraption.co/api/auth/callback` (or `${TRIVET_PUBLIC_BASE_URL}/api/auth/callback`)

Use the resulting client ID/secret for `GOOGLE_OAUTH_CLIENT_ID` and `GOOGLE_OAUTH_CLIENT_SECRET` (or enter them in the custom Google setup step for a specific account).

## License

MIT
