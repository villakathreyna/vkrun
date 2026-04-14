'use client';


import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';


import { cinzel } from '@/components/fonts';
import Countdown from './Countdown';


export default function LandingHero() {
  return (
    <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Villa Kathreyna aerial view as background */}
      <Image
        src="/villa_kathreyna_view.jpg"
        alt="Villa Kathreyna Aerial View"
        fill
        className="object-cover object-center absolute inset-0 w-full h-full z-0"
        priority
      />
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2e1a]/80 via-[#1a2e1a]/60 to-[#e6c97a]/20 z-10" />
      <div className="relative z-20 w-full max-w-5xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        {/* Event branding and elegant vertical date stack */}
        <div className="flex flex-col items-center mb-6">
          <span className={`text-3xl md:text-4xl font-bold text-[#e6c97a] drop-shadow-xl mb-2 font-[Cinzel_Decorative] ${cinzel.variable}`}>Villa KathReyna Run</span>
          <div className="flex flex-col items-center justify-center bg-[#e6c97a] bg-gradient-to-b from-[#e6c97a] to-[#b6a04c] border-4 border-[#1a2e1a]/60 rounded-2xl px-7 py-3 shadow-2xl">
            <span className={`text-lg md:text-xl font-bold text-[#1a2e1a] uppercase tracking-widest ${cinzel.variable} font-cinzel`}>June</span>
            <span className={`text-5xl md:text-6xl font-extrabold text-[#1a2e1a] leading-none ${cinzel.variable} font-cinzel`}>21</span>
            <span className={`text-lg md:text-xl font-bold text-[#1a2e1a] tracking-widest ${cinzel.variable} font-cinzel`}>2026</span>
          </div>
        </div>
        <h1 className={`text-5xl md:text-7xl font-bold text-[#e6c97a] drop-shadow-xl mb-2 ${cinzel.variable} font-cinzel`}>Spectrum of Strength</h1>
        <h2 className={`text-2xl md:text-3xl font-semibold text-white mb-4 ${cinzel.variable} font-cinzel`}>A Pride & Fiesta Run 2026</h2>
        <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-6 font-serif">Villa Kathreyna Event Place & Resort<br />Planza, San Fernando, Camarines Sur</p>
        <div className="mb-8">
          <Countdown />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg" className="bg-[#e6c97a] hover:bg-[#d4b44c] text-[#1a2e1a] px-10 text-lg font-bold uppercase tracking-widest shadow-lg border-2 border-[#e6c97a]">
              Register Now
            </Button>
          </Link>
          <Link href="#categories">
            <Button size="lg" className="bg-[#1bb6b1] hover:bg-[#159a97] text-white px-10 text-lg font-bold uppercase tracking-widest shadow-lg border-2 border-[#e6c97a]">
              View Categories
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
