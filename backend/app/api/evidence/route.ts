import { NextRequest } from 'next/server';
import { listEvidence, createEvidence } from '@/services/evidenceService';
import { ok, created, error, serverError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listEvidence({
      activity_id: searchParams.get('activity_id') || undefined,
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
    if (!body.activity_id || !body.file_url || !body.file_type || !body.file_name) {
      return error('activity_id, file_url, file_type, and file_name are required');
    }
    const evidence = await createEvidence(body);
    return created(evidence);
  } catch (err: any) {
    return serverError(err.message);
  }
}
