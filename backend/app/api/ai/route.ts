import { NextRequest } from 'next/server';
import { getRecommendations } from '@/services/aiService';
import { ok, error, serverError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ngoId = searchParams.get('ngo_id');
    if (!ngoId) return error('ngo_id query param is required');
    const recommendations = await getRecommendations(ngoId);
    return ok(recommendations);
  } catch (err: any) {
    return serverError(err.message);
  }
}
