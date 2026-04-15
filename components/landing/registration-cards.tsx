'use client';


import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cinzel } from '@/components/fonts';
import { motion } from 'framer-motion';

export default function RegistrationCards() {
  return (
    <motion.section
      className="py-16 md:py-24 bg-gradient-to-b from-[#fffbe6]/60 via-[#ffe6ec]/60 to-[#e6f7ff]/60"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {/* Section header */}
          <div className="text-center space-y-4">
            <h2 className={`text-4xl md:text-5xl font-bold text-foreground ${cinzel.variable} font-cinzel`}>How to Register</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-serif">
              A simple 3-step process to secure your spot in the Spectrum of Strength Run
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="border-2 border-primary/30 hover:border-primary/60 transition-colors">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">1</span>
                </div>
                <CardTitle className={`text-foreground ${cinzel.variable} font-cinzel`}>Fill Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-foreground/70">
                  Provide your personal information and choose your preferred race distance
                </CardDescription>
                <Link href="/register">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    Start Registration
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="border-2 border-secondary/30 hover:border-secondary/60 transition-colors">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-secondary-foreground">2</span>
                </div>
                <CardTitle className={`text-foreground ${cinzel.variable} font-cinzel`}>Submit Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-foreground/70">
                  Upload proof of payment and reference number to verify your registration
                </CardDescription>
                <p className="text-sm text-muted-foreground">
                  Accepted payment methods: Bank Transfer, GCash, PayMaya
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="border-2 border-accent/30 hover:border-accent/60 transition-colors">
              <CardHeader className="space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent-foreground">3</span>
                </div>
                <CardTitle className={`text-foreground ${cinzel.variable} font-cinzel`}>Confirmation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-foreground/70">
                  Receive confirmation email with your receipt and event details
                </CardDescription>
                <p className="text-sm font-semibold text-foreground">Get ready to run!</p>
              </CardContent>
            </Card>
          </div>

          {/* CTA section */}
          <div className="mt-12 p-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-border rounded-xl text-center space-y-6">
            <h3 className={`text-3xl font-bold text-foreground ${cinzel.variable} font-cinzel`}>Ready to Join the Celebration?</h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-serif">
              Secure your spot today. Limited slots available for each distance category.
            </p>
            <Link href="/register">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                Register Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
