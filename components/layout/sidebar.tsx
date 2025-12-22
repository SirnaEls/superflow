'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/auth';
import { useAuth } from '@/hooks/useAuth';
import { 
  Zap, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  CreditCard,
  LogOut,
  LogIn,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getFlows, SavedFlow } from '@/lib/storage';
import { usePlan } from '@/hooks/use-plan';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    label: 'Create User Flow',
    href: '/',
    icon: <Zap className="w-5 h-5 text-[#F0EEE9]" />,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [recentFlows, setRecentFlows] = useState<SavedFlow[]>([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Load collapsed state from localStorage only on client side
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  useEffect(() => {
    const flows = getFlows();
    setRecentFlows(flows.slice(0, 10)); // Show last 10 flows
  }, [pathname]); // Reload when pathname changes

  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(isCollapsed));
      // Dispatch custom event to notify layout
      window.dispatchEvent(new CustomEvent('sidebar-toggle', { detail: { isCollapsed } }));
    }
  }, [isCollapsed, isMounted]);

  // Safety check for pathname
  const currentPath = pathname || '/';

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-screen bg-[#0F0F14] border-r border-slate-800/50 flex flex-col z-40 transition-all duration-300',
      isMounted && isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Logo */}
      <Link 
        href="/" 
        onClick={() => {
          // Dispatch event to reset features when clicking logo
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('reset-features'));
          }
        }}
        className="p-6 border-b border-slate-800/50 flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
      >
        <Image 
          src={isCollapsed ? "/logo-only.svg" : "/logo.svg"} 
          alt="Logo" 
          width={120} 
          height={120} 
          className="object-contain h-9 w-auto"
        />
      </Link>

      {/* Toggle Button */}
      <button
        onClick={toggleCollapse}
        className="absolute top-4 right-0 translate-x-1/2 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[#F0EEE9] hover:bg-slate-700 transition-colors z-50"
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="w-3 h-3 text-[#F0EEE9]" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-[#F0EEE9]" />
        )}
      </button>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group relative',
                  isActive
                    ? 'bg-slate-800/50 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/30',
                  isMounted && isCollapsed && 'justify-center'
                )}
                title={isMounted && isCollapsed ? item.label : undefined}
              >
                <span className={cn(
                  'text-[#F0EEE9]',
                  'flex-shrink-0'
                )}>
                  {item.icon}
                </span>
                {isMounted && !isCollapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Recent Flows Section */}
        {recentFlows.length > 0 && isMounted && !isCollapsed && (
          <div className="mt-8">
            <div className="px-3 mb-2">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Recent
              </h3>
            </div>
            <div className="space-y-0.5">
              {recentFlows.map((flow) => {
                const isActive = currentPath === `/flows/${flow.id}`;
                return (
                  <Link
                    key={flow.id}
                    href={`/flows/${flow.id}`}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors group',
                      isActive
                        ? 'bg-slate-800/50 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/30'
                    )}
                  >
                    <span className="text-sm truncate flex-1">{flow.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Account Section */}
      <div className="border-t border-slate-800/50 p-4">
        <AccountSection isCollapsed={isMounted ? isCollapsed : false} />
      </div>
    </aside>
  );
};

const AccountSection: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const displayUser = user || {
    name: 'Guest',
    email: '',
    avatar: undefined,
  };

  // Get plan from usePlan hook
  const { plan: userPlan } = usePlan();
  const plan = userPlan === 'free' ? 'Free' : userPlan === 'starter' ? 'Starter' : 'Pro';

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Safety check for pathname
  const currentPath = pathname || '/';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group w-full',
          currentPath === '/account'
            ? 'bg-slate-800/50 text-white'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/30',
          isCollapsed && 'justify-center'
        )}
        title={isCollapsed ? (displayUser.name || 'Guest') : undefined}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
          {(displayUser as any).avatar ? (
            <img src={(displayUser as any).avatar} alt={displayUser.name || 'User'} className="w-full h-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-[#F0EEE9]" />
          )}
        </div>
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium text-white truncate">
                {displayUser.name || 'Guest'}
              </div>
              <div className="text-xs text-slate-500 truncate">
                {plan}
              </div>
            </div>
            <ChevronDown className={cn(
              'w-4 h-4 text-[#F0EEE9] transition-transform flex-shrink-0',
              isOpen && 'rotate-180'
            )} />
          </>
        )}
      </button>
      
      {isOpen && !isCollapsed && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden z-50">
          {user ? (
            <>
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4 text-[#F0EEE9]" />
                <span>Account Settings</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 text-[#F0EEE9]" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogIn className="w-4 h-4 text-[#F0EEE9]" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      )}
      {isOpen && isCollapsed && (
        <div className="absolute bottom-full left-full ml-2 bg-slate-900 border border-slate-800 rounded-lg shadow-xl overflow-hidden z-50 min-w-[200px]">
          {user ? (
            <>
              <Link
                href="/account"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4 text-[#F0EEE9]" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 text-[#F0EEE9]" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogIn className="w-4 h-4 text-[#F0EEE9]" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

