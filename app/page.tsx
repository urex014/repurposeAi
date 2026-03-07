// app/page.tsx
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="container mx-auto flex items-center justify-between py-6 px-6">
        <div className="text-xl font-bold tracking-tight">
          Repurpose<span className="text-indigo-500">AI</span>
        </div>
        <div className="space-x-4">
          <Link href="/auth/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32 text-center">
        <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl mb-6">
          Turn one blog post into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">week of content.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-400 mb-10">
          Upload your long-form text and let our AI instantly generate viral video scripts, engaging social media threads, and crisp newsletter summaries.
        </p>
        <div className="flex justify-center gap-4 mb-16">
          <Link
            href="/login"
            className="rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all hover:scale-105"
          >
            Start Repurposing for Free
          </Link>
        </div>

        {/* Hero Video Placeholder */}
        <div className="mx-auto max-w-5xl rounded-2xl border border-slate-800 bg-slate-900 p-2 shadow-2xl">
          <div className="aspect-video w-full rounded-xl bg-slate-950 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden group">
            {/* Visual indicator that this is a video */}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent opacity-50"></div>
            <div className="h-20 w-20 rounded-full bg-indigo-600/20 flex items-center justify-center backdrop-blur-sm border border-indigo-500/30 group-hover:scale-110 transition-transform cursor-pointer">
              <div className="h-0 w-0 border-y-[12px] border-y-transparent border-l-[20px] border-l-white ml-2"></div>
            </div>
            <p className="mt-6 text-sm font-mono text-slate-500 uppercase tracking-widest">
              [ Insert 60s Demo Video Here ]
            </p>
          </div>
        </div>
      </section>

      {/* How It Works / Feature Showcase */}
      <section className="border-t border-slate-900 bg-slate-950/50 py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-bold sm:text-4xl mb-4">How it works</h2>
            <p className="text-slate-400 max-w-xl mx-auto">Skip the blank page. Our AI analyzes your core ideas and restructures them for specific platforms.</p>
          </div>

          <div className="grid gap-12 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex flex-col group">
              <div className="aspect-[4/3] w-full rounded-xl bg-slate-900 border border-slate-800 mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 to-transparent"></div>
                <p className="text-xs font-mono text-slate-600 relative z-10">[ Image: Dashboard Upload UI ]</p>
              </div>
              <h3 className="text-xl font-bold mb-2">1. Paste Your Blog</h3>
              <p className="text-slate-400">Drop in your raw text or published URL. We support long-form articles, essays, and guides.</p>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col group">
              <div className="aspect-[4/3] w-full rounded-xl bg-slate-900 border border-slate-800 mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 to-transparent"></div>
                <p className="text-xs font-mono text-slate-600 relative z-10">[ Image: AI Processing Animation ]</p>
              </div>
              <h3 className="text-xl font-bold mb-2">2. Select Your Formats</h3>
              <p className="text-slate-400">Choose between punchy TikTok/Reel scripts, LinkedIn carousels, Twitter threads, or email newsletters.</p>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col group">
              <div className="aspect-[4/3] w-full rounded-xl bg-slate-900 border border-slate-800 mb-6 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-transparent"></div>
                <p className="text-xs font-mono text-slate-600 relative z-10">[ Image: Generated Output Cards ]</p>
              </div>
              <h3 className="text-xl font-bold mb-2">3. Copy & Publish</h3>
              <p className="text-slate-400">Review the AI-generated variations, tweak the tone if needed, and export directly to your social channels.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="border-t border-slate-900 py-12 text-center text-slate-500">
        <p>© {new Date().getFullYear()} RepurposeAI. All rights reserved.</p>
      </footer>
    </div>
  );
}