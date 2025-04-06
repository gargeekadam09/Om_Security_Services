import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    const isPublicPath = path === '/login' || path === '/src/app/signup'
     || path === '/src/app/verifyemail'

    const token = request.cookies.get("token") ?.value || ''

    if(isPublicPath && token){
        return NextResponse.redirect(new URL('/', request.
            url))
    }

    
    if(!isPublicPath && !token){
        return NextResponse.redirect(new URL('/src/app/login', request.
            url))
    }
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/',
    '/src/app/login',
    '/src/app/signup',
    '/src/app/profile',
    '/src/app/verifyemail'
  ],
}