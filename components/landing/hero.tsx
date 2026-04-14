'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingHero() {
  const eventDate = new Date('2026-06-21');
  const today = new Date('2026-04-14');
  const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/10 via-transparent to-secondary/5 py-20 md:py-32">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Event date badge */}
            <div className="inline-block">
              <div className="bg-gradient-to-r from-secondary to-accent rounded-full px-6 py-3 shadow-lg">
                <p className="text-sm font-bold text-secondary-foreground">JUNE 21, 2026</p>
              </div>
            </div>

            {/* Event title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-pretty">
                Spectrum of Strength Run
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Pride & Fiesta Run at Villa Kathreyna Event Place & Resort
              </p>
            </div>

            {/* Location and time */}
            <div className="space-y-3 text-lg text-foreground/80">
              <p>Zone 5B, Planzi, San Fernando, Camarines Sur</p>
              <p className="font-semibold">Race Time: 5:00 AM</p>
            </div>

            {/* Countdown */}
            <div className="bg-card border border-border rounded-lg p-6 inline-block">
              <p className="text-sm text-muted-foreground mb-2">EVENT STARTS IN</p>
              <p className="text-4xl font-bold text-primary">{daysUntil} Days</p>
            </div>

            {/* CTA button */}
            <div className="flex gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                  Register Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Right visual - Logo area */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full max-w-md aspect-square">
              {/* Placeholder for the runner illustration */}
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0a80d757-6366-41d2-9688-78e72cb3b16b-juoNQJv030MIEFVfJvMS5zeS7J7pLi.png"
                alt="Spectrum of Strength Runner"
                width={400}
                height={400}
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
