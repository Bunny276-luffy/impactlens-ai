import { NextResponse } from 'next/server';
import { Repository } from '@/lib/repository';

export async function GET() {
  try {
    const donations = await Repository.getDonations();
    return NextResponse.json(donations);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.amount || !body.usage || !body.donorId || !body.ngoId) {
      return NextResponse.json({ error: 'Missing required fields (amount, usage, donorId, ngoId)' }, { status: 400 });
    }
    const newDonation = await Repository.createDonation(body);
    return NextResponse.json(newDonation, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
