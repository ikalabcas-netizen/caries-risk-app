import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'json';

  const { data, error } = await getSupabase()
    .from('assessments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const records = data || [];

  if (format === 'json') {
    return new NextResponse(JSON.stringify(records, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': 'attachment; filename="assessments.json"',
      },
    });
  }

  if (format === 'csv') {
    if (records.length === 0) {
      return new NextResponse('', {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="assessments.csv"',
        },
      });
    }
    const headers = Object.keys(records[0]);
    const csvRows = [
      headers.join(','),
      ...records.map(row =>
        headers.map(h => {
          const val = row[h];
          if (val === null || val === undefined) return '';
          const str = String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      ),
    ];
    return new NextResponse(csvRows.join('\n'), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="assessments.csv"',
      },
    });
  }

  if (format === 'xlsx') {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(records);
    XLSX.utils.book_append_sheet(wb, ws, 'Assessments');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    return new NextResponse(buf, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': 'attachment; filename="assessments.xlsx"',
      },
    });
  }

  return NextResponse.json({ error: 'Invalid format. Use json, csv, or xlsx.' }, { status: 400 });
}
