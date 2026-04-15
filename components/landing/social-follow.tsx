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
      image: '/vk_logo.png',
      url: 'https://villakathreyna.com',
      spiel: 'Villa Kathreyna Event Place & Resort is a premier events and leisure destination in Planza, San Fernando, Camarines Sur. Experience the beauty of Bicol as you run through scenic trails and roads, finishing at the resort with post-race celebrations.'
    },
    {
      name: 'La Bella Café & Resto Bar',
      image: '/labella_logo.png',
      url: 'https://www.facebook.com/labellacaferestobar',
      spiel: 'La Bella Café & Resto Bar offers a cozy ambiance and delicious cuisine, perfect for post-run relaxation and celebrations. Visit us for a taste of Bicol hospitality!'
    },
    {
      name: 'RKreatioNs',
      image: '/rkreations.png',
      url: 'https://www.facebook.com/rkreationscatering',
      spiel: 'RKreatioNs is your go-to for creative catering and event styling, making every celebration memorable. Proud partner of the Spectrum of Strength Run!'
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
      className="py-16 md:py-24 bg-gradient-to-b from-[#e6f7ff]/60 via-[#e6ffe6]/60 to-[#fffbe6]/60"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          {/* Hosts & Partners section */}
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className={`text-3xl md:text-4xl font-bold text-foreground ${cinzel.variable} font-cinzel`}>Hosts & Partners</h2>
              <p className="text-muted-foreground font-serif max-w-2xl mx-auto">
                Meet our event hosts and partners who make the Spectrum of Strength Run possible:
              </p>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              {sponsors.map((sponsor) => (
                <div key={sponsor.name} className="flex flex-col items-center max-w-xs text-center">
                  <Link
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <div className="h-36 w-auto relative flex items-center justify-center mb-4">
                      <Image
                        src={sponsor.image}
                        alt={sponsor.name}
                        width={320}
                        height={140}
                        style={{ width: 'auto', height: '100%' }}
                        className="object-contain"
                      />
                    </div>
                  </Link>
                  <p className="font-bold text-lg text-foreground mb-1">{sponsor.name}</p>
                  <p className="text-muted-foreground text-sm font-serif">{sponsor.spiel}</p>
                </div>
              ))}
            </div>
            {/* Promotional Video */}

          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black" style={{ aspectRatio: "16 / 9" }}>
            {/* Vimeo Embed - autoplay with sound when visible */}
            <iframe
              src="https://player.vimeo.com/video/1156815617?autoplay=1&muted=0&title=0&byline=0&portrait=0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
              style={{ border: "none", display: "block" }}
              loading="lazy"
            />

            {/* Gold Border Accent */}
            <div className="absolute inset-0 rounded-2xl border-2 border-[#C5A028] pointer-events-none shadow-lg" />
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
              For inquiries, contact: book@villakathreyna.com | 0977 627 1360
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
