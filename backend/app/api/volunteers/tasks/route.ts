import { NextRequest } from 'next/server';
import { getVolunteerTasks } from '@/services/volunteerService';
import { ok, error, serverError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const volunteerId = searchParams.get('volunteer_id');
    if (!volunteerId) return error('volunteer_id query param is required');
    const tasks = await getVolunteerTasks(volunteerId);
    return ok(tasks);
  } catch (err: any) {
    return serverError(err.message);
  }
}
