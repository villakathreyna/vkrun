// Payment Matching Utility
// Matches payment submissions to registrations based on amount and reference number

interface Registration {
  id: string;
  email: string;
  race_category: string;
  price: number;
}

interface PaymentMatch {
  registrationId: string;
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

// Define category prices
const CATEGORY_PRICES: Record<string, number> = {
  '3km': 800,
  '5km': 900,
  '10km': 1100,
};

export function matchPaymentToRegistration(
  payment: {
    amount: number;
    referenceNumber: string;
    email: string;
  },
  registrations: Registration[]
): PaymentMatch | null {
  const matches: PaymentMatch[] = [];

  // Filter registrations by email first
  const emailMatches = registrations.filter(
    (reg) => reg.email.toLowerCase() === payment.email.toLowerCase()
  );

  if (emailMatches.length === 1) {
    const reg = emailMatches[0];
    const expectedPrice = CATEGORY_PRICES[reg.race_category];

    // Exact amount match
    if (payment.amount === expectedPrice) {
      matches.push({
        registrationId: reg.id,
        confidence: 'high',
        reason: `Email and amount match for ${reg.race_category}`,
      });
    }
    // Amount within tolerance (±100 PHP)
    else if (Math.abs(payment.amount - expectedPrice) <= 100) {
      matches.push({
        registrationId: reg.id,
        confidence: 'medium',
        reason: `Email matches; amount within tolerance`,
      });
    }
  }

  // If no email match, try amount matching
  if (matches.length === 0) {
    for (const price of Object.values(CATEGORY_PRICES)) {
      if (payment.amount === price) {
        const categoryRegs = registrations.filter(
          (reg) => CATEGORY_PRICES[reg.race_category] === price
        );

        if (categoryRegs.length === 1) {
          matches.push({
            registrationId: categoryRegs[0].id,
            confidence: 'high',
            reason: `Amount uniquely matches ${categoryRegs[0].race_category} registration`,
          });
          break;
        } else if (categoryRegs.length > 1) {
          // Multiple registrations with same price
          matches.push({
            registrationId: categoryRegs[0].id,
            confidence: 'low',
            reason: `Amount matches multiple registrations; manual review needed`,
          });
          break;
        }
      }
    }
  }

  return matches.length > 0 ? matches[0] : null;
}

export function validatePaymentAmount(
  amount: number,
  raceCategory: string
): boolean {
  const expectedPrice = CATEGORY_PRICES[raceCategory];
  if (!expectedPrice) return false;

  // Allow ±100 PHP tolerance
  return Math.abs(amount - expectedPrice) <= 100;
}

export function getPriceForCategory(category: string): number {
  return CATEGORY_PRICES[category] || 0;
}
