# notece.me

Cozy note-taking + weekly planner with a Tumblr-like, uneven grid aesthetic.

## Setup

1. Install dependencies
2. Copy `.env.example` to `.env.local` and fill in Supabase + Giphy keys
3. Run `npm run dev`

## Supabase

Run the SQL in `supabase/schema.sql` to create tables + policies.
Create a storage bucket named `media` (or set `VITE_SUPABASE_MEDIA_BUCKET`).

## Features

- Drag/resize widgets on an uneven grid
- WYSIWYG notes with images and GIFs
- Habit tracker with weekly efficiency
- Theme editor (fonts, colors, sizes, radius, shadow, pattern)
- Giphy search for GIF embeds
