'use client';

import React from 'react';
import { Sidebar } from './sidebar';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}


