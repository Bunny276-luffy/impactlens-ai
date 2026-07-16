import { NextRequest } from 'next/server';
import { getBeneficiary, updateBeneficiary, deleteBeneficiary } from '@/services/beneficiaryService';
import { ok, notFound, serverError } from '@/lib/response';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const beneficiary = await getBeneficiary(id);
    if (!beneficiary) return notFound('Beneficiary');
    return ok(beneficiary);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = await updateBeneficiary(id, body);
    if (!updated) return notFound('Beneficiary');
    return ok(updated);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await deleteBeneficiary(id);
    return ok({ deleted: true });
  } catch (err: any) {
    return serverError(err.message);
  }
}
