import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('tp.access-token')?.value

  // If the request is not authenticated and the pathname does not include 'auth', redirect to /auth/login
  if (!accessToken && !request.nextUrl.pathname.includes('/login')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // Otherwise, allow the request
  return NextResponse.next();
}

// Exclude all /auth routes and other static/api files from middleware
export const config = {
  matcher: [
    '/((?!auth|api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|icons).*)'
  ]
}
