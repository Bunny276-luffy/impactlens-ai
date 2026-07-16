import { Evidence, PaginatedResponse } from '../lib/types';
import { createScopedClient, supabase as adminClient } from '../lib/supabase';

export interface EvidenceFilters {
  activity_id?: string;
  verification_status?: string;
  page?: number;
  limit?: number;
}

export interface CreateEvidenceInput {
  activity_id: string;
  file_url: string;
  uploaded_by: string;
  notes?: string;
}

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function listEvidence(filters: EvidenceFilters, token?: string): Promise<PaginatedResponse<Evidence>> {
  const client = getClient(token);
  let query = client.from('evidence').select('*', { count: 'exact' });

  if (filters.activity_id) query = query.eq('activity_id', filters.activity_id);
  if (filters.verification_status) query = query.eq('verification_status', filters.verification_status);

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  query = query.range(start, start + limit - 1).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: data as Evidence[],
    total: count || 0,
    page,
    limit,
    has_more: (count || 0) > start + limit,
  };
}

export async function createEvidence(input: CreateEvidenceInput, token?: string): Promise<Evidence> {
  const { data, error } = await getClient(token).from('evidence').insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Evidence;
}

export async function deleteEvidence(id: string, token?: string): Promise<boolean> {
  const { error } = await getClient(token).from('evidence').delete().eq('id', id);
  return !error;
}
