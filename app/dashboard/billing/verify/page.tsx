"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

function VerifyPaymentContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const router = useRouter();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your payment...');

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setMessage('No payment reference found.');
      return;
    }

    const verifyTransaction = async () => {
      try {
        const res = await fetch(`/api/paystack/verify?reference=${reference}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || 'Verification failed');

        setStatus('success');
        setMessage(`Success! Added ${data.transaction?.creditsAdded?.toLocaleString()} credits to your account.`);
        
        // Refresh the layout to update the navbar credit balance, then redirect
        setTimeout(() => {
          router.refresh();
          router.push('/dashboard');
        }, 3000);

      } catch (err: any) {
        setStatus('error');
        setMessage(err.message);
      }
    };

    verifyTransaction();
  }, [reference, router]);

  return (
    <div className="max-w-md mx-auto mt-20 bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
      {status === 'loading' && (
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Processing Payment</h2>
          <p className="text-slate-400 text-sm">{message}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center animate-in zoom-in duration-300">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
          <p className="text-slate-400 text-sm mb-6">{message}</p>
          <p className="text-xs text-slate-500">Redirecting to dashboard...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center">
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
          <p className="text-slate-400 text-sm mb-8">{message}</p>
          <Link 
            href="/dashboard/billing"
            className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Return to Billing
          </Link>
        </div>
      )}
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <Suspense fallback={<div className="text-center mt-20 text-slate-400">Loading...</div>}>
      <VerifyPaymentContent />
    </Suspense>
  );
}