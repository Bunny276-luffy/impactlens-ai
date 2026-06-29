export { default } from 'next-auth/middleware';

export const config = {
  matcher: ['/dashboard/:path*', '/api/child/:path*', '/api/donations/:path*', '/api/volunteer/:path*']
};
