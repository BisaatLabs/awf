import { requireAdmin } from '@/lib/supabase/ssr-client';
import { PasswordForm } from '@/components/admin/PasswordForm';
export const metadata = { title: 'Account Settings — Al Wahid Furnitures' };
export default async function SettingsPage() {
  await requireAdmin();
  return <div className="max-w-xl"><h1 className="text-2xl font-semibold text-gray-900">Account settings</h1><p className="mt-2 mb-8 text-sm text-gray-500">Change the password for your signed-in administrator account.</p><PasswordForm /></div>;
}
