# Push to main and deploy to Vercel

## 1. Review the local changes

The Git repository is `C:\Users\Administrator\Desktop\AWF Website\awf`, on branch `ibrahim`, with remote `https://github.com/BisaatLabs/awf.git`. The parent `AWF Website` directory is not the repository. Your existing admin route-group and design changes were preserved.

The review fixed missing admin authorization, missing-role access, schema typing, Next.js compatibility, nested document layouts, catalogue filtering/loading, stale catalogue invalidation, and admin password setup. Next.js is now 15.5.24; Node.js is pinned to 24.x. Dependency audit reported zero vulnerabilities after compatible updates.

## 2. Supabase prerequisites

- Confirm the existing tables and RLS policies match `supabase/schema.sql`. The live catalogue already contains data; do not reseed it just to deploy.
- The application now requires an explicit `admin` entry in `public.user_roles`. Merely having an Auth user or a user-metadata role is insufficient.
- In Supabase Authentication > Users, find/create your intended administrator. Edit the email in `supabase/create-admin.sql` and run it in the SQL Editor to assign the role. The script is safe to repeat for the same user.
- If using `npm run set-admin` locally, supply `ADMIN_EMAIL` and a strong `ADMIN_PASSWORD` through your local environment. It requires the service-role key, updates the password, and assigns the database role. No default password is provided and passwords are not printed. Remove these temporary credentials after setup.
- If the previous default admin password was ever used, change it before publishing.
- The `is_admin()` helper in the schema now fixes its search path. For an existing database, apply this small hardening statement in the SQL Editor:

```sql
alter function public.is_admin() set search_path = '';
```

- Set Auth > URL Configuration > Site URL to your final HTTPS production origin. Password login is implemented; OAuth and email callback routes are not implemented. Disable public signup if only administrators need accounts.

## 3. Save and push the reviewed work

These commands include your existing uncommitted changes as well as review fixes. Inspect the diff first:

```powershell
Set-Location 'C:\Users\Administrator\Desktop\AWF Website\awf'
git status
git diff
git add -A
git diff --cached --stat
git diff --cached --name-only
```

Make sure `.env.local` and other secrets are absent from the staged file list. `.env.example` contains blank/documented configuration and is intended to be tracked. Include the new `app/(admin)` files when committing the old `app/admin` deletions.

```powershell
git commit -m "Prepare AWF catalogue and admin for Vercel"
git push -u origin ibrahim
```

Recommended: open a pull request on GitHub from `ibrahim` into `main`, review it, then merge. If GitHub branch protection requires checks/reviews, complete them.

Alternatively, if you manage main directly:

```powershell
git fetch origin
git switch main
git pull --ff-only origin main
git merge ibrahim
# Resolve any conflicts, then run the checks again before continuing.
git push origin main
```

Do not force-push or reset main. The database and production deployment are managed separately from the Git push; the review did not modify live database records or deploy to Vercel.

## 4. Import the GitHub repository into Vercel

1. Vercel > Add New > Project > import `BisaatLabs/awf`.
2. Framework preset: **Next.js**.
3. Root Directory: **repository root (`.`)**. `package.json` is at the Git repository root; the local folder name `awf` does not mean Vercel needs a nested `awf` directory.
4. Node.js version: **24.x**, matching `package.json`.
5. Install command: `npm ci`. Build command: `npm run build`. Leave Output Directory at the Next.js default.
6. Set Production Branch to **main** under the project's Git/environment settings.
7. Add the variables below before deploying. Select Production, and Preview if previews should use that Supabase project. Preview deployments connected to the production database can modify production data when an admin signs in; use a separate Supabase project for isolated testing.

| Variable | Needed on Vercel? |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Required; copy its value from local configuration |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Required; anonymous/publishable client key, never the service-role key |
| `NEXT_PUBLIC_SITE_URL` | Set to the final HTTPS production origin; update and redeploy after adding a domain |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional real business email; email block is hidden when unset |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Not required for current runtime: images use full stored delivery URLs; needed by local Cloudinary scripts |
| `SUPABASE_SERVICE_ROLE_KEY` | Local setup/seed scripts only; do not add to Vercel for this implementation |
| `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Local Cloudinary scripts only; not required on Vercel |

The Cloudinary admin form accepts existing HTTPS image URLs; it does not upload files to Cloudinary. Upload assets in Cloudinary, then copy their delivery URLs into the product form. The catalogue applies Cloudinary resizing/format transformations; Next.js image optimization is intentionally disabled to avoid double-processing.

Click Deploy. Future merges/pushes to main trigger production deployments. Environment variable changes require a new deployment; public values are embedded during the build.

## 5. Domain and launch checks

- Add your domain in Vercel Project > Settings > Domains and apply the DNS records Vercel displays. Confirm HTTPS and set the preferred www/apex redirect.
- Set `NEXT_PUBLIC_SITE_URL` and Supabase Site URL to the actual domain, then redeploy.
- Visit home, products, filters, load more, a product detail, each space, projects, contact, and an invalid URL.
- Open `/admin` in a private browser: it must send you to login. A non-admin must not gain access.
- Sign in with your explicitly assigned admin. On an isolated preview database, create/edit/hide a test product and verify catalogue updates, image changes, and sign-out. Authenticated writes were not tested against the live catalogue to avoid modifying your data.
- Confirm the WhatsApp target is `923333444300` (confirmed by the owner). Quote forms prepare a WhatsApp message; the visitor still sends it there. They do not email/store enquiries.
- Project examples are illustrative sample content. Replace them with verified client work when ready. The email is optional and showroom visits are described as by appointment.

## Remaining limitations

Product details and images are saved through separate database requests. Errors are now surfaced, but a failure during a multi-step edit can leave partial changes; inspect the product before retrying. A transactional SQL function would be appropriate if atomic product-and-image edits become a requirement.

Read-only service checks confirm catalogue access, hidden inactive products, and representative Cloudinary delivery. They do not constitute a full audit of the deployed database policies or an authenticated end-to-end admin test.

## Official references

- [Vercel Git deployments](https://vercel.com/docs/git)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Vercel project/root-directory settings](https://vercel.com/docs/project-configuration/general-settings)
- [Vercel Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Supabase row-level security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Next.js patched release](https://nextjs.org/blog/august-2026-security-release)
