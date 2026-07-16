import { NextResponse } from 'next/server';

export function ok<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T): NextResponse {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function error(message: string, status = 400): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status });
}

export function notFound(resource = 'Resource'): NextResponse {
  return NextResponse.json({ success: false, error: `${resource} not found` }, { status: 404 });
}

export function unauthorized(message = 'Unauthorized'): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbidden(message = 'Forbidden'): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export function serverError(message = 'Internal server error'): NextResponse {
  return NextResponse.json({ success: false, error: message }, { status: 500 });
}
