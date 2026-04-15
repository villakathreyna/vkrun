"use client";
import { useState, ChangeEvent, FormEvent, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    team?: string;
    gender: string;
    genderSpecify: string;
    distanceCategory: string;
    entitlementSize: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    finisherShirt: boolean;
  }
  interface FieldErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    birthday?: string;
    team?: string;
    gender?: string;
    genderSpecify?: string;
    distanceCategory?: string;
  }
  const [formData, setFormData] = useState<FormData>({
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
    entitlementSize: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
    finisherShirt: false,
  });
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [showWaiver, setShowWaiver] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    paymentMethod: 'gcash',
    amount: '',
  });
  const [preview, setPreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Early Bird: April 15 to May 10

  // Get current date in Asia/Manila timezone (UTC+08)
  function getManilaDate() {
    const now = new Date();
    // Format: yyyy-mm-dd
    const [month, day, year] = now.toLocaleString('en-US', { timeZone: 'Asia/Manila', year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');
    return new Date(`${year}-${month}-${day}T00:00:00+08:00`);
  }
  const today = getManilaDate();
  const earlyBirdStart = new Date('2026-04-15T00:00:00+08:00');
  const earlyBirdEnd = new Date('2026-05-10T23:59:59+08:00');
  const isEarlyBird = today >= earlyBirdStart && today <= earlyBirdEnd;

  function getPrice(distance: string): number {
    if (isEarlyBird) {
      if (distance === '10km') return 1000;
      if (distance === '5km') return 800;
      if (distance === '3km') return 700;
    } else {
      if (distance === '10km') return 1100;
      if (distance === '5km') return 900;
      if (distance === '3km') return 800;
    }
    return 0;
  }

  let currentPrice = getPrice(formData.distanceCategory || '3km');
  if (formData.distanceCategory === '10km' && formData.finisherShirt) {
    currentPrice += 350;
  }

  function getEntitlements(distance: string): string[] {
    if (distance === '10km') {
      return [
        'Quality Medal',
        'Singlet',
        'Race Bib',
        'Post Race Snacks',
        'Finisher Shirt - ₱350 (Optional)',
      ];
    }
    if (distance === '5km') {
      return [
        'Quality Medal',
        'Singlet',
        'Race Bib',
        'Post Race Snacks',
      ];
    }
    if (distance === '3km') {
      return [
        'Quality Medal',
        'Singlet',
        'Race Bib',
      ];
    }
    return [];
  }

  function getTrailRoad(distance: string): string {
    if (distance === '10km') return '20% Trail, 80% Road';
    if (distance === '5km') return '20% Trail, 80% Road';
    if (distance === '3km') return '30% Trail, 70% Road';
    return '';
  }

  function handleInputChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    let checked = false;
    if (type === 'checkbox' && 'checked' in e.target) {
      checked = (e.target as HTMLInputElement).checked;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setIsLoading(false); // Re-enable submit button if user edits any field
  }

  function handlePaymentInputChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleFileSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type)) {
        setError('Only images (JPG, PNG, GIF) and PDF files are accepted');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview('');
      }
      setError('');
    }
  }

  async function handlePaymentSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const file = fileInputRef.current?.files?.[0];
      if (!file) {
        setError('Payment proof is required');
        setIsLoading(false);
        return;
      }
      if (!paymentForm.amount.trim()) {
        setError('Amount is required');
        setIsLoading(false);
        return;
      }
      // Compose registration + payment data
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('registration', JSON.stringify({
        ...formData,
        pricePHP: currentPrice,
      }));
      uploadFormData.append('amount', paymentForm.amount);
      uploadFormData.append('paymentMethod', paymentForm.paymentMethod);
      // Submit to backend
      const response = await fetch('/api/register-and-pay', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      if (!response.ok) {
        if (data.error && data.error.includes('already been used to register')) {
          setError('This email has already been used to register. Please use a different email.');
          setStep(1);
          setAgreed(false);
        } else {
          setError(data.error || 'Payment submission failed');
        }
        setIsLoading(false);
        return;
      }
      // Success!
      setStep(4); // Show confirmation/receipt step
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  }

  function handleNext(e: FormEvent) {
    e.preventDefault();
    const errors: FieldErrors = {};
    if (!formData.firstName.trim()) errors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!formData.email.trim()) errors.email = 'Email is required.';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required.';
    if (!formData.address.trim()) errors.address = 'Address is required.';
    if (!formData.birthday.trim()) errors.birthday = 'Birthday is required.';
    if (!formData.gender.trim()) errors.gender = 'Gender is required.';
    if (formData.gender === 'specify' && !formData.genderSpecify.trim()) errors.genderSpecify = 'Please specify your gender.';
    // Phone validation: must start with 09 and be 11 digits
    if (formData.phone && !/^09\d{9}$/.test(formData.phone)) errors.phone = 'Phone number must start with 09 and be 11 digits.';
    // Email validation (simple)
    if (formData.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) errors.email = 'Please enter a valid email address.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Please correct the highlighted fields.');
      return;
    }
    setError('');
    setFieldErrors({});
    setAgreed(false);
    setStep(2);
  }

  function handleContinueToPayment(e: FormEvent) {
    e.preventDefault();
    const errors: FieldErrors = {};
    if (!formData.distanceCategory) errors.distanceCategory = 'Please select a distance category.';
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError('Please correct the highlighted fields.');
      return;
    }
    setError('');
    setFieldErrors({});
    setAgreed(false);
    setIsLoading(false);
    setStep(3);
  }

  return (
    <main className="max-w-2xl mx-auto py-6 px-2 sm:py-10 sm:px-4 text-[15px] sm:text-base">
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
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md border-2 ${
                  num <= step
                    ? 'bg-white border-white text-primary'
                    : 'bg-muted border-muted text-muted-foreground'
                }`}
                style={num <= step ? { background: 'linear-gradient(135deg, #ff4b2b 0%, #ff9100 16%, #ffe600 33%, #4cd964 50%, #2196f3 66%, #7c4dff 83%, #e040fb 100%)', color: '#fff', border: 'none' } : {}}
              >
                {num}
              </div>
              {num < 3 && (
                <div
                  className="flex-1 h-2 mx-2 rounded-full"
                  style={num < step
                    ? { background: 'linear-gradient(90deg, #ff4b2b 0%, #ff9100 16%, #ffe600 33%, #4cd964 50%, #2196f3 66%, #7c4dff 83%, #e040fb 100%)' }
                    : { background: '#e5e7eb' }} // Tailwind's bg-muted
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

      <Card className="border-2 border-primary/30 bg-white text-[15px] sm:text-base">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl">
            {step === 1 && 'Your Information'}
            {step === 2 && 'Choose Your Distance'}
            {step === 3 && 'Complete Payment'}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
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
            <form className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="firstName">First Name *</FieldLabel>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Juan"
                    className={`border-border${fieldErrors.firstName ? ' border-destructive' : ''}`}
                  />
                  {fieldErrors.firstName && <div className="text-destructive text-xs mt-1">{fieldErrors.firstName}</div>}
                </FieldGroup>
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="lastName">Last Name *</FieldLabel>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Dela Cruz"
                    className={`border-border${fieldErrors.lastName ? ' border-destructive' : ''}`}
                  />
                  {fieldErrors.lastName && <div className="text-destructive text-xs mt-1">{fieldErrors.lastName}</div>}
                </FieldGroup>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="email">Email *</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="juan@example.com"
                    className={`border-border${fieldErrors.email ? ' border-destructive' : ''}`}
                  />
                  {fieldErrors.email && <div className="text-destructive text-xs mt-1">{fieldErrors.email}</div>}
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
                    className={`border-border${fieldErrors.phone ? ' border-destructive' : ''}`}
                    inputMode="numeric"
                  />
                  {fieldErrors.phone && <div className="text-destructive text-xs mt-1">{fieldErrors.phone}</div>}
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
                  className={`border-border${fieldErrors.address ? ' border-destructive' : ''}`}
                />
                {fieldErrors.address && <div className="text-destructive text-xs mt-1">{fieldErrors.address}</div>}
              </FieldGroup>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="birthday">Birthday *</FieldLabel>
                  <DatePicker
                    id="birthday"
                    name="birthday"
                    selected={formData.birthday ? new Date(formData.birthday) : null}
                    onChange={(date: Date | null) => {
                      setFormData((prev) => ({ ...prev, birthday: date ? date.toISOString().slice(0, 10) : '' }));
                    }}
                    dateFormat="yyyy-MM-dd"
                    maxDate={new Date()}
                    minDate={new Date('1900-01-01')}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="Select your birthday"
                    className={`w-full border px-3 py-2 rounded bg-background${fieldErrors.birthday ? ' border-destructive' : ' border-border'}`}
                  />
                  {fieldErrors.birthday && <div className="text-destructive text-xs mt-1">{fieldErrors.birthday}</div>}
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

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="gender">Gender *</FieldLabel>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`border border-border w-full px-3 py-2 rounded${fieldErrors.gender ? ' border-destructive' : ''}`}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="specify">Specify</option>
                  </select>
                  {fieldErrors.gender && <div className="text-destructive text-xs mt-1">{fieldErrors.gender}</div>}
                  {formData.gender === 'specify' && (
                    <>
                      <Input
                        id="genderSpecify"
                        name="genderSpecify"
                        value={formData.genderSpecify}
                        onChange={handleInputChange}
                        placeholder="Please specify"
                        className={`border-border mt-2${fieldErrors.genderSpecify ? ' border-destructive' : ''}`}
                      />
                      {fieldErrors.genderSpecify && <div className="text-destructive text-xs mt-1">{fieldErrors.genderSpecify}</div>}
                    </>
                  )}
                </FieldGroup>
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="entitlementSize">Entitlement Size *</FieldLabel>
                  <select
                    id="entitlementSize"
                    name="entitlementSize"
                    value={formData.entitlementSize}
                    onChange={handleInputChange}
                    className="border border-border w-full px-3 py-2 rounded"
                    required
                  >
                    <option value="">Select Size</option>
                    <option value="XXS">XXS</option>
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                    <option value="XXXL">XXXL</option>
                  </select>
                </FieldGroup>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="emergencyContactName" className="text-sm sm:text-base">Emergency Contact Name *</FieldLabel>
                  <Input
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    placeholder="Full Name"
                    className="border-border text-sm sm:text-base py-2 sm:py-2.5"
                    required
                  />
                </FieldGroup>
                <FieldGroup className="flex-1">
                  <FieldLabel htmlFor="emergencyContactNumber" className="text-sm sm:text-base">Emergency Contact Number *</FieldLabel>
                  <Input
                    id="emergencyContactNumber"
                    name="emergencyContactNumber"
                    value={formData.emergencyContactNumber}
                    onChange={handleInputChange}
                    placeholder="09XXXXXXXXX"
                    className="border-border text-sm sm:text-base py-2 sm:py-2.5"
                    required
                  />
                </FieldGroup>
              </div>

              <Button
                onClick={handleNext}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg py-2 sm:py-3"
              >
                Next: Choose Distance
              </Button>
            </form>
          )}

          {/* Step 2: Distance Selection */}
          {step === 2 && (
            <form className="space-y-4 sm:space-y-6">
              <div className="space-y-3 sm:space-y-4">
                {['3km', '5km', '10km'].map((distance) => {
                  const price = getPrice(distance);
                  return (
                    <label
                      key={distance}
                      className={`block p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.distanceCategory === distance
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                        }${fieldErrors.distanceCategory && !formData.distanceCategory ? ' border-destructive' : ''}`}
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
                            {getTrailRoad(distance)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">₱{price}{distance === '10km' ? (formData.finisherShirt ? ' + ₱350' : '') : ''}</p>
                          <p className="text-xs text-muted-foreground">
                            {isEarlyBird ? 'Early Bird' : 'Regular'}
                          </p>
                        </div>
                      </div>
                    </label>
                  );
                })}
                {/* Finisher Shirt Option for 10km */}
                {formData.distanceCategory === '10km' && (
                  <button
                    type="button"
                    className={`w-full mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg border-2 flex items-center justify-between text-base sm:text-lg font-semibold transition-all ${formData.finisherShirt ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/50'}`}
                    onClick={() => setFormData((prev) => ({ ...prev, finisherShirt: !prev.finisherShirt }))}
                  >
                    <span>Finisher Shirt - ₱350 (Optional)</span>
                    <span>{formData.finisherShirt ? '✓ Selected' : 'Select'}</span>
                  </button>
                )}
                {fieldErrors.distanceCategory && (
                  <div className="text-destructive text-xs mt-2">{fieldErrors.distanceCategory}</div>
                )}
              </div>

              <div className="bg-secondary/10 p-3 sm:p-4 rounded-lg space-y-2">
                <p className="font-semibold text-foreground">Includes:</p>
                <ul className="text-xs sm:text-sm text-foreground/80 space-y-1">
                  {getEntitlements(formData.distanceCategory || '3km').map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setIsLoading(false);
                    setError('');
                    setAgreed(false);
                  }}
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
            <form className="space-y-4 sm:space-y-6" onSubmit={handlePaymentSubmit} encType="multipart/form-data">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 sm:p-6 rounded-lg border border-border">
                <p className="text-sm text-muted-foreground mb-2">Total Amount Due</p>
                <p className="text-4xl font-bold text-foreground">₱{currentPrice}</p>
                <p className="text-sm text-muted-foreground mt-2">{formData.distanceCategory} Registration</p>
              </div>

              <div className="space-y-3 sm:space-y-4 bg-card p-4 sm:p-6 rounded-lg border border-border">
                <h4 className="font-bold text-foreground mb-4">Payment Methods</h4>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    className={`w-full text-left p-4 rounded border-2 transition-colors ${paymentForm.paymentMethod === 'gcash' ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                    onClick={() => setPaymentForm((prev) => ({ ...prev, paymentMethod: 'gcash' }))}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-base">GCash</p>
                        <p className="text-xs text-muted-foreground mt-1">Kathleen Leah V. Calinog<br/>0977 627 1360</p>
                      </div>
                      {paymentForm.paymentMethod === 'gcash' && <span className="ml-4 text-primary font-bold">Selected</span>}
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`w-full text-left p-4 rounded border-2 transition-colors ${paymentForm.paymentMethod === 'bdo' ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                    onClick={() => setPaymentForm((prev) => ({ ...prev, paymentMethod: 'bdo' }))}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-base">BDO Savings Account</p>
                        <p className="text-xs text-muted-foreground mt-1">Kathleen Leah V. Calinog<br/>010 60000 9300</p>
                      </div>
                      {paymentForm.paymentMethod === 'bdo' && <span className="ml-4 text-primary font-bold">Selected</span>}
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <FieldGroup>
                  <FieldLabel htmlFor="amount">Amount Paid (PHP) *</FieldLabel>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={paymentForm.amount}
                    onChange={handlePaymentInputChange}
                    placeholder="e.g., 1000"
                    className="border-border"
                    required
                  />
                </FieldGroup>
                <FieldGroup>
                  <FieldLabel className="mb-3 block">Upload Proof of Payment *</FieldLabel>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                          setError('Only images (JPG, PNG, GIF) are accepted');
                          return;
                        }
                        if (file.size > 3 * 1024 * 1024) {
                          setError('File size must be less than 3MB');
                          return;
                        }
                        // Compress image if > 1MB
                        if (file.size > 1024 * 1024) {
                          const img = document.createElement('img');
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            img.src = ev.target?.result as string;
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              const scale = Math.min(1, 1200 / img.width);
                              canvas.width = img.width * scale;
                              canvas.height = img.height * scale;
                              const ctx = canvas.getContext('2d');
                              if (ctx) {
                                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                                canvas.toBlob((blob) => {
                                  if (blob) {
                                    const compressedFile = new File([blob], file.name, { type: file.type });
                                    setPreview(URL.createObjectURL(compressedFile));
                                    if (fileInputRef.current) {
                                      const dt = new DataTransfer();
                                      dt.items.add(compressedFile);
                                      fileInputRef.current.files = dt.files;
                                    }
                                  }
                                }, file.type, 0.7);
                              }
                            };
                          };
                          reader.readAsDataURL(file);
                        } else {
                          const reader = new FileReader();
                          reader.onload = (ev) => setPreview(ev.target?.result as string);
                          reader.readAsDataURL(file);
                        }
                        setError('');
                      }
                    }}
                    className="hidden"
                    required
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-primary/40 rounded-lg p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-center flex flex-col items-center justify-center"
                  >
                    {preview ? (
                      <img src={preview} alt="Payment proof preview" className="max-h-40 rounded mx-auto" />
                    ) : (
                      <>
                        <span className="inline-block w-16 h-16 bg-muted rounded-lg border border-border mb-2 flex items-center justify-center">
                          <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-muted-foreground mx-auto"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        </span>
                        <span className="text-muted-foreground">Click to upload image (max 3MB)</span>
                      </>
                    )}
                  </div>
                </FieldGroup>
              </div>

              {/* Waiver/Data Privacy Checkbox */}
              <div className="flex items-center border border-border rounded px-4 py-3 mb-2 gap-3">
                <input
                  id="waiverAgree"
                  type="checkbox"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  className="accent-primary w-5 h-5 border-2 border-primary rounded mr-3 focus:ring-2 focus:ring-primary"
                  required
                />
                <label htmlFor="waiverAgree" className="flex-1 text-sm select-none">
                  I have read and agree to the{' '}
                  <button
                    type="button"
                    className="underline text-primary hover:opacity-80"
                    onClick={() => setShowWaiver(true)}
                  >
                    Waiver, Terms & Conditions, and Data Privacy Policy
                  </button>
                </label>
              </div>

              {/* Waiver Modal */}
              {showWaiver && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                  <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8 relative">
                    <button
                      type="button"
                      className="absolute top-3 right-3 text-xl text-muted-foreground hover:text-primary"
                      onClick={() => setShowWaiver(false)}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h2 className="text-xl font-bold mb-4">Waiver, Terms & Conditions, and Data Privacy Notice</h2>
                    <div className="max-h-96 overflow-y-auto text-sm text-foreground/90 space-y-4 whitespace-pre-line">
                      <p className="font-bold">Event Participation</p>
                      <p>
                        I, (Participant), am voluntarily participating in Villa Kathreyna Run taking place at Planza, San Fernando, Camarines Sur on June 21, 2026. I certify that I am in good health and physically fit as declared by a qualified medical professional. It is my responsibility to seek medical advice if I have any concern about my fitness. I am aware that participating in this event involves risks, including but not limited to physical injury, death, or property damage. I am participating fully aware of these risks, whether known or unknown.
                      </p>
                      <p className="font-bold">Waiver and Release of Liability</p>
                      <p>
                        I hereby release the ORGANIZERS of this marathon, namely, Villa Kathreyna and their officers, members, advisors, volunteers, employees, and Governing Board, as well as any lessor of the facility premises, from any liability for loss, damage, injury, expense, demand, or cause of action that may occur while participating in this event. I acknowledge that all related entities are not responsible for errors, omissions, acts, or failures of any party conducting specific activities on their behalf.
                      </p>
                      <p className="font-bold">Personal Data Collection & Use</p>
                      <p>
                        By registering, I consent to the collection, use, and storage of my personal data, including my name, contact details, date of birth, emergency contacts, and payment information, for the purpose of event registration, updates, and ensuring participant safety. My data may be shared with medical personnel, venue partners, and event sponsors only when necessary. My information will not be sold to third parties.
                      </p>
                      <p className="font-bold">Photography and Media Consent</p>
                      <p>
                        I understand that while participating in the event, I may be photographed or filmed. I consent to the use of my image, video, or likeness by the event organizers, sponsors, and partners for legitimate promotional purposes.
                      </p>
                      <p className="font-bold">Data Retention & Rights</p>
                      <p>
                        My personal data will be retained only as long as necessary and protected with reasonable security measures. I have the right to access, correct, or request deletion of my personal data, subject to legal and operational requirements.
                      </p>
                      <p className="font-bold text-primary mt-4">I CERTIFY THAT I HAVE READ THIS DOCUMENT, FULLY UNDERSTAND ITS CONTENT, AND AGREE TO THE WAIVER, TERMS & CONDITIONS, AND DATA PRIVACY POLICY. I SIGN THIS OF MY OWN FREE WILL.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setAgreed(false);
                    setIsLoading(false);
                    setError('');
                    setStep(2);
                  }}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading || !agreed}
                >
                  {isLoading ? 'Uploading...' : 'Submit Registration & Payment'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {step === 4 && (
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-4 sm:p-8 mt-8 border border-primary/30 text-[15px] sm:text-base">
          <h2 className="text-3xl font-bold text-primary mb-4 text-center">Registration Receipt</h2>
          <div className="mb-6 text-center">
            <p className="text-lg text-foreground">Thank you for registering and submitting your payment proof!</p>
            <p className="text-muted-foreground text-sm">A confirmation email will be sent to you soon.</p>
          </div>
          <div className="bg-muted rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2 text-foreground">Registrant Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div><span className="font-semibold">Name:</span> {formData.firstName} {formData.lastName}</div>
              <div><span className="font-semibold">Email:</span> {formData.email}</div>
              <div><span className="font-semibold">Phone:</span> {formData.phone}</div>
              <div><span className="font-semibold">Birthday:</span> {formData.birthday}</div>
              <div><span className="font-semibold">Gender:</span> {formData.genderSpecify || formData.gender}</div>
              <div><span className="font-semibold">Address:</span> {formData.address}</div>
              <div><span className="font-semibold">Distance:</span> {formData.distanceCategory}</div>
              <div><span className="font-semibold">Entitlement Size:</span> {formData.entitlementSize}</div>
              <div><span className="font-semibold">Emergency Contact Name:</span> {formData.emergencyContactName}</div>
              <div><span className="font-semibold">Emergency Contact Number:</span> {formData.emergencyContactNumber}</div>
              <div><span className="font-semibold">Price:</span> ₱{currentPrice}</div>
              {typeof formData.finisherShirt !== 'undefined' && (
                <div><span className="font-semibold">Finisher Shirt:</span> {formData.finisherShirt ? 'Yes' : 'No'}</div>
              )}
              {formData.team && (
                <div><span className="font-semibold">Team:</span> {formData.team}</div>
              )}
            </div>
          </div>
          <div className="bg-muted rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2 text-foreground">Payment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
              <div><span className="font-semibold">Payment Method:</span> {paymentForm.paymentMethod === 'gcash' ? 'GCash' : 'BDO Savings Account'}</div>
              <div><span className="font-semibold">Amount Paid:</span> ₱{paymentForm.amount}</div>
            </div>
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-muted-foreground text-xs mb-4">You may screenshot this receipt for your records.</p>
            <Link href="/">
              <Button className="bg-primary text-primary-foreground text-base sm:text-lg py-2 sm:py-3">Back to Home</Button>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
