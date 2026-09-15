# Al Wahid Furnitures

Next.js catalogue with Supabase database/authentication, Cloudinary image delivery, and WhatsApp enquiries.

## Local development

Use Node.js 24. Copy `.env.example` to `.env.local`, fill in the Supabase URL and anonymous key, then:

```powershell
npm ci
npm run dev
```

## Checks

```powershell
npm run lint
npm run typecheck
npm run check:review
node scripts/check-auth.cjs
npm run build
```

The build needs access to Google Fonts and Supabase. Run `node scripts/check-services.cjs` for read-only service checks.

See [DEPLOYMENT.md](DEPLOYMENT.md) for the main branch, Supabase setup, and Vercel deployment guide. Do not run the seed script as part of a build: it updates existing catalogue records.
