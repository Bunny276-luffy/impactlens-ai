import { NextRequest } from 'next/server';
import { listVolunteers, createVolunteer } from '@/services/volunteerService';
import { ok, created, error, serverError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listVolunteers({
      ngo_id: searchParams.get('ngo_id') || undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      page: Number(searchParams.get('page') || 1),
      limit: Number(searchParams.get('limit') || 20),
    });
    return ok(result);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.ngo_id || !body.name || !body.email) {
      return error('ngo_id, name, and email are required');
    }
    const volunteer = await createVolunteer(body);
    return created(volunteer);
  } catch (err: any) {
    return serverError(err.message);
  }
}
