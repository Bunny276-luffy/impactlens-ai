import { NextRequest } from 'next/server';
import { getActivity, updateActivity, deleteActivity } from '@/services/activityService';
import { ok, notFound, serverError } from '@/lib/response';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const activity = await getActivity(id);
    if (!activity) return notFound('Activity');
    return ok(activity);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateActivity(id, body);
    if (!updated) return notFound('Activity');
    return ok(updated);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteActivity(id);
    return ok({ deleted: true });
  } catch (err: any) {
    return serverError(err.message);
  }
}
