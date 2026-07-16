import { NextRequest } from 'next/server';
import { listActivities, createActivity } from '@/services/activityService';
import { ok, created, error, serverError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listActivities({
      ngo_id: searchParams.get('ngo_id') || undefined,
      volunteer_id: searchParams.get('volunteer_id') || undefined,
      beneficiary_id: searchParams.get('beneficiary_id') || undefined,
      program_id: searchParams.get('program_id') || undefined,
      status: searchParams.get('status') || undefined,
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
    if (!body.ngo_id || !body.volunteer_id || !body.title || !body.activity_date) {
      return error('ngo_id, volunteer_id, title, and activity_date are required');
    }
    const activity = await createActivity(body);
    return created(activity);
  } catch (err: any) {
    return serverError(err.message);
  }
}
