# Spectrum of Strength Run 2026 - Event Registration System

## Status: Ready for Database Setup

All code is complete and functional. The registration system is currently in preview mode and requires **one critical step** to become operational.

## What's Complete ✓

### Frontend
- [x] Landing page with hero, countdown, and event details
- [x] Multi-step registration form with validation
- [x] Payment proof upload page
- [x] Confirmation page with social follow section
- [x] Responsive design with Villa Kathreyna branding (teal & gold)

### Admin Dashboard
- [x] Secure login system
- [x] Dashboard with real-time statistics
- [x] Registration management table with search/filter
- [x] Payment verification with image preview
- [x] CSV export for both registrations and payments
- [x] Payment matching system (HIGH/MEDIUM/LOW confidence)

### Backend & Infrastructure
- [x] Supabase PostgreSQL integration
- [x] Vercel Blob file storage for payment proofs
- [x] Row Level Security (RLS) policies
- [x] Comprehensive API endpoints
- [x] Error handling and validation

## What You Need to Do

### 1. Initialize the Database (REQUIRED)

The registration system won't work until the database tables are created.

**Two Options:**

#### Option A: Quick Setup (Recommended)
1. Visit `http://localhost:3000/setup-db` (or your deployed URL + `/setup-db`)
2. Click "Copy SQL Script"
3. Go to your [Supabase Dashboard](https://app.supabase.com)
4. Click your project → SQL Editor → New Query
5. Paste the SQL and click "Run"
6. Done! Your database is ready

#### Option B: Manual Setup
1. Copy the SQL from `/scripts/001_create_tables.sql`
2. Run it in the Supabase SQL Editor
3. Same result as Option A

### 2. Create an Admin User

After the database is initialized:

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click your project → Authentication → Users
3. Click "Add User" and create a user with your email
4. Copy the User ID (UUID)
5. Go to SQL Editor and run:

```sql
INSERT INTO public.admin_users (id, email, name, role)
VALUES ('YOUR_USER_ID_HERE', 'your-email@example.com', 'Admin', 'admin');
```

6. You can now log in to `/admin/login` with your email and password

### 3. Deploy to Vercel (Optional but Recommended)

To share the registration system publicly:

1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "Add New Project"
4. Select your GitHub repo
5. Vercel auto-imports environment variables from v0
6. Click "Deploy"

Your site will be live at a Vercel URL.

## Testing the System

### Register a Participant
1. Visit homepage
2. Click "Register Now"
3. Fill in the form (3 steps)
4. You'll get a registration confirmation

### Submit Payment Proof
1. After registration, you're taken to the payment page
2. Upload a screenshot of payment
3. Enter transaction details
4. Click Submit

### Access Admin Dashboard
1. Visit `/admin/login`
2. Login with the admin user you created
3. View registrations, payments, and export data

## File Structure

```
/app
  /page.tsx                 ← Landing page
  /register/page.tsx        ← Registration form
  /payment/page.tsx         ← Payment submission
  /confirmation/page.tsx    ← Success page
  /setup-db/page.tsx        ← Database setup helper
  /admin
    /login/page.tsx         ← Admin login
    /dashboard/page.tsx     ← Dashboard home
    /registrations/page.tsx ← Registration manager
    /payments/page.tsx      ← Payment verifier
    /export/page.tsx        ← CSV export
  /api
    /register/route.ts      ← Registration API
    /payment/route.ts       ← Payment submission API
    /admin/login/route.ts   ← Admin auth
    /admin/stats/route.ts   ← Dashboard stats
    /admin/payments/[id]/verify/route.ts
    /admin/payments/[id]/reject/route.ts
    /admin/export/registrations/route.ts
    /admin/export/payments/route.ts

/components
  /landing
    /hero.tsx               ← Hero section
    /event-details.tsx      ← Event information
    /registration-cards.tsx ← Category cards
    /social-follow.tsx      ← Social links
  /ui
    (standard shadcn components)

/lib
  /supabase/                ← Supabase client setup
  /payment-matcher.ts       ← Payment matching logic
```

## Color Scheme

- **Primary (Teal)**: `#4fa9a3` - Main brand color
- **Secondary (Gold)**: `#d4a574` - Accent color
- **Background (Cream)**: `#f9f7f4` - Light background
- **Rainbow accents**: For Pride month theme

## Environment Variables

These are automatically set if you've connected Supabase and Blob to v0:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
BLOB_READ_WRITE_TOKEN
```

If deploying manually, make sure these are set in Vercel project settings.

## Support & Documentation

- **Setup Issues**: See `SETUP_DATABASE.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **API Documentation**: See `API_DOCS.md`
- **Quick Start**: See `QUICKSTART.md`

## Known Limitations

- Email confirmation via Supabase Auth is optional (can be skipped for testing)
- Payment matching uses email + amount to match payments to registrations
- CSV exports are plain text without compression
- Images are stored in private Blob storage (not publicly accessible)

## Next Steps

1. **RIGHT NOW**: Go to `/setup-db` and initialize the database
2. **Then**: Create an admin user in Supabase
3. **Then**: Test the registration flow
4. **Optional**: Deploy to Vercel for public access

---

**The system is 100% functional - just needs the database initialized!**
