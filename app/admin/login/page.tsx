// app/admin/login/page.tsx
// Standalone login page — uses its own minimal layout, no admin shell.

import { Inter } from 'next/font/google';
import { LoginForm } from '@/components/admin/LoginForm';

const inter = Inter({ subsets: ['latin'] });

export const metadata = { title: 'Admin Login — Al Wahid Furnitures' };

export default function LoginPage() {
  return (
    <html lang="en" className={inter.className}>
      <body className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="w-full max-w-sm px-4">
          {/* Logo mark */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-[#1B4332]">
              <span className="text-sm font-bold text-white">AW</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Portal</h1>
            <p className="mt-1 text-sm text-gray-500">Al Wahid Furnitures</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            Only authorised admin accounts can access this area.
          </p>
        </div>
      </body>
    </html>
  );
}
