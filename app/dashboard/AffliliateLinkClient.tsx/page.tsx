"use client";

import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

export default function AffiliateLinkClient({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-slate-300 text-sm font-mono overflow-hidden text-ellipsis whitespace-nowrap">
        {link}
      </div>
      <button
        onClick={handleCopy}
        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        {copied ? (
          <>
            <CheckCircle2 className="w-4 h-4" /> Copied!
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" /> Copy Link
          </>
        )}
      </button>
    </div>
  );
}