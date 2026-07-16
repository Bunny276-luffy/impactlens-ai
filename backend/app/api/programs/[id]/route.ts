import { NextRequest } from 'next/server';
import { getProgram, updateProgram, deleteProgram } from '@/services/programService';
import { ok, notFound, serverError } from '@/lib/response';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const program = await getProgram(id);
    if (!program) return notFound('Program');
    return ok(program);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateProgram(id, body);
    if (!updated) return notFound('Program');
    return ok(updated);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteProgram(id);
    return ok({ deleted: true });
  } catch (err: any) {
    return serverError(err.message);
  }
}
