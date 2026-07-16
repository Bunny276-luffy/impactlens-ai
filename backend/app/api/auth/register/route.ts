import { NextRequest } from 'next/server';
import { registerUser, RegisterInput } from '@/services/authService';
import * as fs from 'fs';
import { ok, error, serverError } from '@/lib/response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return error('email, password, name, and role are required');
    }

    if (password.length < 6) {
      return error('Password must be at least 6 characters');
    }

    const validRoles = ['Super Admin', 'NGO Admin', 'Volunteer', 'Donor'];
    if (!validRoles.includes(role)) {
      return error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
    }

    const session = await registerUser({ email, password, name, role } as RegisterInput);
    return ok(session, 201);
  } catch (err: any) {
    console.error('[auth/register]', err);
    try { fs.appendFileSync('f:/projects/New folder/error.log', new Date().toISOString() + ' REGISTER ERROR: ' + err.message + '\n'); } catch(e){}
    return serverError(err.message);
  }
}
