import Link from 'next/link';
import { 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  Video, 
  MessageSquare, 
  Mail, 
  ArrowRight,
  Zap,
  LayoutDashboard
} from 'lucide-react';

const PRICING = [
  { credits: '5,000', price: '₦5,000', popular: false, desc: 'Perfect for testing the waters.' },
  { credits: '25,000', price: '₦25,000', popular: true, desc: 'Best for weekly content creators.' },
  { credits: '50,000', price: '₦50,000', popular: false, desc: 'For agencies and daily posters.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Background Glow Effects */}
      <div className="absolute top-0 inset-x-0 h-[500px] pointer-events-none">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#0A0A0B]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">RepurposeAI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link 
              href="/register" 
              className="bg-white text-black hover:bg-slate-200 text-sm font-semibold px-5 py-2.5 rounded-full transition-all shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-6 text-center max-w-5xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>New: Turn any blog post into a YouTube Video Script</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1]">
          Multiply your content. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Dominate every platform.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          The all-in-one content engine for creators. Paste a single article and instantly generate viral Twitter threads, LinkedIn hooks, video scripts, and newsletters.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link 
            href="/register" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)]"
          >
            Start writing for free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Product UI Mockup */}
        <div className="relative mx-auto max-w-4xl rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden text-left">
          {/* Mac-style Window Header */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <div className="ml-4 text-xs font-medium text-slate-500 flex items-center gap-2">
              <LayoutDashboard className="w-3 h-3" /> repurpose-ai-dashboard
            </div>
          </div>
          {/* Fake Editor UI */}
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            <div className="p-6 bg-slate-950">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">1. Your Source Content</div>
              <div className="h-4 w-3/4 bg-slate-800 rounded mb-3 animate-pulse" />
              <div className="h-4 w-full bg-slate-800 rounded mb-3 animate-pulse" />
              <div className="h-4 w-5/6 bg-slate-800 rounded mb-3 animate-pulse" />
              <div className="h-4 w-full bg-slate-800 rounded mb-8 animate-pulse" />
              <div className="inline-flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">
                <Zap className="w-4 h-4" /> Generating formats...
              </div>
            </div>
            <div className="p-6 bg-[#0c0c0e]">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">2. AI Generated Outputs</div>
              <div className="space-y-4">
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-start gap-3">
                  <Video className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-white mb-1">YouTube Script</div>
                    <div className="text-xs text-slate-400">Hook: "Stop scrolling! What if I told you..."</div>
                  </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-white mb-1">Twitter Thread</div>
                    <div className="text-xs text-slate-400">1/8 The biggest lie in marketing is...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Box Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">One input. Infinite outputs.</h2>
          <p className="text-slate-400 max-w-xl text-lg">Stop rewriting the same content manually. Our AI engine natively understands the format, tone, and constraints of every platform.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Big Feature */}
          <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Video className="w-32 h-32 text-purple-500" />
            </div>
            <div className="bg-purple-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-purple-500/20">
              <Video className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Blog to Video Script</h3>
            <p className="text-slate-400 text-lg max-w-md">Turn a dry article into an engaging, pacing-optimized YouTube script complete with visual cues, B-roll suggestions, and retention hooks.</p>
          </div>

          {/* Regular Feature */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl group hover:border-slate-700 transition-colors">
            <div className="bg-sky-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-sky-500/20">
              <MessageSquare className="w-6 h-6 text-sky-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Viral Threads</h3>
            <p className="text-slate-400">Automatically slice long-form content into punchy 10-part Twitter/X threads.</p>
          </div>

          {/* Regular Feature */}
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl group hover:border-slate-700 transition-colors">
            <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-emerald-500/20">
              <Mail className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Newsletters</h3>
            <p className="text-slate-400">Reformat your core message into a personal, conversational email blast.</p>
          </div>

          {/* Big Feature */}
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <FileText className="w-32 h-32 text-blue-500" />
            </div>
            <div className="bg-blue-500/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Smart Summarization</h3>
            <p className="text-slate-400 text-lg max-w-md">Too long; didn't read? Extract key insights, actionable bullet points, and main arguments from heavy PDF documents or lengthy web pages instantly.</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-slate-800/50 bg-[#0A0A0B]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pay as you grow</h2>
            <p className="text-slate-400 max-w-xl mx-auto">No monthly subscriptions. Buy credits when you need them. Credits never expire.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {PRICING.map((plan, idx) => (
              <div 
                key={idx} 
                className={`relative bg-slate-900/50 backdrop-blur-sm border rounded-3xl p-8 flex flex-col ${
                  plan.popular ? 'border-blue-500 shadow-[0_0_40px_-10px_rgba(59,130,246,0.2)] transform md:-translate-y-2' : 'border-slate-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-medium text-slate-300 mb-2">{plan.credits} Credits</h3>
                <p className="text-sm text-slate-500 mb-6 min-h-[40px]">{plan.desc}</p>
                <div className="text-4xl font-bold text-white mb-8">{plan.price}</div>
                
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Full access to all AI tools
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Fast processing speeds
                  </li>
                  <li className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> Credits rollover forever
                  </li>
                </ul>
                
                <Link 
                  href="/register" 
                  className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all text-center ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)]' 
                      : 'bg-white text-black hover:bg-slate-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10 bg-slate-900 border border-slate-800 p-12 md:p-20 rounded-3xl">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to scale your content?</h2>
          <p className="text-xl text-slate-400 mb-10">Join smart creators who are doing 10x more with the exact same effort.</p>
          <Link 
            href="/register" 
            className="inline-flex bg-white text-black hover:bg-slate-200 text-lg font-bold px-8 py-4 rounded-xl transition-all items-center gap-2"
          >
            Create your free account
          </Link>
          <p className="mt-6 text-sm text-slate-500">Includes 20 free credits to test it out.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0A0A0B] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <span className="text-xl font-bold text-white tracking-tight">RepurposeAI</span>
          </div>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} Repurpose AI. Built in Lagos, Nigeria.</p>
        </div>
      </footer>
    </div>
  );
}