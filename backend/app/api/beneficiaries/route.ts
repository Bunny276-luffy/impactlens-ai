import { NextRequest } from 'next/server';
import { listBeneficiaries, createBeneficiary } from '@/services/beneficiaryService';
import { ok, created, error, serverError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      ngo_id: searchParams.get('ngo_id') || undefined,
      program_id: searchParams.get('program_id') || undefined,
      risk_level: searchParams.get('risk_level') || undefined,
      search: searchParams.get('search') || undefined,
      page: Number(searchParams.get('page') || 1),
      limit: Number(searchParams.get('limit') || 20),
    };
    const result = await listBeneficiaries(filters);
    return ok(result);
  } catch (err: any) {
    return serverError(err.message);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.ngo_id || !body.name || !body.age || !body.gender) {
      return error('ngo_id, name, age, and gender are required');
    }
    const beneficiary = await createBeneficiary(body);
    return created(beneficiary);
  } catch (err: any) {
    return serverError(err.message);
  }
}
