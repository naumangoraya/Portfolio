# Go-Live Checklist — remaining setup items

Everything here is a **configuration** step, not a code change. Follow in order — each
one is independent, so if you get interrupted you can pick back up at any step.

Your local `.env.local` and the live Vercel deployment point at the **same MongoDB Atlas
database**. That means running a script locally (like `npm run seed:admin`) already
affects production — there's no separate "prod DB" to sync afterwards.

---

## 1. Rotate the admin password (do this first)

Right now `ADMIN_EMAIL=admin@example.com` and `ADMIN_PASSWORD=changeme123` in
`.env.local` are live on your production admin account. Fix that:

### 1a. Generate a strong password yourself

Run this locally and copy the output — this way the real password only ever exists on
your machine, never pasted into a chat:

```powershell
node -e "console.log(require('crypto').randomBytes(18).toString('base64'))"
```

### 1b. Decide: keep the same email, or switch to your real one?

- **Keep `admin@example.com`** → simplest. The seed script finds the existing user by
  email and just updates its password in place. Nothing else to clean up.
- **Switch to your real email** (e.g. `naumanjaat@gmail.com`) → the seed script will
  create a **second** admin account under the new email, leaving the old
  `admin@example.com` account active with its old password. You must deactivate the old
  one afterwards (step 1d).

### 1c. Edit `.env.local`

Open `.env.local` and replace lines 33-35:

```env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<paste the generated password from step 1a>
ADMIN_NAME=Nauman Noor
```

(Keep `ADMIN_EMAIL` as `admin@example.com` unless you decided to switch it in 1b.)

Then apply it:

```powershell
npm run seed:admin
```

You should see `✅ Updated existing admin user: admin@example.com`. Log in at
`https://naumannoor.tech/admin` (or `/admin` locally) with the new password to confirm,
then delete the generated password from your shell history / clipboard.

### 1d. Only if you switched emails — deactivate the old account

Save this as `scripts/deactivate-old-admin.mjs`:

```js
import mongoose from 'mongoose';

const OLD_EMAIL = 'admin@example.com';
const { MONGODB_URI } = process.env;

await mongoose.connect(MONGODB_URI);
const result = await mongoose.connection.db
  .collection('users')
  .updateOne({ email: OLD_EMAIL }, { $set: { isActive: false } });
console.log(
  `Deactivated ${OLD_EMAIL}:`,
  result.modifiedCount === 1 ? 'done' : 'no matching user found'
);
await mongoose.disconnect();
```

Then run it and delete the file afterwards:

```powershell
node --env-file=.env.local scripts/deactivate-old-admin.mjs
Remove-Item scripts/deactivate-old-admin.mjs
```

**Note:** `ADMIN_EMAIL` / `ADMIN_PASSWORD` are read **only** by this one seed script —
the running app never reads them. You do **not** need to add them to Vercel.

---

## 2. Set up Resend (the contact form 500s without this)

1. Sign up at [resend.com](https://resend.com) (free tier is enough).
2. Add and verify your domain **naumannoor.tech** under Resend → Domains (add the DNS
   records it gives you at your domain registrar — usually 2-3 TXT/CNAME records).
   Verification can take a few minutes to a few hours.
3. Create an API key: Resend → API Keys → Create → copy the value (starts with `re_`).
4. Add to `.env.local`:

```env
RESEND_API_KEY=re_your_real_key_here
NOTIFICATION_EMAIL=naumanjaat@gmail.com
CONTACT_FROM_EMAIL=contact@naumannoor.tech
```

If you skip domain verification for now, leave `CONTACT_FROM_EMAIL` blank — Resend
will use its sandbox sender, which only delivers to the Resend account owner's email
(fine for testing, not for real visitor messages).

---

## 3. Add environment variables to Vercel

Go to your Vercel project → **Settings → Environment Variables**. Add each of the
following for the **Production** environment (also tick Preview if you want preview
deployments to work identically). Copy the values straight from your local
`.env.local` — they must be the **same** values, since it's the same database and the
same Cloudinary/Resend accounts.

| Key                         | Value                     | Notes                                                                            |
| --------------------------- | ------------------------- | -------------------------------------------------------------------------------- |
| `MONGODB_URI`               | _(from `.env.local`)_     | same Atlas cluster as local                                                      |
| `JWT_SECRET`                | _(from `.env.local`)_     | same value as local — different secrets would invalidate sessions inconsistently |
| `CLOUDINARY_CLOUD_NAME`     | `drpwc8url`               |                                                                                  |
| `CLOUDINARY_API_KEY`        | `571614285834359`         |                                                                                  |
| `CLOUDINARY_API_SECRET`     | _(from `.env.local`)_     |                                                                                  |
| `RESEND_API_KEY`            | _(from step 2)_           |                                                                                  |
| `NOTIFICATION_EMAIL`        | `naumanjaat@gmail.com`    | where contact-form submissions get emailed                                       |
| `CONTACT_FROM_EMAIL`        | `contact@naumannoor.tech` | optional, only after domain is verified in Resend                                |
| `NEXT_PUBLIC_CONTACT_EMAIL` | `naumanjaat@gmail.com`    | shown in the static footer/sidebar                                               |
| `NEXT_PUBLIC_CONTACT_PHONE` | `+923106623823`           | shown in the static footer/sidebar                                               |

Do **not** add `ADMIN_EMAIL` / `ADMIN_PASSWORD` / `ADMIN_NAME` — not read by the app.

After saving, **redeploy** (Vercel → Deployments → ⋯ → Redeploy on the latest one) —
env var changes don't apply to already-running deployments until the next build.

---

## 4. Confirm the Node.js version Vercel uses

Mongoose 9 requires Node ≥20.19. Vercel → Settings → General → **Node.js Version** —
set it to **20.x** (or newer) if it isn't already. `package.json` already declares
`"engines": { "node": ">=20.19.0" }`, so this should already be correct, but it's worth
a 10-second check since Vercel's dashboard setting can override it.

---

## 5. Resolve the domain mismatch: `.tech` vs `.com`

Your profile lists `naumannoor.tech` as the canonical portfolio URL, but the live
Vercel deployment we just verified is on `naumannoor.com`. Pick one:

- **If you own both** and want `.tech` to be canonical: Vercel → Settings → Domains →
  add `naumannoor.tech`, point its DNS (A/CNAME records, shown on that page) at Vercel,
  then set it as the **Primary Domain** so `.com` redirects to it (or vice versa).
- **If `.tech` isn't actually registered yet**: either register it, or tell me and I'll
  update the Hero `email`/profile copy and the master profile file to say `.com`
  instead, so everything stays consistent.

---

## Already done — no action needed

- `sections` collection is already seeded in the live DB (confirmed: 8 documents).
- Hero / About / Jobs / Education / Projects / Contact content is live (previous step).
- `engines.node` is already set correctly in `package.json`.
