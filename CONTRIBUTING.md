# Contributing

Contributions should keep Household Catch-Up small, accessible, and entirely
browser-based.

## Create a feature branch

1. Fork or clone the repository.
2. Update local `main`.
3. Create a focused branch:

```bash
git switch main
git pull --ff-only
git switch -c feature/short-description
npm install
```

## Make and verify the change

Keep task models typed, avoid hydration-unsafe browser API access, and preserve
the no-account/no-backend architecture.

```bash
npm run lint
npm run build
```

For UI work, verify the affected behavior at phone and desktop widths, including
keyboard focus, persistence after refresh, and dark mode.

## Open a pull request

Push the feature branch and open a pull request against `main`:

```bash
git push -u origin feature/short-description
gh pr create
```

The pull request must explain why the change should be added, summarize the user
impact, and list the checks and manual flows used to verify it. Keep each pull
request focused enough to review and roll back safely.
