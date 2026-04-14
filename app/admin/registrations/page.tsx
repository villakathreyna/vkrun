'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Registration {
  id: string;
  full_name: string;
  email: string;
  race_category: string;
  bib_number?: string;
  status: string;
  created_at: string;
}

export default function AdminRegistrationsPage() {
  const router = useRouter();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await fetch('/api/admin/registrations', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch registrations');
        }

        const data = await response.json();
        setRegistrations(data.registrations || []);
      } catch (err) {
        setError('Failed to load registrations');
        console.error('[v0] Registrations error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrations();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleExportCSV = () => {
    const csv = [
      ['ID', 'Name', 'Email', 'Race Category', 'Bib Number', 'Status', 'Created At'],
      ...filteredRegistrations.map((reg) => [
        reg.id,
        reg.full_name,
        reg.email,
        reg.race_category,
        reg.bib_number || '',
        reg.status,
        new Date(reg.created_at).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === 'all' || reg.status === filterStatus;
    return matchesSearch && matchesStatus;
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
      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-8">
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {/* Filters and Export */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4 flex-col md:flex-row">
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
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
            >
              Export CSV
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Total: {filteredRegistrations.length} registrations
          </p>
        </div>

        {/* Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Bib
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRegistrations.length > 0 ? (
                  filteredRegistrations.map((reg) => (
                    <tr
                      key={reg.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-3 text-sm text-foreground">
                        {reg.full_name}
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {reg.email}
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground">
                        {reg.race_category}
                      </td>
                      <td className="px-6 py-3 text-sm text-foreground">
                        {reg.bib_number || '-'}
                      </td>
                      <td className="px-6 py-3 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            reg.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : reg.status === 'completed'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-sm text-muted-foreground">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-muted-foreground"
                    >
                      No registrations found
                    </td>
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
