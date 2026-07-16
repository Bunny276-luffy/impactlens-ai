import { Volunteer, VolunteerTask, PaginatedResponse } from '../lib/types';
import { createScopedClient, supabase as adminClient } from '../lib/supabase';

export interface VolunteerFilters {
  ngo_id?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateVolunteerInput {
  user_id: string;
  ngo_id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
}

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function listVolunteers(filters: VolunteerFilters, token?: string): Promise<PaginatedResponse<Volunteer>> {
  const client = getClient(token);
  let query = client.from('volunteers').select('*', { count: 'exact' });

  if (filters.status) query = query.eq('status', filters.status);
  if (filters.search) query = query.ilike('name', `%${filters.search}%`);

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  query = query.range(start, start + limit - 1).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: data as Volunteer[],
    total: count || 0,
    page,
    limit,
    has_more: (count || 0) > start + limit,
  };
}

export async function getVolunteer(id: string, token?: string): Promise<Volunteer | null> {
  const { data, error } = await getClient(token).from('volunteers').select('*').eq('id', id).single();
  if (error) return null;
  return data as Volunteer;
}

export async function createVolunteer(input: CreateVolunteerInput, token?: string): Promise<Volunteer> {
  const { data, error } = await getClient(token).from('volunteers').insert(input).select().single();
  if (error) throw new Error(error.message);
  return data as Volunteer;
}

export async function updateVolunteer(id: string, input: Partial<CreateVolunteerInput & { status: Volunteer['status'] }>, token?: string): Promise<Volunteer | null> {
  const { data, error } = await getClient(token).from('volunteers').update(input).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data as Volunteer;
}

export async function deleteVolunteer(id: string, token?: string): Promise<boolean> {
  const { error } = await getClient(token).from('volunteers').delete().eq('id', id);
  return !error;
}

// Volunteer Tasks (assumes volunteer_tasks table, which might not be in supabase_schema yet, we'll gracefully handle it)
export async function getVolunteerTasks(volunteerId: string, token?: string): Promise<VolunteerTask[]> {
  const { data, error } = await getClient(token).from('volunteer_tasks').select('*').eq('volunteer_id', volunteerId);
  if (error) return [];
  return data as VolunteerTask[];
}

export async function updateVolunteerTask(taskId: string, status: VolunteerTask['status'], token?: string): Promise<VolunteerTask | null> {
  const { data, error } = await getClient(token).from('volunteer_tasks').update({ status }).eq('id', taskId).select().single();
  if (error) throw new Error(error.message);
  return data as VolunteerTask;
}
