import { Suspense } from 'react';
import { ConfirmationContent } from '@/components/confirmation-content';

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div />}>
      <ConfirmationContent />
    </Suspense>
  );
}
