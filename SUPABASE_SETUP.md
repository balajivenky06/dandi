# Supabase Setup Guide for Dandi

This guide will help you set up Supabase for the Dandi project.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. A new Supabase project created

## Setup Steps

### 1. Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_url` and `your_supabase_anon_key` with the values from your Supabase project dashboard.

### 2. Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Create a new query
4. Copy and paste the contents of `supabase/schema.sql` into the SQL editor
5. Run the query to set up the database schema

### 3. Configure Authentication (Optional)

If you want to use authentication:

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure your preferred authentication methods (Email, OAuth providers, etc.)
3. Update your site URL and redirect URLs

### 4. Set Up Row Level Security (RLS)

The schema already includes RLS policies, but make sure they're enabled:

1. Go to Database > Tables in your Supabase dashboard
2. Select the `api_keys` table
3. Go to the "Policies" tab
4. Ensure the RLS is enabled and the policy "Users can manage their own API keys" exists

## Testing Your Setup

After completing the setup, restart your development server and test the API key management functionality in the dashboard.

## Troubleshooting

- If you encounter CORS errors, make sure your site URL is added to the allowed origins in your Supabase project settings.
- If you get authentication errors, check that your environment variables are correctly set.
- For database errors, check the Supabase logs in your project dashboard. 