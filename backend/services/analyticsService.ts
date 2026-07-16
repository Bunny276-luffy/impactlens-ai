import { AnalyticsSnapshot } from '../lib/types';
import { createScopedClient, supabase as adminClient } from '../lib/supabase';

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function getAnalyticsSnapshot(ngoId?: string, token?: string): Promise<AnalyticsSnapshot> {
  const client = getClient(token);
  
  // Use exact count queries to fetch metrics
  const getCount = async (table: string, ngoCol: string = 'ngo_id') => {
    let q = client.from(table).select('*', { count: 'exact', head: true });
    if (ngoId && ngoCol) q = q.eq(ngoCol, ngoId);
    const { count } = await q;
    return count || 0;
  };

  const [total_beneficiaries, total_programs, total_volunteers, total_donations] = await Promise.all([
    getCount('beneficiaries'),
    getCount('programs'),
    getCount('volunteers', ''), // volunteers don't have ngo_id strictly in schema but mapped via user
    getCount('donations')
  ]);

  return {
    stats: {
      total_beneficiaries,
      total_ngos: 1, // Example
      total_donations,
      total_raised: 0, // Would require SUM query
      active_volunteers: total_volunteers,
      active_programs: total_programs,
      health_risk_alerts: 0,
      avg_nutrition_score: 0,
      avg_attendance_rate: 0,
    },
    priority_distribution: { critical: 0, high: 0, moderate: 0, stable: 0 },
    monthly_donations: [],
    nutrition_attendance_scatter: [],
  };
}
