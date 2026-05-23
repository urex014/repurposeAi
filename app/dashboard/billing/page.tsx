"use client";

import { useState } from 'react';
import { CheckCircle2, Zap } from 'lucide-react';

const PRICING = [
  { id: '5000', credits: '5,000', price: '₦5,000', popular: false },
  { id: '25000', credits: '25,000', price: '₦25,000', popular: true },
  { id: '50000', credits: '50,000', price: '₦50,000', popular: false },
  { id: '80000', credits: '80,000', price: '₦80,000', popular: false },
  { id: '100000', credits: '100,000', price: '₦100,000', popular: false },
];

export default function BillingPage() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    setLoadingId(packageId);
    setError(null);

    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Payment initialization failed');

      // Redirect user to Paystack checkout
      window.location.href = data.authorization_url;
      
    } catch (err: any) {
      setError(err.message);
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-white">Billing & Credits</h1>
        <p className="text-slate-400">Top up your balance to continue generating content.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pt-4">
        {PRICING.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative bg-slate-900 border rounded-2xl p-6 flex flex-col ${
              plan.popular ? 'border-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.2)]' : 'border-slate-800'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3 h-3" /> Most Popular
              </div>
            )}
            
            <h3 className="text-lg font-medium text-slate-300 mb-2">{plan.credits} Credits</h3>
            <div className="text-3xl font-bold text-white mb-6">{plan.price}</div>
            
            <ul className="space-y-3 mb-8 flex-1">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Access to all AI models
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Priority processing
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Credits never expire
              </li>
            </ul>
            
            <button
              onClick={() => handlePurchase(plan.id)}
              disabled={loadingId !== null}
              className={`w-full py-3 rounded-lg text-sm font-semibold transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                plan.popular 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {loadingId === plan.id ? (
                <span className="animate-pulse">Connecting...</span>
              ) : (
                'Purchase Credits'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}