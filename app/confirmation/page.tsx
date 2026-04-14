'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [data, setData] = useState<{
    paymentId?: string;
    registrationId?: string;
    email?: string;
    raceCategory?: string;
  } | null>(null);

  useEffect(() => {
    const paymentId = searchParams.get('paymentId');
    const registrationId = searchParams.get('registrationId');
    const email = searchParams.get('email');
    const raceCategory = searchParams.get('raceCategory');

    if (paymentId || registrationId) {
      setData({ paymentId, registrationId, email, raceCategory });
    } else {
      router.push('/');
    }
  }, [searchParams, router]);

  if (!data) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-card rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 text-card"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            Thank You!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your payment has been submitted successfully
          </p>

          {/* Confirmation Details */}
          <div className="bg-muted rounded-lg p-4 mb-6 text-left">
            <div className="space-y-3">
              {data.raceCategory && (
                <div>
                  <p className="text-sm text-muted-foreground">Race Category</p>
                  <p className="text-base font-semibold text-foreground">
                    {data.raceCategory}
                  </p>
                </div>
              )}
              {data.email && (
                <div>
                  <p className="text-sm text-muted-foreground">Confirmation Email</p>
                  <p className="text-base font-semibold text-foreground">
                    {data.email}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Payment ID</p>
                <p className="text-base font-mono text-foreground break-all">
                  {data.paymentId}
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-2">What&apos;s Next?</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Your payment is under review</li>
              <li>✓ Confirmation email will be sent within 24 hours</li>
              <li>✓ Check your spam folder if you don&apos;t see it</li>
            </ul>
          </div>

          {/* Social Follow Section */}
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-3">
              Follow us for updates:
            </p>
            <div className="flex gap-3 justify-center">
              <a
                href="https://facebook.com/villakathreyna"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
                aria-label="Facebook"
              >
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/villakathreyna"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 transition-colors"
                aria-label="Instagram"
              >
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0m5.894 10.776c.064.566.064 1.135.064 1.707 0 5.39-4.105 11.603-11.603 11.603-2.31 0-4.456-.677-6.27-1.838.324.038.65.058.981.058 1.915 0 3.68-.651 5.082-1.75-1.787-.033-3.304-1.215-3.826-2.842.251.038.51.058.775.058.373 0 .738-.05 1.087-.145-1.868-.377-3.27-2.027-3.27-4.006v-.051c.551.306 1.182.491 1.856.512-.1.063-.195.129-.283.196-1.1.908-1.81 2.334-1.81 3.911 0 .861.232 1.667.637 2.359 2.01-2.467 5.018-4.09 8.402-4.26-.063-.268-.096-.546-.096-.83 0-2.007 1.627-3.634 3.634-3.634 1.046 0 1.991.442 2.656 1.15.827-.163 1.605-.466 2.309-.884-.27.846-.844 1.556-1.593 2.006.736-.087 1.44-.283 2.092-.573-.487.728-1.102 1.368-1.809 1.88z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
            <a
              href="https://villakathreyna.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full border border-primary text-primary font-semibold py-3 rounded-lg hover:bg-primary/5 transition-colors"
            >
              Visit Villa Kathreyna
            </a>
          </div>

          {/* Footer Info */}
          <p className="text-xs text-muted-foreground mt-6">
            If you have any questions, please contact us at{' '}
            <a
              href="mailto:info@villakathreyna.com"
              className="text-primary hover:underline"
            >
              info@villakathreyna.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
