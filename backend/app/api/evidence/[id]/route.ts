import { NextRequest } from 'next/server';
import { deleteEvidence } from '@/services/evidenceService';
import { ok, notFound, serverError } from '@/lib/response';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    return notFound('Not implemented');
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteEvidence(id);
    return ok({ deleted: true });
  } catch (err: any) {
    return serverError(err.message);
  }
}
