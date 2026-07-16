import { Donation, PaginatedResponse } from '../lib/types';
import { createScopedClient, supabase as adminClient } from '../lib/supabase';

export interface DonationFilters {
  ngo_id?: string;
  donor_id?: string;
  beneficiary_id?: string;
  category?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateDonationInput {
  ngo_id: string;
  donor_id?: string;
  beneficiary_id?: string;
  program_id?: string;
  amount: number;
  currency?: string;
  category: Donation['category'];
  note?: string;
}

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function listDonations(filters: DonationFilters, token?: string): Promise<PaginatedResponse<Donation>> {
  const client = getClient(token);
  let query = client.from('donations').select('*', { count: 'exact' });

  if (filters.ngo_id) query = query.eq('ngo_id', filters.ngo_id);
  if (filters.donor_id) query = query.eq('donor_id', filters.donor_id);
  if (filters.beneficiary_id) query = query.eq('beneficiary_id', filters.beneficiary_id);

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  query = query.range(start, start + limit - 1).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: data as Donation[],
    total: count || 0,
    page,
    limit,
    has_more: (count || 0) > start + limit,
  };
}

export async function getDonation(id: string, token?: string): Promise<Donation | null> {
  const { data, error } = await getClient(token).from('donations').select('*').eq('id', id).single();
  if (error) return null;
  return data as Donation;
}

export async function createDonation(input: CreateDonationInput, token?: string): Promise<Donation> {
  const { data, error } = await getClient(token).from('donations').insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Donation;
}

export async function getTotalRaised(ngoId: string, token?: string): Promise<number> {
  const { data, error } = await getClient(token).from('donations').select('amount').eq('ngo_id', ngoId);
  if (error || !data) return 0;
  return data.reduce((acc, curr) => acc + Number(curr.amount), 0);
}
