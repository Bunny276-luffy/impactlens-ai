import { NextResponse } from 'next/server';
import { Repository } from '@/lib/repository';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const child = await Repository.getChildById(id);
    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }
    return NextResponse.json(child);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await Repository.updateChild(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await Repository.deleteChild(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Child record deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
