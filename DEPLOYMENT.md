# Deployment Guide

## Prerequisites

You need to have:
- A Supabase account with a PostgreSQL database
- Vercel account with Blob storage enabled
- GitHub repository (for GitHub integration)

## Step 1: Set Up Database

1. Visit your app at `/setup-db` (e.g., `http://localhost:3000/setup-db`)
2. Copy the SQL script provided
3. Go to [Supabase Dashboard](https://app.supabase.com)
4. Select your project
5. Click "SQL Editor" in the left sidebar
6. Click "New Query"
7. Paste the SQL script and click "Run"

This creates three tables:
- `registrations` - Stores participant registrations
- `payments` - Stores payment proof submissions
- `admin_users` - Stores admin credentials

## Step 2: Create Admin User

After the database is set up, create your admin account:

1. Go to the Supabase dashboard
2. Go to "Authentication" → "Users"
3. Click "Add user"
4. Create a user with your email and password
5. Note the User ID (UUID)
6. Go to "SQL Editor" and run:

```sql
INSERT INTO public.admin_users (id, email, name, role)
VALUES ('[USER_ID_FROM_ABOVE]', '[YOUR_EMAIL]', 'Admin', 'admin');
```

Replace `[USER_ID_FROM_ABOVE]` with the actual UUID from step 5.

## Step 3: Deploy to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Select your GitHub repository
5. Configure environment variables (they should auto-populate if using Supabase integration)
6. Click "Deploy"

### Option 2: Deploy from v0

1. In v0, click the three dots menu (top right)
2. Select "Publish" or "Deploy"
3. Follow the prompts to deploy to Vercel

## Step 4: Set Environment Variables on Vercel

Go to your Vercel project settings and ensure these variables are set:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
- `BLOB_READ_WRITE_TOKEN` - Your Vercel Blob token (if using file storage)

These should be auto-populated if you've connected the integrations in v0.

## Step 5: Test the Deployment

1. Visit your deployed URL
2. Click "Register" to test the registration form
3. If you get a database error, make sure to complete Step 1
4. Test the admin dashboard at `/admin/login`

## Architecture Overview

```
├── Landing Page (/)
│   ├── Hero section with countdown
│   ├── Event details
│   └── Call-to-action buttons
│
├── Registration (/register)
│   ├── Step 1: Personal info
│   ├── Step 2: Distance category
│   └── Step 3: Confirmation
│
├── Payment (/payment)
│   ├── File upload for payment proof
│   └── Payment details form
│
├── Confirmation (/confirmation)
│   └── Success message with next steps
│
└── Admin (/admin)
    ├── Login (/admin/login)
    ├── Dashboard (/admin/dashboard)
    ├── Registrations (/admin/registrations)
    ├── Payments (/admin/payments)
    └── Export (/admin/export)
```

## API Endpoints

### Registration
- `POST /api/register` - Create a new registration

### Payment
- `POST /api/payment` - Submit payment proof (with file upload)

### Admin
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/registrations` - Get all registrations with search
- `GET /api/admin/payments` - Get all payments with search
- `POST /api/admin/payments/[id]/verify` - Approve a payment
- `POST /api/admin/payments/[id]/reject` - Reject a payment
- `GET /api/admin/export/registrations` - Export registrations as CSV
- `GET /api/admin/export/payments` - Export payments as CSV

## Troubleshooting

### "Database not initialized" error

This means the SQL script hasn't been executed yet. Go to `/setup-db` and follow the instructions.

### "Email already registered" error

This is expected - the system prevents duplicate registrations per email. Have the user use a different email.

### Admin login not working

Make sure you've created an admin user in the `admin_users` table with your auth user ID.

### File uploads not working

Ensure Vercel Blob storage is properly configured and environment variables are set.

## Customization

### Change Pricing
Edit prices in `/app/register/page.tsx` in the `prices` object.

### Change Event Details
Update event information in:
- `/components/landing/hero.tsx` - Main hero section
- `/components/landing/event-details.tsx` - Event specifics

### Change Branding Colors
Edit `/app/globals.css` to customize the color scheme (currently using teal and gold).

## Security Notes

- Passwords are NOT stored in plain text (Supabase handles authentication)
- Row Level Security (RLS) is enabled on all tables
- Admin operations require admin authentication
- File uploads are stored in private Vercel Blob storage
