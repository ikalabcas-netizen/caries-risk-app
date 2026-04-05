import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { AssessmentFormData } from '@/lib/types';
import { calculateRiskLevel, calculateSOHI } from '@/lib/risk-calculator';

export async function POST(request: NextRequest) {
  try {
    const body: AssessmentFormData = await request.json();

    if (!body.patient_name?.trim()) {
      return NextResponse.json({ error: 'Patient name is required' }, { status: 400 });
    }

    // Clean empty strings to null for DB compatibility
    const cleaned = Object.fromEntries(
      Object.entries(body).map(([k, v]) => [k, v === '' ? null : v])
    ) as AssessmentFormData;

    // Server-side recalculation
    const sohi = calculateSOHI([
      cleaned.plaque_16b, cleaned.plaque_11la, cleaned.plaque_26b,
      cleaned.plaque_46li, cleaned.plaque_31la, cleaned.plaque_36li,
    ]);
    cleaned.calculated_sohi = sohi;

    const { riskLevel } = calculateRiskLevel(cleaned);
    cleaned.risk_level = riskLevel;

    const { data, error } = await getSupabase()
      .from('assessments')
      .insert([cleaned])
      .select('id, created_at, risk_level')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const riskLevel = searchParams.get('risk_level') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = (page - 1) * limit;

  let query = getSupabase()
    .from('assessments')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (search) {
    query = query.ilike('patient_name', `%${search}%`);
  }
  if (riskLevel) {
    query = query.eq('risk_level', riskLevel);
  }

  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, total: count, page, limit });
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }

    const { error } = await getSupabase()
      .from('assessments')
      .delete()
      .in('id', ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ deleted: ids.length });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
