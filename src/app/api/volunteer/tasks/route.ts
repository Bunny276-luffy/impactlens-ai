import { NextResponse } from 'next/server';
import { Repository } from '@/lib/repository';

export async function GET() {
  try {
    const tasks = await Repository.getTasks();
    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
