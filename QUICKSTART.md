# Quick Start Guide

Get the Spectrum of Strength Run registration system up and running in minutes.

## Prerequisites

- Supabase account (supabase.com)
- Vercel account (vercel.com) 
- Vercel Blob integration enabled

## Step 1: Database Setup (5 minutes)

1. Create a new Supabase project or use an existing one
2. Go to your Supabase dashboard → SQL Editor
3. Create a new query and paste the entire SQL from `SETUP_DATABASE.md`
4. Click "Run" to execute
5. Note your database credentials:
   - Project URL: Settings → API
   - Anon Key: Settings → API
   - Service Key: Settings → API

## Step 2: Create Admin User (2 minutes)

1. In Supabase, go to Authentication → Users
2. Click "Create a new user"
3. Enter an email and password
4. Copy the UUID from the new user
5. Go back to SQL Editor and run:

```sql
INSERT INTO public.admin_users (id, email, name, role)
VALUES ('<PASTE_UUID_HERE>', 'admin@villakathreyna.com', 'Admin Name', 'admin');
```

## Step 3: Environment Variables (2 minutes)

In your Vercel project or local `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
BLOB_READ_WRITE_TOKEN=vercel_blob_...
```

## Step 4: Run Locally (1 minute)

```bash
pnpm install
pnpm dev
```

Visit `http://localhost:3000`

## Testing the System

### Test Registration
1. Go to `/`
2. Click on a race category
3. Fill out the registration form with:
   - Name: Test User
   - Email: test@example.com
   - Phone: 09xxxxxxxxx
   - Category: Choose one
4. Submit and redirect to payment page

### Test Payment
1. Fill in reference number: `TEST-001`
2. Amount: 800 (or 900/1100 depending on category)
3. Upload a test image
4. Submit

### Test Admin Dashboard
1. Go to `/admin/login`
2. Login with credentials created in Step 2
3. View dashboard with stats
4. View registrations and payments
5. Download CSV exports

## Customization

### Update Event Details

Edit `/components/landing/event-details.tsx`:
```tsx
const eventDetails = [
  {
    label: 'Date',
    value: 'June 21, 2026',
  },
  // ... modify dates, times, location
];
```

### Change Pricing

Edit `/lib/payment-matcher.ts`:
```ts
const CATEGORY_PRICES: Record<string, number> = {
  '3km': 800,    // Change these
  '5km': 900,
  '10km': 1100,
};
```

### Update Contact Info

Edit `/components/landing/social-follow.tsx` and `/app/confirmation/page.tsx` to change:
- Email address
- Social media links
- Website URLs

### Customize Colors

Edit `/app/globals.css` and update the color tokens:
```css
:root {
  --primary: oklch(0.55 0.16 190);  /* Teal - change the numbers */
  --secondary: oklch(0.80 0.18 55); /* Gold - change the numbers */
  /* ... etc */
}
```

## Troubleshooting

### Database Connection Issues
- Verify SUPABASE_URL and keys in .env.local
- Check Supabase project is not paused
- Ensure RLS policies are enabled

### Blob Upload Failing
- Verify BLOB_READ_WRITE_TOKEN is correct
- Check Vercel Blob is enabled in project
- Ensure image file size is < 10MB

### Admin Login Not Working
- Verify admin_users table has your user record
- Check password is correct
- Clear browser localStorage and try again

### Styling Issues
- Clear .next build folder: `rm -rf .next`
- Reinstall dependencies: `pnpm install`
- Restart dev server: `pnpm dev`

## Next Steps

1. Deploy to Vercel
2. Set up custom domain
3. Configure email notifications (optional)
4. Add SMS alerts for payment submissions (optional)
5. Set up backup and recovery process

## Support

For detailed documentation, see:
- `README.md` - Full feature list and architecture
- `SETUP_DATABASE.md` - Database setup instructions
- Component files have inline comments

## Go Live Checklist

- [ ] Database setup completed
- [ ] Admin user created
- [ ] Environment variables set
- [ ] Landing page customized
- [ ] Contact information updated
- [ ] Test registration completed
- [ ] Test payment submitted
- [ ] Admin login verified
- [ ] CSV export tested
- [ ] Deployed to Vercel
- [ ] Custom domain configured
- [ ] Social media links verified

Good luck with your event!
