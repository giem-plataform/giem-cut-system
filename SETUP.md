# GIEM Cut System — Setup & Deploy

## Architecture

```
Browser/PWA → Next.js (Vercel) → Prisma → PostgreSQL (Neon)
Telegram Bot → Webhook → Next.js API → Prisma
Vercel Cron (every 15 min) → Reminder API → Telegram
Optional: OpenAI API → AI recommendations (falls back to rule-based)
```

## 1. Database Setup (Neon — free tier)

1. Go to https://neon.tech and create account
2. Create a new project (name: "giem")
3. Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require`)

## 2. Telegram Bot Setup

1. Open Telegram, search for `@BotFather`
2. Send `/newbot`
3. Name it: `GIEM Cut Bot`
4. Username: `giem_cut_bot` (or any available name)
5. Copy the bot token (looks like: `123456:ABC-DEF...`)
6. To get your Chat ID:
   - Search for `@userinfobot` on Telegram
   - Send it any message
   - It will reply with your Chat ID (a number like `123456789`)

## 3. Local Setup

```bash
# Clone/navigate to project
cd giem-cut-system

# Install dependencies
npm install

# Create .env from template
cp .env.example .env
```

Edit `.env` with your values:

```env
DATABASE_URL="postgresql://... (from Neon)"
AUTH_PASSWORD="pick-a-strong-password"
JWT_SECRET="run: openssl rand -hex 32"
TELEGRAM_BOT_TOKEN="from BotFather"
TELEGRAM_CHAT_ID="from @userinfobot"
TELEGRAM_WEBHOOK_SECRET="run: openssl rand -hex 16"
OPENAI_API_KEY="sk-... (optional)"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CRON_SECRET="run: openssl rand -hex 16"
```

```bash
# Push schema to database
npx prisma db push

# Seed default data (reminders, containers, settings)
npx tsx prisma/seed.ts

# Run locally
npm run dev
```

Open http://localhost:3000 — login with your AUTH_PASSWORD.

## 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add DATABASE_URL
vercel env add AUTH_PASSWORD
vercel env add JWT_SECRET
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID
vercel env add TELEGRAM_WEBHOOK_SECRET
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_APP_URL
vercel env add CRON_SECRET

# Redeploy with env vars
vercel --prod
```

After deploy, update `NEXT_PUBLIC_APP_URL` to your Vercel URL.

## 5. Telegram Webhook Setup

After deploying to Vercel:

```bash
# Option A: Via the app's Settings page
# Go to Settings → Click "Setup Telegram Webhook"

# Option B: Via curl
curl -X POST https://your-app.vercel.app/api/telegram/setup
```

Test it: send `/start` to your bot on Telegram.

## 6. PWA Icons

For proper PWA icons, generate 192x192 and 512x512 PNG files named `icon-192.png` and `icon-512.png` in the `public/` folder. You can use any icon generator online.

## 7. Add to Home Screen (Phone)

- **iPhone**: Open the site in Safari → Share → "Add to Home Screen"
- **Android**: Open in Chrome → Menu → "Add to Home Screen"

## Daily Usage

### Via Dashboard (Phone)
- Open the app from home screen
- Dashboard shows: discipline score, weight, calories, fasting timer, AI tip
- Quick actions: log weight, meals, track check-in, view containers

### Via Telegram Bot
```
/status     — Today's full summary
/weight 99  — Log weight
/meal 1 Chicken rice 500cal 40p — Log meal
/fast start — Start fasting
/fast stop  — End fast
/workout    — Mark workout done
/tip        — Get AI recommendation
/containers — View meal prep status
```

### Reminders (auto via Telegram)
Default schedule (editable in Settings):
- 1:30 PM — Wake up
- 2:00 PM — Eating window open (Meal 1)
- 5:00 PM — Meal 2
- 8:00 PM — Shift start (Meal 3)
- 11:00 PM — Last meal window
- 1:30 AM — Window closing warning
- 5:30 AM — Log your day

## Run Checklist

- [ ] Database created on Neon
- [ ] .env filled with all values
- [ ] `npx prisma db push` ran successfully
- [ ] `npx tsx prisma/seed.ts` ran successfully
- [ ] App runs locally at localhost:3000
- [ ] Can login with password
- [ ] Dashboard loads
- [ ] Deployed to Vercel
- [ ] Environment variables set on Vercel
- [ ] NEXT_PUBLIC_APP_URL updated to Vercel URL
- [ ] Telegram webhook setup (via Settings page)
- [ ] Bot responds to /start
- [ ] Added to phone home screen as PWA
