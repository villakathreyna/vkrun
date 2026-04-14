'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Registration {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address?: string;
  birthday?: string;
  gender?: string;
  team?: string;
  distance_category: string;
  price_php: number;
  finisher_shirt?: boolean;
  status: string;
  created_at: string;
  amount_php?: number;
  payment_method?: string;
  payment_proof_url?: string;
  verification_status?: string;
  verified_by_admin_id?: string;
  verified_at?: string;
}

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterFinisherShirt, setFilterFinisherShirt] = useState<'all' | 'yes' | 'no'>('all');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const response = await fetch('/api/admin/registrations');
        if (!response.ok) {
          throw new Error('Failed to fetch registrations');
        }
        const data = await response.json();
        console.log('[DEBUG] Fetched registrations:', data.registrations);
        setRegistrations(data.registrations || []);
      } catch (err) {
        setError('Failed to load registrations');
        console.error('[v0] Registrations error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  // Helper to compute age as of June 21, 2026
  function computeAge(birthday?: string): number | string {
    if (!birthday) return '';
    const birthDate = new Date(birthday);
    const refDate = new Date('2026-06-21');
    let age = refDate.getFullYear() - birthDate.getFullYear();
    const m = refDate.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && refDate.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  function getAmount(reg: Registration): number {
    const regDate = new Date(reg.created_at);
    const cutoff = new Date('2026-05-11');
    return regDate >= cutoff ? Number(reg.price_php) + 100 : Number(reg.price_php);
  }


  async function handleVerifyPayment(registrationId: string) {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await fetch(`/api/admin/payments/verify-by-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ registration_id: registrationId }),
      });
      if (!res.ok) {
        alert('Failed to verify payment');
      } else {
        // Optimistically update the local state
        setRegistrations((prev) =>
          prev.map((reg) =>
            reg.id === registrationId
              ? {
                  ...reg,
                  verification_status: 'verified',
                  status: 'verified',
                  verified_by_admin_id: token || '',
                  verified_at: new Date().toISOString(),
                }
              : reg
          )
        );
        alert('Payment verified!');
      }
    } catch (err) {
      alert('Error verifying payment');
    }
  }

  // CSV Export using backend endpoint
  async function handleExportCSV() {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/export/registrations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Failed to export registrations');
    }
  }

  // Filtered registrations
  const filteredRegistrations = registrations.filter((reg: Registration) => {
    const matchesSearch =
      (`${reg.last_name}, ${reg.first_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (reg.email || '').toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === 'all' || reg.status === filterStatus;
    const matchesFinisher =
      filterFinisherShirt === 'all' ||
      (filterFinisherShirt === 'yes' && reg.finisher_shirt) ||
      (filterFinisherShirt === 'no' && !reg.finisher_shirt);
    return matchesSearch && matchesStatus && matchesFinisher;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
          <p className="text-muted-foreground">Loading registrations...</p>
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
              Manage Registrations
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
      <main className="max-w-[98vw] xl:max-w-[1600px] mx-auto px-2 py-6">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-8">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Filters and Export */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 flex-col md:flex-row text-xs">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterFinisherShirt}
              onChange={e => setFilterFinisherShirt(e.target.value as 'all' | 'yes' | 'no')}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Finisher Shirt</option>
              <option value="yes">With Finisher Shirt</option>
              <option value="no">No Finisher Shirt</option>
            </select>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
            >
              Export CSV
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Total: {filteredRegistrations.length} registrations
          </p>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[11px] md:text-xs lg:text-xs xl:text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Surname, First Name</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Address</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Birthday</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Age</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Contact</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Gender</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Team</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Distance</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Finisher Shirt</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Amount Due</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Amount Paid</th>
                  {/* Removed Status column */}
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Payment Verification</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Proof of Payment</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Registered</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-2 text-xs text-foreground">{reg.last_name}, {reg.first_name}</td>
                      <td className="px-4 py-2 text-xs text-foreground">{reg.address || '-'}</td>
                      <td className="px-4 py-2 text-xs text-foreground">{reg.birthday ? new Date(reg.birthday).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-2 text-xs text-foreground">{computeAge(reg.birthday)}</td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{reg.email}</td>
                      <td className="px-4 py-2 text-xs text-foreground">{reg.phone}</td>
                      <td className="px-4 py-2 text-xs text-foreground">{reg.gender || '-'}</td>
                      <td className="px-4 py-2 text-xs text-foreground">{reg.team || '-'}</td>
                      <td className="px-4 py-2 text-xs text-foreground">{reg.distance_category}</td>
                      <td className="px-4 py-2 text-xs text-foreground">
                        {reg.finisher_shirt ? (
                          <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold">Yes</span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs">No</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-xs text-foreground">₱{getAmount(reg).toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                      <td className="px-4 py-2 text-xs text-foreground">{typeof reg.amount_php === 'number' ? `₱${reg.amount_php.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}</td>
                      {/* Removed Status cell */}
                      <td className="px-4 py-2 text-xs">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          reg.verification_status === 'verified'
                            ? 'bg-green-100 text-green-800'
                            : reg.verification_status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {reg.verification_status || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-xs">
                        {reg.payment_proof_url ? (
                          <a href={reg.payment_proof_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                            View Proof
                          </a>
                        ) : (
                          <span className="text-muted-foreground">No file</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-xs text-muted-foreground">{new Date(reg.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-2 text-xs">
                        {reg.verification_status !== 'verified' && (
                          <button
                            className="px-3 py-1 bg-primary text-white rounded hover:bg-primary/80 text-xs"
                            onClick={() => handleVerifyPayment(reg.id)}
                          >
                            Verify Payment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={13} className="px-6 py-8 text-center text-muted-foreground">No registrations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
