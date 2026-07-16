import { NextRequest } from 'next/server';
import { listDonations, createDonation } from '@/services/donationService';
import { ok, created, error, serverError } from '@/lib/response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const result = await listDonations({
      ngo_id: searchParams.get('ngo_id') || undefined,
      donor_id: searchParams.get('donor_id') || undefined,
      beneficiary_id: searchParams.get('beneficiary_id') || undefined,
      category: searchParams.get('category') || undefined,
      status: searchParams.get('status') || undefined,
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
    if (!body.ngo_id || !body.amount || !body.category) {
      return error('ngo_id, amount, and category are required');
    }
    if (body.amount <= 0) {
      return error('Amount must be greater than 0');
    }
    const donation = await createDonation(body);
    return created(donation);
  } catch (err: any) {
    return serverError(err.message);
  }
}
