import { FieldActivity, PaginatedResponse } from '../lib/types';
import { createScopedClient, supabase as adminClient } from '../lib/supabase';

export interface ActivityFilters {
  ngo_id?: string;
  volunteer_id?: string;
  beneficiary_id?: string;
  program_id?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface CreateActivityInput {
  ngo_id: string;
  volunteer_id: string;
  beneficiary_id?: string;
  program_id?: string;
  title: string;
  description?: string;
  activity_date: string;
  location?: string;
}

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function listActivities(filters: ActivityFilters, token?: string): Promise<PaginatedResponse<FieldActivity>> {
  const client = getClient(token);
  let query = client.from('field_activities').select('*', { count: 'exact' });

  if (filters.volunteer_id) query = query.eq('volunteer_id', filters.volunteer_id);
  if (filters.beneficiary_id) query = query.eq('beneficiary_id', filters.beneficiary_id);
  if (filters.program_id) query = query.eq('program_id', filters.program_id);
  if (filters.status) query = query.eq('status', filters.status);

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  query = query.range(start, start + limit - 1).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: data as any as FieldActivity[],
    total: count || 0,
    page,
    limit,
    has_more: (count || 0) > start + limit,
  };
}

export async function getActivity(id: string, token?: string): Promise<FieldActivity | null> {
  const { data, error } = await getClient(token).from('field_activities').select('*').eq('id', id).single();
  if (error) return null;
  return data as any as FieldActivity;
}

export async function createActivity(input: CreateActivityInput, token?: string): Promise<FieldActivity> {
  const { data, error } = await getClient(token).from('field_activities').insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as any as FieldActivity;
}

export async function updateActivity(id: string, input: Partial<CreateActivityInput & { status: FieldActivity['status']; impact_score: number }>, token?: string): Promise<FieldActivity | null> {
  const { data, error } = await getClient(token).from('field_activities').update(input).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data as any as FieldActivity;
}

export async function deleteActivity(id: string, token?: string): Promise<boolean> {
  const { error } = await getClient(token).from('field_activities').delete().eq('id', id);
  return !error;
}
