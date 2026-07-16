import { NextRequest } from 'next/server';
import { updateVolunteerTask } from '@/services/volunteerService';
import { ok, notFound, error, serverError } from '@/lib/response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    if (!body.status) return error('status is required');
    const task = await updateVolunteerTask(id, body.status);
    if (!task) return notFound('Task');
    return ok(task);
  } catch (err: any) {
    return serverError(err.message);
  }
}
