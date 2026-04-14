'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminExportPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleExportRegistrations = async () => {
    setIsLoading(true);
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
      console.error('[v0] Export error:', err);
      alert('Failed to export registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPayments = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/export/payments', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[v0] Export error:', err);
      alert('Failed to export payments');
    } finally {
      setIsLoading(false);
    }
  };

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
              Export Data
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
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-6">
          {/* Registrations Export */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Export Registrations
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download all registration data as CSV file. Includes names,
                  emails, race categories, and status information.
                </p>
                <button
                  onClick={handleExportRegistrations}
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Exporting...' : 'Download CSV'}
                </button>
              </div>
            </div>
          </div>

          {/* Payments Export */}
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center flex-shrink-0">
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
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Export Payments
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Download all payment data as CSV file. Includes reference
                  numbers, amounts, emails, and verification status.
                </p>
                <button
                  onClick={handleExportPayments}
                  disabled={isLoading}
                  className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Exporting...' : 'Download CSV'}
                </button>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="bg-muted/50 border border-border rounded-lg p-6">
            <h4 className="font-semibold text-foreground mb-3">Export Notes:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Files are generated in CSV format for easy importing</li>
              <li>• Timestamps use standard date format</li>
              <li>• All currency values are in PHP (₱)</li>
              <li>• Files are named with the current date for easy tracking</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
