import { NextRequest } from 'next/server';
import { listPrograms, createProgram } from '@/services/programService';
import { ok, created, error, serverError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listPrograms({
      ngo_id: searchParams.get('ngo_id') || undefined,
      status: searchParams.get('status') || undefined,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined,
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
    if (!body.ngo_id || !body.name || !body.category) {
      return error('ngo_id, name, and category are required');
    }
    const program = await createProgram(body);
    return created(program);
  } catch (err: any) {
    return serverError(err.message);
  }
}
