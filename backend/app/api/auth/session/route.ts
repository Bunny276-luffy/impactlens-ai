import { NextRequest } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { ok, unauthorized } from '@/lib/response';

export async function GET(req: NextRequest) {
  const user = await verifyAuth(req);
  if (!user) {
    return unauthorized('No valid session found');
  }
  return ok({ user });
}
