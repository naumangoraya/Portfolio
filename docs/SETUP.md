# Setup

The single source of truth for getting this project running. Replaces the older
`MONGODB_SETUP.md`, `QUICK-SETUP.md` and `email-setup-guide.md`.

## Requirements

- Node.js **20.19+** (see `.nvmrc`; the repo is developed on 22)
- A MongoDB Atlas cluster
- A Cloudinary account (image + resume uploads)
- A Resend account (contact form email)

## 1. Install

```bash
npm ci
```

## 2. Configure

```bash
cp .env.example .env.local
```

Fill in every value. `.env.example` documents all twelve variables; the ones
without which the app will not start or will visibly misbehave are:

| Variable                               | Needed for            | Symptom if missing                  |
| -------------------------------------- | --------------------- | ----------------------------------- |
| `MONGODB_URI`                          | everything            | pages render empty, API returns 500 |
| `JWT_SECRET`                           | admin login           | login returns 500                   |
| `CLOUDINARY_*`                         | image + resume upload | uploads fail                        |
| `RESEND_API_KEY`, `NOTIFICATION_EMAIL` | contact form          | form returns 500                    |

Generate a strong JWT secret:

```bash
openssl rand -hex 48
```

### MongoDB Atlas

1. Create a free cluster.
2. **Database Access** → add a user with _Read and write to any database_.
3. **Network Access** → allow your IP, or `0.0.0.0/0` for Vercel.
4. **Connect → Drivers** → copy the connection string and append the database
   name, e.g. `...mongodb.net/portfolio?retryWrites=true&w=majority`.

### Resend

1. Create an API key at <https://resend.com/api-keys> and set `RESEND_API_KEY`.
2. Set `NOTIFICATION_EMAIL` to the address that should receive submissions.
3. Optionally verify your own domain and set `CONTACT_FROM_EMAIL`. Without it
   the form sends from Resend's sandbox address, which **only delivers to the
   Resend account owner's verified address**.

## 3. Create the admin user

```bash
npm run seed:admin
```

This reads `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` from `.env.local` and
creates (or promotes) a `SUPER_ADMIN`. Use a real password — the admin panel is
reachable from the public internet.

## 4. Run

```bash
npm run dev
```

- Site: <http://localhost:3000>
- Admin login: <http://localhost:3000/admin>

After logging in you are returned to the site with **Enter Edit Mode** and
**Logout** controls in the top right.

## Useful scripts

| Command                           | Purpose                      |
| --------------------------------- | ---------------------------- |
| `npm run dev`                     | development server           |
| `npm run build` / `npm start`     | production build and serve   |
| `npm run lint` / `lint:fix`       | ESLint                       |
| `npm run format` / `format:check` | Prettier                     |
| `npm run seed:admin`              | create/update the admin user |

## Deployment (Vercel)

1. Import the repository.
2. Add every variable from `.env.example` under **Settings → Environment
   Variables**. Use a different `JWT_SECRET` from local.
3. Deploy.

`vercel.json` only sets `no-store` on `/api/*`; static assets and the ISR'd home
page are cached by Next's own headers, so do not widen that rule to `/(.*)`.

## Troubleshooting

**Pages render but sections are empty.** `MONGODB_URI` is wrong or Atlas Network
Access is blocking the request. Check the server log for a connection error.

**Login returns 500.** `JWT_SECRET` is not set.

**Login returns 429.** Rate limiting: 5 attempts per account and 10 per IP per
15 minutes. It is in-process, so restarting the dev server clears it.

**Contact form returns 500.** `RESEND_API_KEY` or `NOTIFICATION_EMAIL` is empty.
