import { NextRequest } from 'next/server';
import { markNotificationRead } from '@/services/notificationService';
import { verifyAuth } from '@/lib/auth';
import { ok, unauthorized, notFound, serverError } from '@/lib/response';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await verifyAuth(req);
    if (!user) return unauthorized();
    const { id } = await params;
    const notification = await markNotificationRead(id);
    if (!notification) return notFound('Notification');
    return ok(notification);
  } catch (err: any) {
    return serverError(err.message);
  }
}
