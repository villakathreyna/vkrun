'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Payment {
  id: string;
  registration_id: string;
  email: string;
  reference_number: string;
  amount: number;
  proof_url: string;
  status: 'pending' | 'verified' | 'rejected';
  confidence?: string;
  created_at: string;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'created_at' | 'amount'>('created_at');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Filter and sort payments client-side (must be before return, not inside JSX)
  const filteredAndSortedPayments = payments
    .filter((p) => filterStatus === 'all' || p.status === filterStatus)
    .sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'created_at') {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'amount') {
        cmp = (a.amount || 0) - (b.amount || 0);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        // Always fetch all payments, filtering is done client-side
        const response = await fetch(
          `/api/admin/payments?status=all`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch payments');
        }

        const data = await response.json();
        setPayments(data.payments || []);
      } catch (err) {
        setError('Failed to load payments');
        console.error('[v0] Payments error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleVerifyPayment = async (paymentId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/payments/${paymentId}/verify`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to verify payment');
      }

      setPayments(payments.filter((p) => p.id !== paymentId));
      setShowPreview(false);
      setSelectedPayment(null);
    } catch (err) {
      setError('Failed to verify payment');
      console.error('[v0] Verify error:', err);
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/payments/${paymentId}/reject`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to reject payment');
      }

      setPayments(payments.filter((p) => p.id !== paymentId));
      setShowPreview(false);
      setSelectedPayment(null);
    } catch (err) {
      setError('Failed to reject payment');
      console.error('[v0] Reject error:', err);
    }
  };

  const handleExportCSV = () => {
    const csv = [
      ['ID', 'Email', 'Reference', 'Amount', 'Status', 'Confidence', 'Date'],
      ...payments.map((payment) => [
        payment.id,
        payment.email,
        payment.reference_number,
        payment.amount,
        payment.status,
        payment.confidence || '',
        new Date(payment.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <Link
              href="/admin/dashboard"
              className="text-primary hover:underline text-sm"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-foreground mt-2">
              Payment Verification
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-8">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Filter */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2">
            Status:
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2 py-1 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            Sort by:
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as 'created_at' | 'amount')}
              className="px-2 py-1 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="created_at">Date</option>
              <option value="amount">Amount</option>
            </select>
          </label>
          <label className="flex items-center gap-2">
            Order:
            <select
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
              className="px-2 py-1 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </label>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
          >
            Export CSV
          </button>
          <p className="text-sm text-muted-foreground py-2">
            Total: {filteredAndSortedPayments.length} payments
          </p>
        </div>

        {/* Payment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedPayments.length > 0 ? (
            filteredAndSortedPayments.map((payment) => (
              <div
                key={payment.id}
                className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => {
                  setSelectedPayment(payment);
                  setShowPreview(true);
                }}
              >
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Reference</p>
                    <p className="text-sm font-semibold text-foreground">
                      {payment.reference_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-bold text-primary">
                      ₱{typeof payment.amount === 'number' ? payment.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                      }) : '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground truncate">
                      {payment.email}
                    </p>
                  </div>
                  {payment.confidence && (
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="text-sm text-foreground capitalize">
                        {payment.confidence}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No payments found</p>
            </div>
          )}
        </div>
      </main>

      {/* Preview Modal */}
      {showPreview && selectedPayment && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Payment Details
              </h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Reference</p>
                  <p className="text-lg font-semibold text-foreground">
                    {selectedPayment.reference_number}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="text-lg font-semibold text-primary">
                    ₱{selectedPayment && typeof selectedPayment.amount === 'number'
                      ? selectedPayment.amount.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })
                      : '0.00'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="text-foreground">{selectedPayment.email}</p>
                </div>
              </div>

              {/* Proof Image */}
              <div>
                <p className="text-sm text-muted-foreground mb-2">Proof of Payment</p>
                <img
                  src={selectedPayment.proof_url}
                  alt="Payment proof"
                  className="w-full rounded-lg border border-border"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleVerifyPayment(selectedPayment.id)}
                  className="flex-1 bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Verify Payment
                </button>
                <button
                  onClick={() => handleRejectPayment(selectedPayment.id)}
                  className="flex-1 bg-destructive text-destructive-foreground font-semibold py-2 rounded-lg hover:bg-destructive/90 transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
