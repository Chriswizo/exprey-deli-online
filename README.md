# Exprey Deli Online Logistics — GitHub-ready starter

A responsive logistics website starter with shipment tracking UI and an admin CRUD dashboard. It is an original implementation, not the private source code of another website.

## What's included
- `index.html` + `styles.css`: responsive marketing homepage, services, tracking form, quote form.
- `admin.html` + `admin.js`: admin sign-in and shipment create/edit/delete interface.
- `app.js`: shipment lookup and quote email flow.
- `config.js`: public configuration placeholders.
- `supabase-schema.sql`: starter database schema and row-level security policies.

## Important: demo vs real tracking
Without Supabase configured, the public tracking page only recognizes two clearly labelled demo records (`ED-100024` and `ED-100025`). The admin page cannot sign in or save real shipments until you configure a Supabase project. Do not use demo data to mislead customers.

## Deploy on GitHub Pages
1. Create/open your GitHub repository.
2. Upload all project files at the repository root (keep file names as-is).
3. In GitHub, open **Settings → Pages**, select your deployment branch (often `main`) and root folder, then save.
4. In Namecheap, point your domain's DNS to the GitHub Pages settings shown by GitHub. Do not remove existing DNS records without checking them.
5. Use GitHub Pages' custom domain field and enable HTTPS when available.

## Enable shared database and admin dashboard
1. Create a project at https://supabase.com/.
2. In Supabase, open **SQL Editor** and run `supabase-schema.sql`.
3. Open **Project Settings → API** and copy the project URL and public anon/publishable key.
4. Paste those values into `config.js` as `SUPABASE_URL` and `SUPABASE_ANON_KEY`. These are public browser values; never put a `service_role` key in client-side code.
5. In Supabase Authentication, create your admin user with a strong password. Keep user creation restricted; do not allow public sign-ups.
6. **Security before production:** the included SQL is a starter. Its comments explain that any authenticated user can write; tighten policies to a dedicated admin role before using this with real customers. Also use a public-safe tracking view/RPC so public lookups do not expose customer names, addresses, or internal notes.
7. Add an email service or backend function for notifications. The quote form currently opens the visitor's email app; it does not submit to a server.

## Before launch
- Replace sample copy and placeholder contact email.
- Remove or replace demo tracking records.
- Add a privacy policy and terms.
- Test mobile layouts and forms.
- Configure proper admin-only database permissions and safe public tracking fields.
- Do not store payment card details in this project.

## Suggested next production upgrades
- Admin-only role enforcement and safe tracking RPC/view
- Order/quote submissions saved to database
- Email/SMS notifications
- Driver assignment and delivery proof
- Payment provider integration if required
