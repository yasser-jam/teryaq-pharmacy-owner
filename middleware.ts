import { useLocalStorageState } from 'ahooks';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log(request);
  console.log(request.cookies);
  
  const accessToken = request.cookies.get('tp.access-token')?.value;
  // const accessToken = useLocalStorageState('tp.access-token');

  // Debug logging in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware Debug:');
    console.log('- Path:', request.nextUrl.pathname);
    console.log('- Has Token:', !!accessToken);
    console.log('- Token Value:', accessToken ? 'Present' : 'Missing');
    console.log('- All Cookies:', request.cookies.getAll().map(c => `${c.name}=${c.value}`));
  }

  // If the request is not authenticated and the pathname does not include 'auth', redirect to /auth/login
  if (!accessToken && !request.nextUrl.pathname.includes('/login')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // if (
  //   (!isCompleteAccount || isCompleteAccount === 'false') &&
  //   !request.nextUrl.pathname.includes('/complete-registration') &&
  //   !request.nextUrl.pathname.includes('/login')
  // ) {
  //   return NextResponse.redirect(
  //     new URL('/auth/complete-registration', request.url)
  //   );
  // }

  // Otherwise, allow the request
  return NextResponse.next();
}

// Exclude all /auth routes and other static/api files from middleware
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|icons).*)',
  ],
};
