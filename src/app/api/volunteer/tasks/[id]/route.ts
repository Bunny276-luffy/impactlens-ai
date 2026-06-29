import { NextResponse } from 'next/server';
import { Repository } from '@/lib/repository';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!body.status) {
      return NextResponse.json({ error: 'Missing required field: status' }, { status: 400 });
    }
    const updatedTask = await Repository.updateTask(id, { status: body.status });
    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTask);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
