# life (optimized)

## Project configuration

- Source control: GitHub, public repository. Create it with `gh repo create`, push `main`, and use GitHub Actions for CI. Authenticate with the existing `gh` CLI login (levensailor).
- Authentication: none. Every page is public.
- Target: Vercel, framework preset FastAPI, functions in iad1. Link with `vercel link`, set env vars with `vercel env add`, and deploy previews per branch. Use VERCEL_TOKEN only for non-interactive deploys.
- Stack: Python (Python 3.12+, dependencies managed with uv.); FastAPI (Async HTTP API with automatic OpenAPI docs; served by Uvicorn.); NodeJS (Node 22 LTS runtime for JavaScript services and tooling.); Supabase (Hosted Postgres with auth, storage, and row-level security.); Tailwind CSS (Utility-first styling; theme tokens in the config.)
- Logging (Python `logging` module, one handler per destination on the root logger; timestamps in America/New_York):
  - File `logs/app.log`: RotatingFileHandler maxBytes=1048576 backupCount=3, level INFO, format Text (EST, file:line, function).
  - Stdout: StreamHandler(sys.stdout), level INFO, format Text (EST, file:line, function).
- Documentation files: README.md, CONTRIBUTING.md, CHANGELOG.md, ARCHITECTURE.md.
- Docs delivered as: Markdown.
- Draw application flows and architecture in Mermaid.
- Publish a docs site with Read the Docs.
- Secrets and settings are provided in a gitignored `.env` (never hardcode or commit them; read them with python-dotenv or the platform's env store): `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
- Never hardcode names; use configuration. Commit and push after each change.

## UI design

**Bento Box** — modular tiles of different sizes, like a bento lunch box.

- **Palette:** Background #F5F5F7 (dark: #0B0B0F); tiles #FFFFFF (dark: #1C1C22); text #111111; one accent #6E56CF; give one hero tile a gradient (#6E56CF → #E5484D).
- **Typography:** 'Geist', 'Inter', system-ui. Big numbers and headlines 32–56 px weight 700; captions 12–13 px weight 500 in #6B7280.
- **Layout:** CSS grid with 4–6 columns and dense packing; tiles span 1×1, 2×1, 2×2. Gap 12–16 px; tile padding 20–24 px. Each tile holds exactly one idea or metric.
- **Shapes and shadows:** Radius 20–28 px on tiles, 12 px inside. Shadow 0 1px 2px rgba(0,0,0,.06), 0 8px 24px rgba(0,0,0,.06). 1 px hairline borders in dark mode.
- **Motion:** Tiles fade-and-rise on load (opacity 0→1, translateY 8px→0, 300 ms, 40 ms stagger). Hover scales 1.02 with ease-out 200 ms.

Density: Compact.
Generate a custom favicon that matches the theme and the app's purpose.

## Instructions

## Implement the application

- If the repository already contains an app, follow its existing Next.js conventions. Otherwise create a lightweight Next.js app using TypeScript and Tailwind CSS.
- Do not add accounts, a database, Supabase, FastAPI endpoints, Node HTTP services, or other external services. The checklist must run entirely in the browser.
- Use Tailwind CSS theme variables in the global stylesheet (for example, `@import "tailwindcss";` and `@theme`) for the specified palette and typography.
- Create a custom favicon matching the household-checklist purpose and Bento Box visual theme.

## Build the checklist UI

- Set the page title and visible heading to `Household Catch-Up`.
- Implement the Bento Box design:
  - Responsive CSS grid with 4–6 columns on larger screens, dense packing, 12–16 px gaps, and tiles that span 1×1, 2×1, or 2×2.
  - Use `#F5F5F7` page background, white tiles, `#111111` text, `#6E56CF` accent, and one hero tile with a `#6E56CF` to `#E5484D` gradient.
  - Support dark mode with `#0B0B0F` background, `#1C1C22` tiles, and 1 px hairline tile borders.
  - Use Geist, Inter, and system UI fallbacks. Headlines and large metrics use 32–56 px, weight 700; captions use 12–13 px, weight 500, `#6B7280`.
  - Give tiles 20–28 px radius, 20–24 px padding, the specified subtle shadows, and one idea or metric per tile.
  - Animate tiles on load from 8 px below at 0 opacity to their final position over 300 ms, staggered by 40 ms. Scale tiles to 1.02 on hover over 200 ms with ease-out.
- Make the interface compact, calm, readable, and usable on both phones and desktops.
- Use semantic controls with accessible labels, visible keyboard focus, and adequate contrast.

## Checklist behavior

- Render the following section headers, each with its supplied tasks:
  - Kitchen
    - Clean out the fridge; toss expired food and wipe shelves
    - Check pantry and freezer for forgotten or expired food
    - Make a grocery list, checking staples and seasonings
    - Clean the microwave, stovetop, and backsplash
    - Wipe cabinet fronts and handles
    - Mop the floor
    - Clean trash and recycling bins
  - Bathroom
    - Scrub the toilet, sink, tub, and shower
    - Clean mirrors and wipe shelves
    - Remove buildup from faucets and showerheads
    - Wash bath mats and shower curtain or liner
    - Sort toiletries and clear out empty or expired products
    - Restock toilet paper, soap, and cleaning supplies
  - Bedroom and wardrobe
    - Clear out clothes that no longer fit or get worn
    - Put donations in a bag and arrange a drop-off
    - Put away seasonal clothes and shoes
    - Clear bedside tables and dresser tops
    - Wash bedding extras: mattress protector, duvet cover, and throws
    - Vacuum under the bed and behind furniture
  - Living spaces
    - Dust shelves, lamps, ceiling fans, and baseboards
    - Vacuum sofa cushions and underneath them
    - Clean under rugs and moveable furniture
    - Wipe frequently touched switches, handles, and remotes
    - Clean windowsills and obvious window smudges
    - Tidy the entryway and sort shoes, bags, and coats
  - Forgotten corners and household upkeep
    - Sort accumulated mail, receipts, and paperwork
    - Clear out one junk drawer or cluttered cupboard
    - Check household supplies and make a restocking list
    - Replace or clean air filters as needed
    - Test smoke and carbon monoxide alarms
    - Check for leaks under sinks
    - Gather batteries, bulbs, and electronics needing proper disposal
    - Make a short list of repairs that have been put off
- Give every task a checkbox. Completed tasks must use muted, struck-through text.
- Show an overall progress metric in the exact format: `X of Y complete.`
- Within each section, allow users to add tasks, edit task text, and delete tasks.
- Provide a control to hide or show completed tasks.
- Provide a `Reset checkboxes` control that displays a confirmation dialog before unchecking every task. It must preserve added, edited, and deleted tasks.

## Persist checklist state safely

- Define typed section and task models in TypeScript, including stable task identifiers and completion state.
- Store the complete checklist state in `localStorage`.
- Use the seed data only when no saved checklist exists; never overwrite a saved checklist on refresh.
- Account for Next.js server rendering: read `localStorage` only in client-side code after mounting, and render a safe loading or initial state that avoids hydration mismatches.
- Handle unavailable, malformed, or invalid stored data gracefully by falling back to the seed checklist without crashing.

## Verify and document

- Run the project’s production build successfully.
- Manually verify:
  - Seed tasks render on a first visit.
  - Checkbox changes, additions, edits, deletions, and the completed-task visibility setting survive a refresh.
  - Reset confirmation preserves task content while clearing completion states.
  - The progress text updates correctly.
  - The layout is usable at phone and desktop widths.
- Update the project documentation with concise commands for local development and Vercel deployment, including `vercel link`, configuring required environment values with `vercel env add`, and branch preview deployments.

## Reference context

_Added by Optimize: API documentation and example code for this project's configuration._

### Python project with uv

Docs: [uv docs](https://docs.astral.sh/uv/)

```bash
uv init app && cd app
uv add fastapi uvicorn pydantic python-dotenv
uv run uvicorn main:app --reload
```

### FastAPI endpoint with Pydantic validation

Docs: [FastAPI tutorial](https://fastapi.tiangolo.com/tutorial/) · [Request body](https://fastapi.tiangolo.com/tutorial/body/)

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI()

class ItemIn(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    price: float = Field(gt=0)

class ItemOut(ItemIn):
    id: int

ITEMS: dict[int, ItemOut] = {}

@app.post("/items", response_model=ItemOut, status_code=201)
def create_item(item: ItemIn) -> ItemOut:
    created = ItemOut(id=len(ITEMS) + 1, **item.model_dump())
    ITEMS[created.id] = created
    return created

@app.get("/items/{item_id}", response_model=ItemOut)
def read_item(item_id: int) -> ItemOut:
    if item_id not in ITEMS:
        raise HTTPException(404, "Item not found")
    return ITEMS[item_id]
```

### Node HTTP server

Docs: [Node.js docs](https://nodejs.org/docs/latest/api/)

```js
import { createServer } from "node:http";

createServer((req, res) => {
  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: true }));
}).listen(process.env.PORT ?? 3000);
```

### Supabase Python client

Docs: [supabase-py](https://supabase.com/docs/reference/python/introduction) · [Row level security](https://supabase.com/docs/guides/database/postgres/row-level-security)

```python
import os
from supabase import create_client

supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_KEY"])
rows = supabase.table("notes").select("*").eq("owner", user_id).execute().data
```

### Tailwind theme tokens

Docs: [Theme variables](https://tailwindcss.com/docs/theme)

```css
@import "tailwindcss";

@theme {
  --color-accent: #ffdc00;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

### FastAPI on Vercel

Docs: [Vercel Python runtime](https://vercel.com/docs/functions/runtimes/python) · [vercel env](https://vercel.com/docs/cli/env)

```json
// vercel.json — app object exported from api/index.py
{
  "rewrites": [{ "source": "/(.*)", "destination": "/api/index" }]
}
```

### Rotating file handler with EST timestamps

Docs: [RotatingFileHandler](https://docs.python.org/3/library/logging.handlers.html#rotatingfilehandler)

```python
import logging, time
from datetime import datetime
from logging.handlers import RotatingFileHandler
from zoneinfo import ZoneInfo

class EstFormatter(logging.Formatter):
    def formatTime(self, record, datefmt=None):
        return datetime.fromtimestamp(record.created, ZoneInfo("America/New_York")).isoformat(timespec="milliseconds")

handler = RotatingFileHandler("logs/app.log", maxBytes=1_048_576, backupCount=3)
handler.setFormatter(EstFormatter("%(asctime)s [%(levelname)s] %(filename)s:%(lineno)d %(funcName)s - %(message)s"))
logging.getLogger().addHandler(handler)
```

### Stdout handler

Docs: [StreamHandler](https://docs.python.org/3/library/logging.handlers.html#streamhandler)

```python
import logging, sys

console = logging.StreamHandler(sys.stdout)
console.setLevel(logging.INFO)
logging.getLogger().addHandler(console)
```
