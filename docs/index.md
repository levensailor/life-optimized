# Household Catch-Up

Household Catch-Up is a public, account-free household checklist. It ships with
33 practical tasks, supports per-section additions and edits, and stores the
complete state in the current browser.

## Run locally

```bash
git clone https://github.com/levensailor/life-optimized.git
cd life-optimized
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy a preview

```bash
npx vercel link
npx vercel env add VERCEL_ORG_ID
npx vercel env add VERCEL_PROJECT_ID
npx vercel
```

The app requires no runtime secrets. Keep `VERCEL_TOKEN` only in a secure
platform secret store when a non-interactive deployment needs it.

Use the navigation to explore the architecture, contribution workflow, and
feature history.
