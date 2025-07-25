import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Helper function to detect mobile devices
function isMobileDevice(userAgent: string): boolean {
  const mobileKeywords = [
    'Mobile', 'Android', 'iPhone', 'iPad', 'iPod', 
    'BlackBerry', 'Windows Phone', 'webOS'
  ];
  return mobileKeywords.some(keyword => userAgent.includes(keyword));
}

// Helper function to detect mobile screen size from viewport hints
function isMobileViewport(request: NextRequest): boolean {
  // Check for mobile-specific headers
  const xRequestedWith = request.headers.get('x-requested-with');
  const acceptHeader = request.headers.get('accept');
  
  // Some mobile browsers send specific headers
  if (xRequestedWith === 'XMLHttpRequest') return false; // Usually desktop AJAX
  
  // Check for mobile-specific accept headers
  if (acceptHeader?.includes('application/vnd.wap.xhtml+xml')) return true;
  
  return false;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  
  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  
  // Get user agent for device detection
  const userAgent = request.headers.get('user-agent') || '';
  const isMobile = isMobileDevice(userAgent) || isMobileViewport(request);
  
  // If user is not authenticated and not on auth page, redirect to auth
  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }
  
  // If user is authenticated, redirect based on device type
  if (user) {
    const currentPath = request.nextUrl.pathname;
    
    // Avoid redirect loops and allow auth callback
    if (currentPath.startsWith('/auth/callback')) {
      return supabaseResponse;
    }
    
    // Redirect mobile users to /app if they're on desktop route
    if (isMobile && currentPath.startsWith('/dashboard')) {
      const url = request.nextUrl.clone()
      url.pathname = '/app'
      return NextResponse.redirect(url)
    }
    
    // Redirect desktop users to /dashboard if they're on mobile route  
    if (!isMobile && currentPath.startsWith('/app')) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
    
    // Redirect from auth to appropriate dashboard based on device
    if (currentPath.startsWith('/auth') && currentPath !== '/auth/callback') {
      const url = request.nextUrl.clone()
      url.pathname = isMobile ? '/app' : '/dashboard'
      return NextResponse.redirect(url)
    }
    
    // Redirect from root to appropriate dashboard
    if (currentPath === '/') {
      const url = request.nextUrl.clone()
      url.pathname = isMobile ? '/app' : '/dashboard'
      return NextResponse.redirect(url)
    }
  }
  
  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!
  return supabaseResponse
}