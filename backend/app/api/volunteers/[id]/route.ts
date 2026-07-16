import { NextRequest } from 'next/server';
import { getVolunteer, updateVolunteer, deleteVolunteer } from '@/services/volunteerService';
import { ok, notFound, serverError } from '@/lib/response';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const volunteer = await getVolunteer(id);
    if (!volunteer) return notFound('Volunteer');
    return ok(volunteer);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateVolunteer(id, body);
    if (!updated) return notFound('Volunteer');
    return ok(updated);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteVolunteer(id);
    return ok({ deleted: true });
  } catch (err: any) {
    return serverError(err.message);
  }
}
