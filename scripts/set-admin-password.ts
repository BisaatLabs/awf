/** Set ADMIN_EMAIL and ADMIN_PASSWORD in your local environment, then npm run set-admin. */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
config({ path: '.env.local' });
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) locally.');
  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {auth:{persistSession:false,autoRefreshToken:false}});
  let userId: string | undefined;
  for (let page = 1; ; page++) {
    const {data,error} = await db.auth.admin.listUsers({page,perPage:100});
    if (error) throw error;
    userId = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase())?.id;
    if (userId || data.users.length < 100) break;
  }
  const result = userId
    ? await db.auth.admin.updateUserById(userId,{password,email_confirm:true})
    : await db.auth.admin.createUser({email,password,email_confirm:true});
  if (result.error) throw result.error;
  if (!result.data.user) throw new Error('No user returned.');
  const {error} = await db.from('user_roles').upsert({user_id:result.data.user.id,role:'admin'},{onConflict:'user_id'});
  if (error) throw error;
  console.log('Admin account and role configured successfully.');
}
main().catch(error => {console.error(error.message); process.exitCode=1;});
