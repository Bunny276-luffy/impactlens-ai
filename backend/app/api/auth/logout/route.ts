import { NextRequest } from 'next/server';
import { logoutUser } from '@/services/authService';
import { verifyAuth } from '@/lib/auth';
import { ok, unauthorized, serverError } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (user) {
      await logoutUser(user.id);
    }
    return ok({ message: 'Logged out successfully' });
  } catch (err: any) {
    console.error('[auth/logout]', err);
    return serverError(err.message);
  }
}
