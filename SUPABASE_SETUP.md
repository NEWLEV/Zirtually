# Supabase Setup Guide

## Prerequisites
1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project

## Step 1: Run the Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the contents of `supabase/migrations/20260113_initial_schema.sql`
5. Paste into the SQL Editor
6. Click **Run** to execute the migration

This will create:
- `profiles` table (extends auth.users)
- `goals` table
- `performance_reviews` table
- Row Level Security (RLS) policies
- Automatic triggers for `updated_at` timestamps
- Auto-creation of profiles on user signup

## Step 2: Get Your Credentials

1. Go to **Project Settings** → **API**
2. Copy your **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy your **anon/public** key

## Step 3: Configure Environment Variables

1. Create a `.env` file in the project root (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

2. Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Restart your dev server:
   ```bash
   npm run dev
   ```

## Step 4: Test Authentication

The application will now use real Supabase authentication instead of mock data.

### Testing Sign Up
1. Navigate to the login page
2. Create a new account with:
   - Email
   - Password
   - Full Name
   - Department

### Testing Sign In
1. Use the credentials you just created
2. Your session will persist across page refreshes

## Step 5: Verify Database

1. Go to **Table Editor** in Supabase
2. You should see:
   - `profiles` table with your user
   - `goals` table (empty initially)
   - `performance_reviews` table (empty initially)

## Optional: Generate TypeScript Types

To auto-generate TypeScript types from your database schema:

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.ts
```

Replace `your-project-id` with your actual Supabase project ID (found in Project Settings).

## Troubleshooting

### "Invalid API key" error
- Double-check your `.env` file has the correct `VITE_SUPABASE_ANON_KEY`
- Make sure you're using the **anon/public** key, not the service role key

### "Row Level Security" errors
- Verify the RLS policies were created by checking the **Authentication** → **Policies** section
- Make sure you're signed in when trying to access data

### Session not persisting
- Check browser console for errors
- Verify `supabase.auth.onAuthStateChange` is being called in your AuthContext
