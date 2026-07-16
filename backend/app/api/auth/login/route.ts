import { NextRequest } from 'next/server';
import { loginUser, LoginInput } from '@/services/authService';
import * as fs from 'fs';
import { ok, error, serverError } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return error('email and password are required');
    }

    const session = await loginUser({ email, password });
    return ok(session);
  } catch (err: any) {
    console.error('[auth/login]', err);
    try { fs.appendFileSync('f:/projects/New folder/error.log', new Date().toISOString() + ' LOGIN ERROR: ' + err.message + '\n'); } catch(e){}
    if (err.message?.includes('Invalid')) {
      return error('Invalid email or password', 401);
    }
    return serverError(err.message);
  }
}
