## TinyLink

TinyLink is a Bitly-style SaaS demo that shortens long URLs, tracks click statistics, and lets you manage every link from a clean dashboard. It is built as a full-stack take-home assignment using **Next.js 16**, **TailwindCSS**, **Prisma**, and **Neon PostgreSQL**, then deployable to **Vercel**.

### Stack

| Layer        | Tech                                             |
| ------------ | ------------------------------------------------ |
| Framework    | Next.js (App Router, Server Actions)             |
| Styling      | TailwindCSS 3 + custom components                |
| Data         | Prisma ORM + Neon PostgreSQL                     |
| Deployment   | Vercel (recommended)                             |

### Features

- Create branded short URLs with optional custom back-half
- Redirect service `/[code]` that issues 302s, increments click counters, and tracks last-clicked time
- Dashboard to list, search, copy, and delete links with aggregate stats
- Stats page `/code/:code` for per-link analytics and management
- REST API (`/api/links`) plus server actions for progressive enhancement
- `/healthz` endpoint for uptime checks
- Input validation, duplicate protection, and helpful error messaging

### Project structure

```
src/
  app/
    api/links          -> REST handlers (list/create)
    api/links/[code]   -> Stats + delete endpoints
    [shortCode]/route  -> Redirect + click tracking
    code/[code]/page   -> Detail stats page
    healthz/route      -> Health check
    page.tsx           -> Dashboard UI
    layout.tsx         -> Root layout + metadata
  actions/             -> Server actions (create/delete)
  components/          -> UI building blocks
  lib/                 -> Prisma client + link utilities
prisma/
  schema.prisma        -> Link model definition
  migrations/          -> Generated migration history
```

### Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set environment variables**

   Copy `.env.example` to `.env` and fill in your Neon connection string:

   ```bash
   DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
   NEXT_PUBLIC_APP_URL="http://localhost:3000" # optional, but recommended
   ```

3. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

4. **Start the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000` to create short links and view analytics.

### Available scripts

| Command           | Description                               |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Start Next.js with Turbopack              |
| `npm run build`   | Create a production build                 |
| `npm run start`   | Serve the production build                |
| `npm run lint`    | Run ESLint in the project                 |
| `npx prisma studio` | Inspect the database with Prisma Studio |

### Deployment

1. Push this repository to GitHub.
2. Create a new Vercel project and import the repo.
3. Add environment variables in Vercel (`DATABASE_URL`, `NEXT_PUBLIC_APP_URL` pointing to your custom domain).
4. Vercel will run `npm install`, `npm run build`, and host the app globally.

### API reference

| Method | Endpoint             | Description                                 |
| ------ | -------------------- | ------------------------------------------- |
| GET    | `/api/links`         | List all links (supports `?q=` filtering)   |
| POST   | `/api/links`         | Create a new short link (409 on conflicts)  |
| GET    | `/api/links/:code`   | Fetch stats for a single short code         |
| DELETE | `/api/links/:code`   | Delete a short link                         |
| GET    | `/healthz`           | Health check `{ ok: true, version: "1.0" }` |

### ERD

```
Link
├─ id          (String, cuid, primary key)
├─ originalUrl (String)
├─ shortCode   (String, unique)
├─ clickCount  (Int, default 0)
├─ lastClicked (DateTime, nullable)
└─ createdAt   (DateTime, default now)
```

### Next steps / improvements

- Add authentication with NextAuth (email magic links or OAuth)
- Support branded domains populated from user settings
- Extend analytics with per-day click charts and geo/device data
- Implement edit modal and bulk delete

Happy hacking!
