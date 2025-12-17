'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardTitle, Button } from '@/components/ui';
import Link from 'next/link';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    // Here you would typically verify the session with your backend
    // For now, we'll just show success after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
      setVerified(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          {loading ? (
            <>
              <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto mb-4" />
              <CardTitle className="mb-2">Processing your payment...</CardTitle>
              <p className="text-slate-400">Please wait while we verify your subscription.</p>
            </>
          ) : verified ? (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="mb-2">Payment Successful!</CardTitle>
              <p className="text-slate-400 mb-6">
                Thank you for your subscription. Your account has been upgraded.
              </p>
              {sessionId && (
                <p className="text-xs text-slate-500 mb-6">
                  Session ID: {sessionId}
                </p>
              )}
              <Link href="/">
                <Button className="w-full">Return to SupaFlow</Button>
              </Link>
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mx-auto mb-4" />
            <CardTitle className="mb-2">Loading...</CardTitle>
          </CardContent>
        </Card>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}

