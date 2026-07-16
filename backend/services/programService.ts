import { Program, PaginatedResponse } from '../lib/types';
import { createScopedClient, supabase as adminClient } from '../lib/supabase';

export interface ProgramFilters {
  ngo_id?: string;
  status?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateProgramInput {
  ngo_id: string;
  name: string;
  description?: string;
  category: Program['category'];
  start_date?: string;
  end_date?: string;
  budget?: number;
}

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function listPrograms(filters: ProgramFilters, token?: string): Promise<PaginatedResponse<Program>> {
  const client = getClient(token);
  let query = client.from('programs').select('*', { count: 'exact' });

  if (filters.ngo_id) query = query.eq('ngo_id', filters.ngo_id);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.category) query = query.eq('category', filters.category);
  if (filters.search) query = query.ilike('name', `%${filters.search}%`);

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  query = query.range(start, start + limit - 1).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: data as Program[],
    total: count || 0,
    page,
    limit,
    has_more: (count || 0) > start + limit,
  };
}

export async function getProgram(id: string, token?: string): Promise<Program | null> {
  const { data, error } = await getClient(token).from('programs').select('*').eq('id', id).single();
  if (error) return null;
  return data as Program;
}

export async function createProgram(input: CreateProgramInput, token?: string): Promise<Program> {
  const { data, error } = await getClient(token).from('programs').insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Program;
}

export async function updateProgram(id: string, input: Partial<CreateProgramInput>, token?: string): Promise<Program | null> {
  const { data, error } = await getClient(token).from('programs').update(input).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data as Program;
}

export async function deleteProgram(id: string, token?: string): Promise<boolean> {
  const { error } = await getClient(token).from('programs').delete().eq('id', id);
  return !error;
}
