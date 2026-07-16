import { NextRequest } from 'next/server';
import { getNGOProfile, updateNGOProfile } from '@/services/ngoService';
import { ok, serverError, unauthorized, error as badRequest } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return badRequest('Missing id parameter');
    const profile = await getNGOProfile(id);
    if (!profile) return unauthorized('Not found');
    return ok(profile);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.id) return badRequest('Missing id parameter in body');
    const profile = await updateNGOProfile(body.id, body);
    return ok(profile);
  } catch (err: any) {
    return serverError(err.message);
  }
}
