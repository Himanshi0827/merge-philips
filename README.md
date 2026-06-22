# Philips CPQ

A Next.js frontend for Conga CPQ. All pages are protected by OIDC authentication against the Conga Identity Provider. Data is fetched from Conga's microservice APIs using the user's Bearer token.

---

## Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| Node.js | 18 or later | |
| pnpm | 9 or later | `npm install -g pnpm` |
| Conga org access | — | You need a `client_id` for the OIDC app registration |

> **Always use `pnpm`** — `npm install` will fail due to peer dependency conflicts in the Conga Design System package.

---

## 1. Clone and install

```bash
git clone <repo-url>
cd philips-cpq
pnpm install
```

---

## 2. Configure environment variables

Create a `.env.local` file in the project root. This file is gitignored and must never be committed.

```bash
# .env.local

# Conga Identity Provider — do not change this URL
NEXT_PUBLIC_OIDC_AUTHORITY=https://login-rls.congacloud.com/api/v1/auth

# Your Conga org's OIDC client ID (UUID) — get this from your Conga admin
NEXT_PUBLIC_OIDC_CLIENT_ID=<your-client-id>

# Conga API base URL for your org
NEXT_PUBLIC_CONGA_API_BASE_URL=https://preview-rls09.congacloud.com

# Optional — sub-path prefix when the app is served from a non-root path
# e.g. set to /custom-ui if the app is at https://your-domain.com/custom-ui
# Leave unset (or empty) for root deployments.
# NEXT_PUBLIC_BASE_PATH=/custom-ui

# Optional — only needed when the discovery doc issuer differs from the authority URL
# NEXT_PUBLIC_OIDC_METADATA_URL=
```

---

## 3. Register the localhost redirect URI with the Conga IDP

OIDC will reject the login callback unless `https://localhost:3000/auth/callback` is registered as an allowed redirect URI in your Conga app registration.

Ask your Conga admin to allowlist:

```
https://localhost:3000/auth/callback
https://localhost:3000/auth/silent-renew
```

If you set `NEXT_PUBLIC_BASE_PATH` (e.g. `/custom-ui`), register the prefixed URIs instead:

```
https://localhost:3000/custom-ui/auth/callback
https://localhost:3000/custom-ui/auth/silent-renew
```

---

## 4. Start the development server

```bash
pnpm dev
```

The dev server starts on **HTTPS** at `https://localhost:3000`. HTTPS is required because the Conga IDP only issues tokens to HTTPS redirect URIs — the `--experimental-https` flag is already configured in `package.json`.

If `NEXT_PUBLIC_BASE_PATH` is set, the app is served at `https://localhost:3000<base-path>` — navigating to the root will return a 404.

### Debugging with F5

The VS Code `launch.json` configurations use `${env:NEXT_PUBLIC_BASE_PATH}` to open the correct URL. Because VS Code resolves `${env:…}` from the **system/shell environment** (not from `.env.local`), you must also export the variable in your shell before launching:

```powershell
$env:NEXT_PUBLIC_BASE_PATH = "/custom-ui"
```

Add it to your PowerShell profile to make it permanent. Leave it unset (or set to an empty string) for root deployments.

On first run, Next.js generates a self-signed certificate. Your browser will show a security warning — proceed past it (safe for local dev). The generated certificate files are stored in `certificates/`.

> **Port conflict:** If port 3000 is already in use, Next.js picks a different port and the IDP will reject the redirect URI. Kill the stale process and restart rather than accepting an alternate port.

---

## 5. Open a quote

Navigate to:

```
https://localhost:3000/quote-details/<quoteId>?flowName=<flowName>
```

| URL parameter | Required | Default | Description |
|---|---|---|---|
| `quoteId` | ✅ | — | The Conga quote/proposal ID |
| `flowName` | ❌ | `system` | The revenue flow name used for settings |

You will be redirected to the Conga login page automatically if you have no active session. After login you are returned to this URL.

---

## Available scripts

```bash
pnpm dev          # Start HTTPS dev server at https://localhost:3000
pnpm build        # Production build
pnpm start        # Start the production server (run after pnpm build)
pnpm lint         # ESLint
npx tsc --noEmit  # TypeScript type-check (no output = clean)
```

---

## How the API proxy works

All Conga API calls go through a rewrite rule defined in `next.config.ts`:

```
Browser → /conga/api/... → Next.js server → https://<CONGA_API_BASE_URL>/api/...
```

This keeps requests same-origin from the browser's perspective, avoiding CORS restrictions. You do **not** need to configure anything — it works automatically as long as `NEXT_PUBLIC_CONGA_API_BASE_URL` is set.

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx                  # Root layout — wraps all pages with <AuthProvider>
│   ├── page.tsx                    # Home / landing page
│   ├── login/page.tsx              # Triggers OIDC redirect
│   ├── auth/
│   │   ├── callback/page.tsx       # OIDC callback handler
│   │   └── silent-renew/page.tsx   # Silent token renewal
│   ├── quotes/page.tsx             # Proposals/quotes list page
│   └── quote-details/
│       └── [quoteId]/page.tsx      # Quote details page
├── components/
│   ├── auth-guard.tsx              # Redirects unauthenticated users to login
│   └── ui/                         # Shared UI components
├── lib/
│   ├── auth/                       # OIDC configuration and React context
│   ├── api/
│   │   ├── client.ts               # Axios factory — clientWithToken()
│   │   ├── endpoints.ts            # All API endpoint paths (single source of truth)
│   │   ├── services/               # One file per Conga API domain
│   │   └── types/                  # TypeScript interfaces per domain
│   └── layouts/                    # Field layout config for each object type
```

---

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `invalid_redirect_uri` from IDP | `localhost:3000` not in IDP allowlist, or dev server started on a different port | Register the URI with your Conga admin; kill any stale process on port 3000 |
| Browser certificate warning | Self-signed cert generated by `--experimental-https` | Click through the warning in your browser (safe for local dev only) |
| `npm install` peer dep errors | Wrong package manager | Use `pnpm install` |
| Blank page / infinite redirect | Missing or wrong env vars | Double-check `.env.local` values and restart the server |
| Fields show "Not available" | Field name not found in metadata | Check field name transformation rules in `AGENTS.md` |
| API returns 401 | Token expired or wrong `client_id` | Sign out and sign back in; verify `NEXT_PUBLIC_OIDC_CLIENT_ID` |
| F5 opens `https://localhost:3000` instead of the base path | `NEXT_PUBLIC_BASE_PATH` not set in shell/system env | Run `$env:NEXT_PUBLIC_BASE_PATH = "/custom-ui"` in your terminal before pressing F5 |
| 404 on root URL when base path is set | App is served under the sub-path, not at root | Navigate to `https://localhost:3000<base-path>` (e.g. `/custom-ui`) |

---

## Deployment

See [docs/deployment-guide.md](docs/deployment-guide.md) for instructions on deploying to Vercel.
