import { NextRequest } from 'next/server';
import { listNotifications, markAllRead } from '@/services/notificationService';
import { verifyAuth } from '@/lib/auth';
import { ok, unauthorized, serverError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorized();
    const { searchParams } = new URL(req.url);
    const result = await listNotifications({
      user_id: user.id,
      is_read: searchParams.get('is_read') === 'true' ? true : searchParams.get('is_read') === 'false' ? false : undefined,
      page: Number(searchParams.get('page') || 1),
      limit: Number(searchParams.get('limit') || 20),
    });
    return ok(result);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorized();
    await markAllRead(user.id);
    return ok({ message: 'All notifications marked as read' });
  } catch (err: any) {
    return serverError(err.message);
  }
}
