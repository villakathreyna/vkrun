'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function SocialFollow() {
  const sponsors = [
    {
      name: 'Villa Kathreyna',
      image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/v1-typo-transparent-vtxr9fQiNnwwmmbmnYknmtSjHIzqn3.png',
      url: 'https://villakathreyna.com',
    },
  ];

  const socialLinks = [
    { label: 'Instagram', url: '#', icon: '📷' },
    { label: 'Facebook', url: '#', icon: '👍' },
    { label: 'Twitter', url: '#', icon: '𝕏' },
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-secondary/5 via-transparent to-primary/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Sponsors section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Hosted By</h2>
              <p className="text-muted-foreground">Villa Kathreyna Event Place & Resort</p>
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
          </div>

          {/* Social media section */}
          <div className="border-t border-border pt-12 space-y-8">
            <div className="text-center space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">Follow for Updates</h3>
              <p className="text-muted-foreground">Stay connected with us on social media</p>
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

          {/* Footer info */}
          <div className="border-t border-border pt-12 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              © 2026 Spectrum of Strength Run. Powered by Villa Kathreyna Events.
            </p>
            <p className="text-xs text-muted-foreground">
              For inquiries, contact: events@villakathreyna.com | +63 (2) 1234-5678
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
