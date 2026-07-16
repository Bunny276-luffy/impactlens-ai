import { createScopedClient, supabase as adminClient } from '../lib/supabase';

function getClient(token?: string) {
  return token ? createScopedClient(token) : adminClient;
}

export async function uploadFile(bucket: string, path: string, fileBody: Buffer | Blob, token?: string): Promise<string> {
  const client = getClient(token);
  const { data, error } = await client.storage.from(bucket).upload(path, fileBody, {
    upsert: true
  });
  
  if (error) throw new Error(error.message);
  
  const { data: publicUrlData } = client.storage.from(bucket).getPublicUrl(data.path);
  return publicUrlData.publicUrl;
}

export async function deleteFile(bucket: string, path: string, token?: string): Promise<boolean> {
  const { error } = await getClient(token).storage.from(bucket).remove([path]);
  return !error;
}
