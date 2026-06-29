import { NextResponse } from 'next/server';
import { Repository } from '@/lib/repository';

export async function GET() {
  try {
    const children = await Repository.getChildren();
    return NextResponse.json(children);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.age || !body.gender || !body.ngoId) {
      return NextResponse.json({ error: 'Missing required fields (name, age, gender, ngoId)' }, { status: 400 });
    }
    const newChild = await Repository.createChild(body);
    return NextResponse.json(newChild, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
