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

    // Generate CSV with all display fields including payment and verification
    const headers = [
      'Surname, First Name',
      'Address',
      'Birthday',
      'Age',
      'Email',
      'Contact',
      'Gender',
      'Team',
      'Distance',
      'Finisher Shirt',
      'Amount Paid',
      'Status',
      'Payment Method',
      'Payment Proof URL',
      'Verification Status',
      'Registered',
    ];

    function computeAge(birthday) {
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

    function getAmount(reg) {
      const regDate = new Date(reg.created_at);
      const cutoff = new Date('2026-05-11');
      return regDate >= cutoff ? Number(reg.price_php) + 100 : Number(reg.price_php);
    }

    const rows = (registrations || []).map((reg) => [
      `${reg.last_name}, ${reg.first_name}`,
      reg.address || '',
      reg.birthday ? new Date(reg.birthday).toLocaleDateString() : '',
      computeAge(reg.birthday),
      reg.email,
      reg.phone,
      reg.gender || '',
      reg.team || '',
      reg.distance_category,
      reg.finisher_shirt ? 'Yes' : 'No',
      getAmount(reg).toLocaleString('en-US', { minimumFractionDigits: 2 }),
      reg.status,
      reg.payment_method || '',
      reg.payment_proof_url || '',
      reg.verification_status || '',
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
