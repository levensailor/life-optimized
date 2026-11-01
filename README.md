# Household Catch-Up
**Clear the chores that quietly pile up—with a calm checklist that remembers where you stopped.**
```bash
npm install && npm run dev
```

Household Catch-Up is a public, account-free checklist for kitchen, bathroom,
bedroom, living-space, and household-upkeep tasks. All checklist data stays in
the current browser through `localStorage`.

## What it does

| Feature | Value |
| --- | --- |
| Complete starter list | 33 practical household catch-up tasks |
| Editable sections | Add, rename, or remove tasks in every room |
| Durable progress | Checkboxes and preferences survive refreshes |
| Focus mode | Hide completed work without deleting it |
| Safe reset | Clear completion states while preserving task changes |
| Responsive Bento UI | Compact layouts for phones and desktops, with dark mode |

## Quick Start

Requires Node.js 22 or newer.

```bash
git clone https://github.com/levensailor/life-optimized.git
cd life-optimized
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality checks

```bash
npm run lint
npm run build
```

GitHub Actions runs both checks on pushes and pull requests to `main`.

## Deploy to Vercel

The app uses the Next.js preset and requires no runtime secrets. The supplied
Vercel account settings can still be linked non-interactively:

```bash
npx vercel link
npx vercel env add VERCEL_ORG_ID
npx vercel env add VERCEL_PROJECT_ID
npx vercel
```

`npx vercel` creates a branch preview. Merge or push to `main` to create a
production deployment after the GitHub repository is connected in Vercel.
`VERCEL_TOKEN` should only be passed to non-interactive CLI or CI operations;
never expose it to browser code.

## Public links

- [Source repository](https://github.com/levensailor/life-optimized)
- Production URL: added after the first successful Vercel deployment
- Read the Docs URL: added after the documentation project is imported

## Documentation

- [Architecture](ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)
- [Feature history](CHANGELOG.md)

The `mkdocs.yml` and `.readthedocs.yaml` files configure the Markdown
documentation site for Read the Docs.

## Author

[![Built by levensailor](https://img.shields.io/badge/built%20by-levensailor-6E56CF?style=for-the-badge)](https://github.com/levensailor)

## Privacy

There are no accounts, analytics, APIs, or databases. Task content and progress
remain in the browser's local storage unless the user clears site data.
