import { NextRequest } from 'next/server';
import { getAnalyticsSnapshot } from '@/services/analyticsService';
import { ok, serverError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ngoId = searchParams.get('ngo_id') || undefined;
    const snapshot = await getAnalyticsSnapshot(ngoId);
    return ok(snapshot);
  } catch (err: any) {
    console.error('[analytics]', err);
    return serverError(err.message);
  }
}
