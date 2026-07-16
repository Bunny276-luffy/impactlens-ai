import { NextResponse } from 'next/server';
export async function GET() {
  return NextResponse.json({ error: 'Gone — endpoint deprecated' }, { status: 410 });
}
export async function POST() {
  return NextResponse.json({ error: 'Gone — endpoint deprecated' }, { status: 410 });
}
