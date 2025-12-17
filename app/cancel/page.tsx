'use client';

import React from 'react';
import { XCircle } from 'lucide-react';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';
import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <CardTitle className="mb-2">Payment Cancelled</CardTitle>
          <p className="text-slate-400 mb-6">
            Your payment was cancelled. No charges were made to your account.
          </p>
          <Link href="/">
            <Button className="w-full">Return to SupaFlow</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

