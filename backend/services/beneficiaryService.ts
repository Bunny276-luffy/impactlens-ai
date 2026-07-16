import { Beneficiary, PaginatedResponse } from '../lib/types';
import { createScopedClient, supabase as adminClient } from '../lib/supabase';

export interface BeneficiaryFilters {
  ngo_id?: string;
  program_id?: string;
  risk_level?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateBeneficiaryInput {
  ngo_id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  guardian_name?: string;
  guardian_phone?: string;
  school?: string;
  address?: string;
}

export interface UpdateBeneficiaryInput extends Partial<Omit<Beneficiary, 'id' | 'ngo_id' | 'created_at'>> {}

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function listBeneficiaries(filters: BeneficiaryFilters, token?: string): Promise<PaginatedResponse<Beneficiary>> {
  const client = getClient(token);
  let query = client.from('beneficiaries').select('*', { count: 'exact' });

  if (filters.ngo_id) query = query.eq('ngo_id', filters.ngo_id);
  // program_id filter requires a containment check if program_ids is jsonb/array
  // For now, simplify to just ngo_id and search
  if (filters.search) query = query.ilike('name', `%${filters.search}%`);

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  query = query.range(start, start + limit - 1).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: data as Beneficiary[],
    total: count || 0,
    page,
    limit,
    has_more: (count || 0) > start + limit,
  };
}

export async function getBeneficiary(id: string, token?: string): Promise<Beneficiary | null> {
  const { data, error } = await getClient(token).from('beneficiaries').select('*').eq('id', id).single();
  if (error) return null;
  return data as Beneficiary;
}

export async function createBeneficiary(input: CreateBeneficiaryInput, token?: string): Promise<Beneficiary> {
  const { data, error } = await getClient(token)
    .from('beneficiaries')
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Beneficiary;
}

export async function updateBeneficiary(id: string, input: UpdateBeneficiaryInput, token?: string): Promise<Beneficiary | null> {
  const { data, error } = await getClient(token)
    .from('beneficiaries')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Beneficiary;
}

export async function deleteBeneficiary(id: string, token?: string): Promise<boolean> {
  const { error } = await getClient(token).from('beneficiaries').delete().eq('id', id);
  return !error;
}
