'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cinzel } from '@/components/fonts';
import { motion } from 'framer-motion';

export default function SocialFollow() {
  const sponsors = [
    {
      name: 'Villa Kathreyna',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/v1-typo-transparent-vtxr9fQiNnwwmmbmnYknmtSjHIzqn3.png',
      url: 'https://villakathreyna.com',
    },
  ];

  const socialLinks = [
    { label: 'Villa Kathreyna', url: 'https://www.facebook.com/villakathreyna', icon: '👍' },
    { label: 'Villa Kathreyna Events', url: 'https://www.facebook.com/villakathreynaevents', icon: '🎉' },
    { label: 'Labella Cafe RestoBar', url: 'https://www.facebook.com/labellacaferestobar', icon: '☕' },
    { label: 'RKreations Catering', url: 'https://www.facebook.com/rkreationscatering', icon: '🍽️' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="py-16 md:py-24 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Hosted By & Promotional Video section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className={`text-3xl md:text-4xl font-bold text-foreground ${cinzel.variable} font-cinzel`}>Hosted By</h2>
              <p className="text-lg text-foreground font-serif font-bold">Villa Kathreyna Event Place & Resort</p>
              <p className="text-muted-foreground font-serif max-w-2xl mx-auto">
                Nestled in Planza, San Fernando, Camarines Sur, Villa Kathreyna is a premier events and leisure destination. Experience the beauty of Bicol as you run through scenic trails and roads, finishing at the resort with post-race celebrations.<br /><br />
                A wellness and inclusivity run celebrating Fiesta Month and Pride Month — promoting tourism, community, and strength through running.
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {sponsors.map((sponsor) => (
                <Link
                  key={sponsor.name}
                  href={sponsor.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  <div className="h-24 w-auto relative flex items-center justify-center">
                    <Image
                      src={sponsor.image}
                      alt={sponsor.name}
                      width={200}
                      height={80}
                      style={{ width: 'auto', height: '100%' }}
                      className="object-contain"
                    />
                  </div>
                </Link>
              ))}
            </div>
            {/* Promotional Video */}
            <div className="flex flex-col items-center justify-center mt-10">
              <div className="w-full max-w-2xl aspect-video rounded-xl overflow-hidden shadow-lg border-2 border-primary">
                <iframe
                  src="https://player.vimeo.com/video/1156815617?autoplay=1&loop=1"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title="Villa Kathreyna Promo Video"
                  className="w-full h-full"
                  style={{ minHeight: 320 }}
                ></iframe>
              </div>
            </div>
          </div>

          {/* Social media section */}
          <div className="border-t border-border pt-12 space-y-8">
            <div className="text-center space-y-4">
              <h3 className={`text-2xl md:text-3xl font-bold text-foreground ${cinzel.variable} font-cinzel`}>Follow for Updates</h3>
              <p className="text-muted-foreground font-serif">Stay connected with us on social media</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {socialLinks.map((social) => (
                <Link key={social.label} href={social.url}>
                  <Button
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary/10 gap-2"
                  >
                    <span>{social.icon}</span>
                    {social.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation & Sitemap */}
          <div className="border-t border-border pt-12 text-center space-y-6">
            <nav className="flex flex-wrap justify-center gap-6 text-base font-semibold mb-2">
              <Link href="/">Home</Link>
              <Link href="/#categories">Categories</Link>
              <Link href="/register">Register</Link>
              <Link href="/#route">Route Map</Link>
              <Link href="/#socials">Socials</Link>
            </nav>
            <div className="text-xs text-muted-foreground">
              <p>Sitemap: Home | Categories | Register | Route Map | Socials</p>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 Spectrum of Strength Run. Powered by Villa Kathreyna Events.
            </p>
            <p className="text-xs text-muted-foreground">
              For inquiries, contact: events@villakathreyna.com | +63 (2) 1234-5678
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
