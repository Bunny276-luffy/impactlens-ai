import { NextResponse } from 'next/server';
// NextAuth has been permanently removed from this project.
// Authentication is handled via Supabase Auth JWT verification.
export async function GET() {
  return NextResponse.json({ error: 'NextAuth is not configured. Use /api/auth/login endpoint.' }, { status: 410 });
}
export async function POST() {
  return NextResponse.json({ error: 'NextAuth is not configured. Use /api/auth/login endpoint.' }, { status: 410 });
}
