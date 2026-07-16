import { NextResponse } from 'next/server';
// This route is a dead stub — the api/services folder should not be an API route.
export async function GET() {
  return NextResponse.json({ error: 'Not Found' }, { status: 404 });
}
