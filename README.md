# notece.me

Cozy note-taking + weekly planner with a Tumblr-like, uneven grid aesthetic.

## Setup

1. Install dependencies
2. Copy `.env.example` to `.env.local` and fill in Supabase + Giphy keys
3. Run `npm run dev`

## Supabase

Run the SQL in `supabase/schema.sql` to create tables + policies.
Create a storage bucket named `media` (or set `VITE_SUPABASE_MEDIA_BUCKET`).

## Deployment (Vercel)

1. Push to GitHub (done)
2. In Vercel, import the `noteceme` repo
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Add env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_MEDIA_BUCKET` (optional)
   - `VITE_GIPHY_KEY`
7. Deploy

### Domain

After buying `notece.me`, add it in Vercel:
`Project Settings` -> `Domains` -> add `notece.me` and `www.notece.me`.
Update your registrar DNS to Vercel's records.

## Features

- Drag/resize widgets on an uneven grid
- WYSIWYG notes with images and GIFs
- Habit tracker with weekly efficiency
- Theme editor (fonts, colors, sizes, radius, shadow, pattern)
- Giphy search for GIF embeds
