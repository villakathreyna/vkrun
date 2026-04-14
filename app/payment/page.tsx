'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FieldGroup, FieldLabel } from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';

export default function PaymentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [formData, setFormData] = useState({
    referenceNumber: '',
    paymentMethod: 'bank-transfer',
    amount: '',
  });

  const registrationId = typeof window !== 'undefined' ? localStorage.getItem('registrationId') : '';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type)) {
        setError('Only images (JPG, PNG, GIF) and PDF files are accepted');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      }

      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const file = fileInputRef.current?.files?.[0];

      if (!registrationId) {
        setError('Registration not found. Please register first.');
        setIsLoading(false);
        return;
      }

      if (!formData.referenceNumber.trim()) {
        setError('Reference number is required');
        setIsLoading(false);
        return;
      }

      if (!formData.amount.trim()) {
        setError('Amount is required');
        setIsLoading(false);
        return;
      }

      if (!file) {
        setError('Payment proof is required');
        setIsLoading(false);
        return;
      }

      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('registrationId', registrationId);
      uploadFormData.append('referenceNumber', formData.referenceNumber);
      uploadFormData.append('amount', formData.amount);
      uploadFormData.append('paymentMethod', formData.paymentMethod);

      const response = await fetch('/api/payment', {
        method: 'POST',
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Payment submission failed');
        setIsLoading(false);
        return;
      }

      // Success!
      setSuccess(true);
      localStorage.removeItem('registrationId');

      // Redirect to confirmation after 2 seconds
      setTimeout(() => {
        router.push(`/confirmation?paymentId=${data.paymentId}`);
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-secondary/5 via-background to-primary/5">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            ← Back to Home
          </Button>
        </Link>

        {!success ? (
          <Card className="border-2 border-secondary/30">
            <CardHeader>
              <CardTitle className="text-3xl">Submit Payment Proof</CardTitle>
              <CardDescription>
                Upload your payment proof to complete your registration
              </CardDescription>
            </CardHeader>

            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method */}
                <FieldGroup>
                  <FieldLabel htmlFor="paymentMethod">Payment Method *</FieldLabel>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="bank-transfer">Bank Transfer</option>
                    <option value="gcash">GCash</option>
                    <option value="paymaya">PayMaya</option>
                    <option value="other">Other</option>
                  </select>
                </FieldGroup>

                {/* Reference Number */}
                <FieldGroup>
                  <FieldLabel htmlFor="referenceNumber">Reference Number *</FieldLabel>
                  <Input
                    id="referenceNumber"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleInputChange}
                    placeholder="e.g., TRNX20260421123456"
                    className="border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    You can find this in your payment confirmation
                  </p>
                </FieldGroup>

                {/* Amount */}
                <FieldGroup>
                  <FieldLabel htmlFor="amount">Amount Paid (PHP) *</FieldLabel>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="e.g., 1000"
                    className="border-border"
                  />
                </FieldGroup>

                {/* File Upload */}
                <div>
                  <FieldLabel className="mb-3 block">Upload Payment Proof *</FieldLabel>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors text-center"
                  >
                    {preview ? (
                      <div className="space-y-4">
                        <Image
                          src={preview}
                          alt="Payment proof preview"
                          width={300}
                          height={300}
                          className="mx-auto max-h-48 w-auto rounded"
                        />
                        <p className="text-sm text-muted-foreground">
                          Click to change the image
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-2xl">📸</p>
                        <p className="font-semibold text-foreground">
                          Click to upload payment proof
                        </p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, GIF or PDF (max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info box */}
                <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 space-y-4">
                  <h4 className="font-semibold text-foreground">Payment Instructions:</h4>
                  <div className="space-y-3 text-sm text-foreground/80">
                    <div>
                      <p className="font-medium">Bank Transfer (BDO / BPI / Metrobank)</p>
                      <p className="text-xs">Account details will be provided via email</p>
                    </div>
                    <div>
                      <p className="font-medium">GCash / PayMaya</p>
                      <p className="text-xs">Business account details will be provided via email</p>
                    </div>
                    <div className="text-xs text-muted-foreground border-t border-primary/20 pt-3 mt-3">
                      💡 Save your reference number from your payment confirmation. You will need it to upload your proof.
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-6 text-lg"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="w-4 h-4 mr-2" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Payment Proof'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-secondary/30 bg-gradient-to-br from-secondary/10 to-transparent">
            <CardContent className="pt-12 pb-12 text-center space-y-6">
              <div className="text-6xl">✓</div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">Payment Submitted!</h2>
                <p className="text-lg text-muted-foreground">
                  Thank you for your registration and payment.
                </p>
              </div>
              <p className="text-muted-foreground">
                Redirecting to confirmation page...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
