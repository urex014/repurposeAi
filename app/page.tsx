import Link from 'next/link';
import { 
  CheckCircle2, 
  Zap, 
  FileText, 
  PenTool, 
  MessageSquare, 
  // Linkedin, 
  Mail, 
  GraduationCap, 
  Search,
  ArrowRight
} from 'lucide-react'; // *Note: standard import is 'lucide-react'

// --- Data Dictionaries for clean JSX ---

const FEATURES = [
  { name: 'Text Summarization', description: 'Condense long articles into bite-sized bullet points.', icon: <FileText className="w-6 h-6 text-blue-500" /> },
  { name: 'Content Rewriting', description: 'Enhance clarity, flow, and tone of your existing text.', icon: <PenTool className="w-6 h-6 text-purple-500" /> },
  { name: 'Blog Generation', description: 'Generate SEO-optimized blog posts from a single prompt.', icon: <Zap className="w-6 h-6 text-amber-500" /> },
  // { name: 'LinkedIn Posts', description: 'Build your personal brand with viral-ready LinkedIn hooks.', icon: <Linkedin className="w-6 h-6 text-sky-500" /> },
  { name: 'Social Captions', description: 'Catchy captions for Instagram and TikTok with hashtags.', icon: <MessageSquare className="w-6 h-6 text-pink-500" /> },
  { name: 'Email Writing', description: 'Professional, persuasive emails drafted in seconds.', icon: <Mail className="w-6 h-6 text-emerald-500" /> },
  { name: 'Study Notes', description: 'Turn complex concepts into easy-to-digest study guides.', icon: <GraduationCap className="w-6 h-6 text-orange-500" /> },
  { name: 'Document Analysis', description: 'Extract insights and actionable data from any text.', icon: <Search className="w-6 h-6 text-indigo-500" /> },
];

const PRICING = [
  { credits: '5,000', price: '₦5,000', popular: false },
  { credits: '25,000', price: '₦25,000', popular: true },
  { credits: '50,000', price: '₦50,000', popular: false },
  { credits: '80,000', price: '₦80,000', popular: false },
  { credits: '100,000', price: '₦100,000', popular: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold text-white tracking-tight">
            Repurpose<span className="text-blue-500">AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-white transition-colors">
              Log in
            </Link>
            <Link 
              href="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 text-center max-w-5xl mx-auto">
        {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-6 border border-blue-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          Powered by Google Gemini 1.5
        </div> */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
          Do more with your content. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            In seconds, not hours.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Repurpose AI transforms your ideas into blogs, LinkedIn posts, study notes, and emails instantly. Pay only for the credits you use.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/register" 
            className="w-full sm:w-auto bg-white text-slate-950 hover:bg-slate-200 text-lg font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Start for free <ArrowRight className="w-5 h-5" />
          </Link>
          <a 
            href="#pricing" 
            className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white text-lg font-semibold px-8 py-4 rounded-xl transition-all"
          >
            View Pricing
          </a>
        </div>
        <p className="mt-4 text-sm text-slate-500">No credit card required. Get 50 free credits.</p>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-900 border-y border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Everything you need to scale your output</h2>
            <p className="text-slate-400 max-w-xl mx-auto">One credit balance unlocks an entire suite of AI tools designed for creators, students, and professionals.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
                <div className="bg-slate-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4 border border-slate-800">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Simple, transparent pricing</h2>
          <p className="text-slate-400">Top up your credits anytime. Credits never expire.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {PRICING.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-slate-900 border rounded-2xl p-6 flex flex-col ${
                plan.popular ? 'border-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]' : 'border-slate-800'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-medium text-slate-300 mb-2">{plan.credits} Credits</h3>
              <div className="text-3xl font-bold text-white mb-6">{plan.price}</div>
              
              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Access all 8 AI tools
                </li>
                <li className="flex items-center gap-2 text-sm text-slate-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Never expires
                </li>
              </ul>
              
              <Link 
                href="/register" 
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors text-center ${
                  plan.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                Buy Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xl font-bold text-white tracking-tight">
            Repurpose<span className="text-blue-500">AI</span>
          </div>
          <p className="text-sm text-slate-500">© {new Date().getFullYear()} Repurpose AI. Built for creators.</p>
        </div>
      </footer>
    </div>
  );
}