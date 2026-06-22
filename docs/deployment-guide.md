# Deployment Guide — Vercel

## Prerequisites

- A [Vercel account](https://vercel.com) (free tier works)
- The repo pushed to GitHub, GitLab, or Bitbucket

---

## Step 1 — Push to Git

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/<your-org>/philips-cpq.git
git push -u origin main
```

> **Important:** `.gitignore` already excludes `.env*` and `.vercel`. Never commit `.env.local`.

---

## Step 2 — Import Project on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository** → select your repo
3. Vercel auto-detects **Next.js** — no framework configuration needed
4. Leave **Build Command** and **Output Directory** as defaults (`next build` / `.next`)

---

## Step 3 — Configure Environment Variables

**Never put secrets in the repo.** Set them in the Vercel dashboard instead:

1. In your project → **Settings → Environment Variables**
2. Add each variable from `.env.local.example`:

| Variable | Environment |
|---|---|
| `NEXT_PUBLIC_OIDC_AUTHORITY` | Production, Preview, Development |
| `NEXT_PUBLIC_OIDC_CLIENT_ID` | Production, Preview, Development |
| `NEXT_PUBLIC_OIDC_METADATA_URL` | Production, Preview, Development (if needed) |

3. Use **different values per environment**:
   - **Production** → real Conga IDP authority + production redirect URIs
   - **Preview** → staging/test IDP registration with preview redirect URIs

> `NEXT_PUBLIC_` variables are intentionally public (sent to the browser). The OIDC client ID is not a secret — security is enforced by PKCE + redirect URI allowlisting on the IDP side.

---

## Step 4 — Update OIDC Redirect URIs in the IDP

Your Conga IDP app registration must whitelist the Vercel deployment URLs:

```
https://your-project.vercel.app/auth/callback
https://your-project.vercel.app/auth/silent-renew
```

For **Preview deployments** (each PR gets a unique URL), pick one option:

- **Option A:** Whitelist the stable preview alias:
  `https://your-project-git-main-org.vercel.app/auth/callback`
- **Option B:** Use a custom domain (recommended for production)

---

## Step 5 — pnpm on Vercel

Vercel supports pnpm natively. Add a `vercel.json` at the project root:

```json
{
  "installCommand": "pnpm install --frozen-lockfile",
  "buildCommand": "pnpm build"
}
```

Alternatively, configure in **Settings → General → Build & Development Settings**:

| Setting | Value |
|---|---|
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |

---

## Step 6 — Deploy

Click **Deploy**. Vercel runs `pnpm install && pnpm build`. After ~1–2 minutes the app is live at `https://your-project.vercel.app`.

Subsequent pushes to `main` trigger automatic redeployments. PRs get isolated Preview deployments automatically.

---

## Best Practices — Keeping Secrets Safe

| Practice | Details |
|---|---|
| **Never commit `.env.local`** | Already excluded in `.gitignore` via `.env*` |
| **Keep `.env.local.example` in git** | Template with keys but no values — safe to commit |
| **Use Vercel Environment Variables UI** | Single source of truth for all environments |
| **Scope variables by environment** | Separate IDP client registrations for prod vs preview |
| **No secrets in `NEXT_PUBLIC_` vars** | Only public config (authority URL, client ID) — no tokens, no secrets |
| **Server-side secrets** | Use non-`NEXT_PUBLIC_` vars — Vercel keeps them server-only, never exposed to the browser |
| **Rotate on accidental exposure** | If a secret lands in git history, rotate it in the IDP immediately — do not rely on deleting the commit |
