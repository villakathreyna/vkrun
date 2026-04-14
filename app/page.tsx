'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import LandingHero from '@/components/landing/hero';
import { cinzel } from '@/components/fonts';
import EventDetails from '@/components/landing/event-details';
import RegistrationCards from '@/components/landing/registration-cards';
import SocialFollow from '@/components/landing/social-follow';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <LandingHero />
      <EventDetails />
      <RegistrationCards />
      <SocialFollow />
    </main>
  );
}
