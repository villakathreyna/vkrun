'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  totalRegistrations: number;
  totalPayments: number;
  pendingPayments: number;
  verifiedPayments: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch('/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        setStats(data.stats);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('[v0] Dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
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
            <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Spectrum of Strength Run 2026
            </p>
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

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {/* Total Registrations */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Registrations</p>
              <p className="text-3xl font-bold text-foreground">
                {stats.totalRegistrations}
              </p>
            </div>

            {/* Total Payments */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Payments</p>
              <p className="text-3xl font-bold text-primary">
                {stats.totalPayments}
              </p>
            </div>

            {/* Pending Payments */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Pending Review</p>
              <p className="text-3xl font-bold text-secondary">
                {stats.pendingPayments}
              </p>
            </div>

            {/* Verified Payments */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Verified</p>
              <p className="text-3xl font-bold text-green-600">
                {stats.verifiedPayments}
              </p>
            </div>

            {/* Total Revenue */}
            <div className="bg-card border border-border rounded-lg p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
              <p className="text-2xl font-bold text-foreground">
                ₱{stats.totalRevenue.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Registrations */}
          <Link
            href="/admin/registrations"
            className="block bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a7 7 0 1114 0v-2H6v2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground ml-3">
                Manage Registrations
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              View and manage all race registrations
            </p>
          </Link>

          {/* Payments */}
          <Link
            href="/admin/payments"
            className="block bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground ml-3">
                Review Payments
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Verify and match payment submissions
            </p>
          </Link>

          {/* Export Data */}
          <Link
            href="/admin/export"
            className="block bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all"
          >
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground ml-3">
                Export Data
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Download CSV reports for registrations and payments
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
