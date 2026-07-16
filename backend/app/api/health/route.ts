import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'ImpactLens AI Backend',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    database: 'pending — Supabase integration not yet connected',
  });
}
