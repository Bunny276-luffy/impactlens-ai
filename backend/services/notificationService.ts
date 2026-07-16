import { Notification, PaginatedResponse } from '../lib/types';
import { createScopedClient, supabase as adminClient } from '../lib/supabase';

export interface NotificationFilters {
  user_id: string;
  is_read?: boolean;
  page?: number;
  limit?: number;
}

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function listNotifications(filters: NotificationFilters, token?: string): Promise<PaginatedResponse<Notification>> {
  const client = getClient(token);
  let query = client.from('notifications').select('*', { count: 'exact' });

  if (filters.user_id) query = query.eq('user_id', filters.user_id);
  if (filters.is_read !== undefined) query = query.eq('status', filters.is_read ? 'READ' : 'UNREAD');

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const start = (page - 1) * limit;
  query = query.range(start, start + limit - 1).order('created_at', { ascending: false });

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: data as any as Notification[],
    total: count || 0,
    page,
    limit,
    has_more: (count || 0) > start + limit,
  };
}

export async function markNotificationRead(id: string, token?: string): Promise<Notification | null> {
  const { data, error } = await getClient(token)
    .from('notifications')
    .update({ status: 'READ' })
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as any as Notification;
}

export async function markAllRead(userId: string, token?: string): Promise<void> {
  const { error } = await getClient(token)
    .from('notifications')
    .update({ status: 'READ' })
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
}
