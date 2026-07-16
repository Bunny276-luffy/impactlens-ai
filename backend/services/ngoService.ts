import { NGO } from '../lib/types';
import { createScopedClient, supabase as adminClient } from '../lib/supabase';

export interface UpdateNGOInput extends Partial<Omit<NGO, 'id' | 'created_at' | 'updated_at'>> {}

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function getNGOProfile(id: string, token?: string): Promise<NGO | null> {
  const { data, error } = await getClient(token).from('ngos').select('*').eq('id', id).single();
  if (error) return null;
  return data as NGO;
}

export async function updateNGOProfile(id: string, input: UpdateNGOInput, token?: string): Promise<NGO | null> {
  const { data, error } = await getClient(token).from('ngos').update(input).eq('id', id).select().single();
  if (error) throw new Error(error.message);
  return data as NGO;
}
