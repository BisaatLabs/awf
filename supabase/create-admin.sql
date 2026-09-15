-- ============================================================
-- Create your first admin user
-- Run AFTER you invite the user via Supabase Dashboard →
-- Authentication → Users → Add user (or Invite user)
-- ============================================================

insert into public.user_roles (user_id, role)
values (
  (select id from auth.users where email = 'YOUR_EMAIL@example.com'),
  'admin'
) on conflict (user_id) do update set role = excluded.role;

-- Verify it worked:
select u.email, r.role
from auth.users u
join public.user_roles r on r.user_id = u.id;
