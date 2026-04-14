# Spectrum of Strength Run 2026 - Event Registration System

A full-stack event registration and payment management system for the Spectrum of Strength Run 2026 at Villa Kathreyna Event Place & Resort.

## Features

### For Participants
- **Landing Page** with event details, countdown timer, and race category information
- **Registration Form** with multi-step validation
  - Personal information collection
  - Race category selection (3km, 5km, 10km)
  - Dynamic pricing display
- **Payment Submission** 
  - File upload for payment proof
  - Reference number tracking
  - Instant confirmation
- **Social Media Integration** for event promotion

### For Admins
- **Admin Dashboard** with protected authentication
  - Overview statistics and metrics
  - Real-time payment and registration counts
  - Total revenue tracking
- **Registration Management**
  - Search and filter registrations
  - Status tracking
  - CSV export functionality
- **Payment Verification**
  - Image preview of payment proofs
  - Manual verification workflow
  - Approve/reject payment submissions
  - Confidence-based matching suggestions
- **Data Export**
  - CSV exports for registrations
  - CSV exports for payments
  - Easy data analysis

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS with custom color theme (Gold/Teal)
- **Database**: Supabase PostgreSQL with Row Level Security
- **File Storage**: Vercel Blob (private access for payment proofs)
- **Authentication**: Custom admin authentication with email/password
- **Deployment**: Vercel

## Setup Instructions

### 1. Database Setup

First, set up your Supabase database by following the instructions in `SETUP_DATABASE.md`:

1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Create a new query
4. Copy the SQL from `SETUP_DATABASE.md` and execute it
5. Create an admin user (see instructions in the file)

### 2. Environment Variables

Add the following environment variables to your `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

**Get these from:**
- Supabase URL & Keys: Supabase Project Settings → API
- Blob Token: Vercel Project Settings → Storage → Blob

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000` to see the application.

## Application Routes

### Public Routes
- `/` - Landing page with event details
- `/register` - Registration form
- `/payment` - Payment submission
- `/confirmation` - Payment confirmation page

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Main dashboard
- `/admin/registrations` - Manage registrations
- `/admin/payments` - Review and verify payments
- `/admin/export` - Export data as CSV

## Payment Pricing

| Category | Distance | Price (PHP) |
|----------|----------|------------|
| 3km      | 3km      | 800        |
| 5km      | 5km      | 900        |
| 10km     | 10km     | 1,100      |

## Admin Credentials

After setting up the database, you'll have created an admin user with:
- Email: (the one you registered)
- Password: (the one you set)

Store these securely!

## File Structure

```
app/
├── page.tsx                 # Landing page
├── register/
│   └── page.tsx            # Registration form
├── payment/
│   └── page.tsx            # Payment submission
├── confirmation/
│   └── page.tsx            # Confirmation page
├── admin/
│   ├── login/
│   │   └── page.tsx        # Admin login
│   ├── dashboard/
│   │   └── page.tsx        # Admin dashboard
│   ├── registrations/
│   │   └── page.tsx        # Manage registrations
│   ├── payments/
│   │   └── page.tsx        # Review payments
│   └── export/
│       └── page.tsx        # Export data
├── api/
│   ├── register/           # Registration endpoint
│   ├── payment/            # Payment submission endpoint
│   └── admin/              # Admin API routes
└── layout.tsx              # Root layout

components/
├── landing/
│   ├── hero.tsx            # Hero section
│   ├── event-details.tsx   # Event information
│   ├── registration-cards.tsx  # Category cards
│   └── social-follow.tsx   # Social media section

lib/
├── supabase/               # Supabase client setup
├── payment-matcher.ts      # Payment matching logic
└── utils.ts               # Utility functions
```

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel Project Settings
4. Deploy!

```bash
git push origin main
```

## Color Scheme

The application uses a custom color theme inspired by Villa Kathreyna:

- **Primary (Teal)**: #4fa9a3 - Main accent color
- **Secondary (Gold)**: #d4a574 - Accent and highlights
- **Background**: Light cream/white
- **Text**: Dark teal/gray

## Security Features

- Row Level Security (RLS) on all database tables
- Protected admin routes with token authentication
- Private file storage with Vercel Blob
- Password hashing for admin users
- CORS protection on API endpoints

## Performance Optimizations

- Optimized images with Next.js Image component
- CSS optimization with Tailwind CSS v4
- Database indexes on frequently queried fields
- Lazy loading of admin components

## Support

For issues or questions, contact:
- Email: info@villakathreyna.com
- Website: https://villakathreyna.com

## License

This project is proprietary and created for Villa Kathreyna Event Place & Resort.
