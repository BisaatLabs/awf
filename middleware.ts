import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookies) {
        cookies.forEach(({name,value}) => request.cookies.set(name,value));
        response = NextResponse.next({request});
        cookies.forEach(({name,value,options}) => response.cookies.set(name,value,options));
      },
    },
  });
  const { data: { user } } = await supabase.auth.getUser();
  const { data: role, error } = user
    ? await supabase.from('user_roles').select('role').eq('user_id',user.id).single()
    : { data: null, error: null };
  const isAdmin = !error && role?.role === 'admin';
  const login = request.nextUrl.pathname === '/admin/login';
  let destination: string | null = null;
  if (!isAdmin && !login) destination = '/admin/login?error=unauthorized';
  if (isAdmin && login) destination = '/admin';
  if (destination) {
    const redirect = NextResponse.redirect(new URL(destination,request.url));
    response.cookies.getAll().forEach(cookie => redirect.cookies.set(cookie));
    return redirect;
  }
  return response;
}
export const config = { matcher: ['/admin/:path*'] };
