import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const supabase = await createClient();

    const { data: registrations, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Generate CSV
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Race Category',
      'Phone',
      'Bib Number',
      'Status',
      'Created At',
    ];

    const rows = (registrations || []).map((reg) => [
      reg.id,
      reg.full_name,
      reg.email,
      reg.race_category,
      reg.phone || '',
      reg.bib_number || '',
      reg.status,
      new Date(reg.created_at).toLocaleDateString(),
    ]);

    const csv = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition':
          'attachment; filename="registrations.csv"',
      },
    });
  } catch (error) {
    console.error('Export registrations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
