import { NextResponse } from 'next/server';
import { Repository } from '@/lib/repository';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user_ngo';
    const notifications = await Repository.getNotifications(userId);
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.userId || !body.type || !body.title || !body.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const newNot = await Repository.createNotification(body);
    return NextResponse.json(newNot, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
