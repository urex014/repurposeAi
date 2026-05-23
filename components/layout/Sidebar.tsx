"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CreditCard, 
  FileText, 
  MessageSquare,
  Settings,
  ShieldAlert
} from 'lucide-react';

interface UserProps {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: string;
}

const NAVIGATION = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  // { name: 'Content AI', href: '/dashboard/ai-tools', icon: FileText },
  { name: 'Affiliate Program', href: '/dashboard/affiliate', icon: MessageSquare },
  { name: 'Billing & Credits', href: '/dashboard/billing', icon: CreditCard },
];

export default function Sidebar({ user }: { user: UserProps }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-64 border-r border-slate-800 bg-slate-950 h-full">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-white">
          Repurpose<span className="text-blue-500">AI</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAVIGATION.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}

        {user.role === 'admin' && (
          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Admin
            </p>
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-amber-500 hover:bg-slate-900 transition-colors"
            >
              <ShieldAlert className="w-5 h-5" />
              Admin Panel
            </Link>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800">
        <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </Link>
      </div>
    </div>
  );
}