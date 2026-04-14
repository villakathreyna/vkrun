
'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { cinzel } from '@/components/fonts';

// Event Poster Section
function PosterSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="py-12 md:py-20 bg-gradient-to-b from-[#f9f5ff] via-[#e6c97a]/10 to-[#f9f5ff] flex justify-center"
    >
      <div className="max-w-2xl w-full flex flex-col items-center">
        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-[#e6c97a]/60">
          <Image src="/vkposter.png" alt="Villa Kathreyna Run Poster" width={600} height={900} className="w-full h-auto" />
        </div>
      </div>
    </motion.section>
  );
}

export default function EventDetails() {
  return (
    <>
      <PosterSection />
              {/* Categories Section */}
              <section id="categories" className="py-20 md:py-28 bg-gradient-to-b from-transparent via-primary/5 to-transparent">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="text-center space-y-4 mb-12">
                    <h2 className={`text-4xl md:text-5xl font-bold text-foreground ${cinzel.variable} font-cinzel`}>Choose Your Distance</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-serif">
                      Select the category that matches your pace. All distances start and finish at Villa Kathreyna.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      <span className="bg-primary/10 text-primary font-semibold rounded-full px-4 py-2">Early Bird Rate: April 10 – April 30</span>
                      <span className="bg-secondary/10 text-secondary font-semibold rounded-full px-4 py-2">Regular Rate: May 1 – May 31</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* 12KM */}
                    <div className="relative rounded-2xl border-2 border-primary/30 bg-white/80 shadow-xl p-8 flex flex-col items-center">
                      <span className="text-primary font-bold text-lg mb-2">12KM</span>
                      <span className="text-xs font-semibold bg-primary/10 text-primary rounded-full px-3 py-1 mb-2">20% Trail · 80% Road</span>
                      <span className="text-2xl font-bold text-foreground mb-2">₱1,000 <span className="text-xs font-normal">+ ₱350 Finisher Shirt (Optional)</span></span>
                      <ul className="text-sm text-foreground/80 space-y-1 mb-4">
                        <li>Quality Medal</li>
                        <li>Singlet</li>
                        <li>Race Bib</li>
                        <li>Post Race Snacks</li>
                      </ul>
                      <a href="/register" className="mt-auto w-full">
                        <button className="w-full bg-primary text-primary-foreground rounded-lg py-2 font-bold text-lg shadow hover:bg-primary/90 transition">Register for 12KM</button>
                      </a>
                    </div>
                    {/* 5KM */}
                    <div className="relative rounded-2xl border-2 border-secondary/30 bg-white/80 shadow-xl p-8 flex flex-col items-center">
                      <span className="text-secondary font-bold text-lg mb-2">5KM</span>
                      <span className="text-xs font-semibold bg-secondary/10 text-secondary rounded-full px-3 py-1 mb-2">60% Trail · 40% Road</span>
                      <span className="text-2xl font-bold text-foreground mb-2">₱800</span>
                      <ul className="text-sm text-foreground/80 space-y-1 mb-4">
                        <li>Quality Medal</li>
                        <li>Singlet</li>
                        <li>Race Bib</li>
                        <li>Post Race Snacks</li>
                      </ul>
                      <a href="/register" className="mt-auto w-full">
                        <button className="w-full bg-secondary text-secondary-foreground rounded-lg py-2 font-bold text-lg shadow hover:bg-secondary/90 transition">Register for 5KM</button>
                      </a>
                    </div>
                    {/* 3KM */}
                    <div className="relative rounded-2xl border-2 border-[#a259e6]/30 bg-white/80 shadow-xl p-8 flex flex-col items-center">
                      <span className="font-bold text-lg mb-2" style={{ color: '#a259e6' }}>3KM</span>
                      <span className="text-xs font-semibold rounded-full px-3 py-1 mb-2" style={{ backgroundColor: '#a259e622', color: '#a259e6' }}>60% Trail · 40% Road</span>
                      <span className="text-2xl font-bold text-foreground mb-2">₱700</span>
                      <ul className="text-sm text-foreground/80 space-y-1 mb-4">
                        <li>Quality Medal</li>
                        <li>Singlet</li>
                        <li>Race Bib</li>
                      </ul>
                      <a href="/register" className="mt-auto w-full">
                        <button className="w-full rounded-lg py-2 font-bold text-lg shadow transition" style={{ backgroundColor: '#a259e6', color: '#fff' }}>Register for 3KM</button>
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* Route Map Section */}
              <section className="py-20 md:py-28 bg-gradient-to-b from-primary/5 to-secondary/5">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                  <h2 className={`text-3xl md:text-4xl font-bold text-foreground mb-6 ${cinzel.variable} font-cinzel`}>Trail & Road Course</h2>
                  <p className="text-lg text-muted-foreground mb-8 font-serif">Experience the beauty of Bicol as you run through scenic trails and roads, finishing at Villa Kathreyna Event Place & Resort.</p>
                  <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/30 inline-block">
                    <Image src="/vkrun_map.png" alt="Villa Kathreyna Run Route Map" width={1000} height={500} className="w-full h-auto" />
                  </div>
                </div>
              </section>
            </>
          );
        }
