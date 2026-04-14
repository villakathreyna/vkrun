
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    birthday: '',
    team: '',
    gender: '',
    genderSpecify: '',
    distanceCategory: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const isEarlyBird = false;
  const currentPrice = 500;

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleNext(e) {
    e.preventDefault();
    setStep(2);
  }

  function handleContinueToPayment(e) {
    e.preventDefault();
    setStep(3);
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <Link href="/">
        <Button variant="ghost" className="mb-8">
          ← Back to Home
        </Button>
      </Link>

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  num <= step
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    num < step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Personal Info</span>
          <span>Distance</span>
          <span>Payment</span>
        </div>
      </div>

      <Card className="border-2 border-primary/30">
        <CardHeader>
          <CardTitle className="text-3xl">
            {step === 1 && 'Your Information'}
            {step === 2 && 'Choose Your Distance'}
            {step === 3 && 'Complete Payment'}
          </CardTitle>
          <CardDescription>
            {step === 1 && 'Tell us about yourself'}
            {step === 2 && `You've selected the ${formData.distanceCategory} run`}
            {step === 3 && 'Submit your payment proof'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 text-destructive">
              {error}
              {error.includes('Database not initialized') && (
                <div className="mt-3">
                  <Link href="/setup-db" className="underline font-semibold hover:opacity-80">
                    Go to database setup →
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <form className="space-y-6">
              <div className="flex gap-4">
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Juan"
                    className="border-border"
                  />
                </FieldGroup>
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Dela Cruz"
                    className="border-border"
                  />
                </FieldGroup>
              </div>

              <div className="flex gap-4">
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="juan@example.com"
                    className="border-border"
                  />
                </FieldGroup>
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="phone">Phone Number *</FieldLabel>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    pattern="09[0-9]{9}"
                    maxLength={11}
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="09XXXXXXXXX"
                    className="border-border"
                    inputMode="numeric"
                  />
                </FieldGroup>
              </div>

              <FieldGroup>
                <FieldLabel htmlFor="address">Address *</FieldLabel>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street/Subdivision/Building, Barangay, Municipality/City, Province"
                  className="border-border"
                />
              </FieldGroup>

              <div className="flex gap-4">
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="birthday">Birthday *</FieldLabel>
                  <Input
                    id="birthday"
                    name="birthday"
                    type="date"
                    value={formData.birthday}
                    onChange={handleInputChange}
                    className="border-border"
                  />
                </FieldGroup>
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="team">Team (optional)</FieldLabel>
                  <Input
                    id="team"
                    name="team"
                    value={formData.team || ''}
                    onChange={handleInputChange}
                    placeholder="Team name (optional)"
                    className="border-border"
                  />
                </FieldGroup>
              </div>

              <FieldGroup>
                <FieldLabel htmlFor="gender">Gender *</FieldLabel>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="border-border w-full px-3 py-2 rounded"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="specify">Specify</option>
                </select>
                {formData.gender === 'specify' && (
                  <Input
                    id="genderSpecify"
                    name="genderSpecify"
                    value={formData.genderSpecify}
                    onChange={handleInputChange}
                    placeholder="Please specify"
                    className="border-border mt-2"
                  />
                )}
              </FieldGroup>

              <Button
                onClick={handleNext}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Next: Choose Distance
              </Button>
            </form>
          )}

          {/* Step 2: Distance Selection */}
          {step === 2 && (
            <form className="space-y-6">
              <div className="space-y-4">
                {['3km', '5km', '10km'].map((distance) => (
                  <label
                    key={distance}
                    className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.distanceCategory === distance
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="distanceCategory"
                      value={distance}
                      checked={formData.distanceCategory === distance}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">{distance} Run</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {distance === '3km' && '30% Trail, 70% Road'}
                          {distance === '5km' && '20% Trail, 80% Road'}
                          {distance === '10km' && '20% Trail, 80% Road'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">₱{currentPrice}</p>
                        <p className="text-xs text-muted-foreground">
                          {isEarlyBird ? 'Early Bird' : 'Regular'}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              <div className="bg-secondary/10 p-4 rounded-lg space-y-2">
                <p className="font-semibold text-foreground">Includes:</p>
                <ul className="text-sm text-foreground/80 space-y-1">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Quality Medal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Race Singlet
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Race Bib
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Post-Race Snacks
                  </li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handleContinueToPayment}
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isLoading ? (
                    <>
                      <span className="w-4 h-4 mr-2 inline-block animate-spin border-2 border-primary border-t-transparent rounded-full" />
                      Loading...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Payment Info */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Total Amount Due</p>
                <p className="text-4xl font-bold text-foreground">₱{currentPrice}</p>
                <p className="text-sm text-muted-foreground mt-2">{formData.distanceCategory} Registration</p>
              </div>

              <div className="space-y-4 bg-card p-6 rounded-lg border border-border">
                <h4 className="font-bold text-foreground mb-4">Payment Methods</h4>
                <div className="space-y-3">
                  <div className="p-4 bg-background rounded border border-border">
                    <p className="font-semibold text-sm">Bank Transfer</p>
                    <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
                  </div>
                  <div className="p-4 bg-background rounded border border-border">
                    <p className="font-semibold text-sm">GCash / PayMaya</p>
                    <p className="text-xs text-muted-foreground mt-1">Coming soon</p>
                  </div>
                </div>
              </div>

              <Link href="/payment">
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Upload Payment Proof
                </Button>
              </Link>

              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="w-full"
              >
                Back
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
