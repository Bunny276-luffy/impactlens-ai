import { AIRecommendation } from '../lib/types';
import { createScopedClient, supabase as adminClient } from '../lib/supabase';

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function getRecommendations(ngoId?: string, token?: string): Promise<AIRecommendation[]> {
  const client = getClient(token);
  const { data, error } = await client.from('ai_reports').select('*').limit(20);
  if (error || !data) return [];
  
  return data.map((d: any) => ({
    id: d.id,
    beneficiary_id: d.beneficiary_id,
    beneficiary_name: 'Beneficiary', // Requires join
    priority: d.priority_ranking > 80 ? 'P1' : 'P3',
    category: 'Health',
    recommendation: d.suggested_intervention,
    confidence_score: d.risk_score,
    generated_at: d.created_at
  }));
}

export async function getRecommendationForBeneficiary(beneficiaryId: string, token?: string): Promise<AIRecommendation | null> {
  const { data, error } = await getClient(token).from('ai_reports').select('*').eq('beneficiary_id', beneficiaryId).single();
  if (error || !data) return null;
  return {
    id: data.id,
    beneficiary_id: data.beneficiary_id,
    beneficiary_name: 'Beneficiary',
    priority: data.priority_ranking > 80 ? 'P1' : 'P3',
    category: 'Health',
    recommendation: data.suggested_intervention,
    confidence_score: data.risk_score,
    generated_at: data.created_at
  };
}

export async function generateRiskScore(beneficiaryId: string, token?: string): Promise<number> {
  void token; void beneficiaryId;
  return Math.floor(Math.random() * 100);
}
