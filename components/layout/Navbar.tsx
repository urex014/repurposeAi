"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, Coins, LogOut, User as UserIcon } from 'lucide-react';
import Sidebar from './Sidebar';

interface UserProps {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: string;
}

export default function Navbar({ user }: { user: UserProps }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    // Next.js standard way to log out is hitting a quick API route to clear the HttpOnly cookie
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="text-slate-400 hover:text-white focus:outline-none"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Spacer for mobile to push right-side content to edge */}
        <div className="flex-1 md:hidden"></div>

        <div className="flex items-center gap-4 ml-auto">
          {/* Credit Balance Badge */}
          <Link 
            href="/dashboard/billing"
            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-blue-500/50 px-3 py-1.5 rounded-full transition-colors group"
          >
            <Coins className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-semibold text-slate-200">
              {user.credits.toLocaleString()} <span className="hidden sm:inline text-slate-500 font-normal">credits</span>
            </span>
          </Link>

          {/* User Dropdown / Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
            <div className="hidden md:block text-right">
              <p className="text-sm font-medium text-slate-200">{user.name}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 transition-colors ml-2"
              title="Log out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-950 w-64 h-full shadow-2xl">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <Sidebar user={user} />
          </div>
        </div>
      )}
    </>
  );
}