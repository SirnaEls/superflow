'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';

const PUBLIC_ROUTES = ['/login', '/register', '/auth/callback', '/auth/supabase-callback'];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentPath = pathname || '/';
  const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);
  const [sidebarWidth, setSidebarWidth] = useState(256); // 64 * 4 = 256px (w-64)
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar-collapsed');
      const isCollapsed = saved === 'true';
      setSidebarWidth(isCollapsed ? 64 : 256); // 16 * 4 = 64px (w-16)
    }
  }, []);

  // Listen for storage changes to update width when sidebar is toggled
  useEffect(() => {
    const handleSidebarToggle = (event: Event) => {
      const customEvent = event as CustomEvent<{ isCollapsed: boolean }>;
      setSidebarWidth(customEvent.detail.isCollapsed ? 64 : 256);
    };

    const handleStorageChange = () => {
      const saved = localStorage.getItem('sidebar-collapsed');
      const isCollapsed = saved === 'true';
      setSidebarWidth(isCollapsed ? 64 : 256);
    };

    // Listen for custom event from sidebar
    window.addEventListener('sidebar-toggle', handleSidebarToggle);
    // Also listen for storage changes (in case of multiple tabs)
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('sidebar-toggle', handleSidebarToggle);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: isMounted ? `${sidebarWidth}px` : '256px' }}
      >
        {children}
      </main>
    </div>
  );
}
