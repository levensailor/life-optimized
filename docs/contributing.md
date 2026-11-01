# Contributing

Create a focused feature branch from current `main`:

```bash
git switch main
git pull --ff-only
git switch -c feature/short-description
npm install
```

Run `npm run lint` and `npm run build`, then verify affected interactions at
phone and desktop widths. Push the branch and open a pull request:

```bash
git push -u origin feature/short-description
gh pr create
```

The pull request must explain why the change belongs in the project, summarize
its user impact, and list automated and manual verification.
