import { NextResponse } from 'next/server';
import { Repository } from '@/lib/repository';

export async function GET() {
  try {
    const analytics = await Repository.getAnalytics();
    return NextResponse.json(analytics);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
