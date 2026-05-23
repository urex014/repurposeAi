// app/dashboard/page.tsx
"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import { 
  Copy, 
  CheckCircle2, 
  Sparkles, 
  Video, 
  MessageSquare, 
  Mail, 
  Wand2, 
  AlertCircle,
  FileText
} from "lucide-react"

// A reusable sub-component for the output cards
function ResultCard({ title, content, icon: Icon }: { title: string; content: string; icon: React.ElementType }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0c0c0e]/80 backdrop-blur-xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/50 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Icon className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-semibold text-slate-200 text-lg">{title}</h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all border border-slate-700 active:scale-95"
        >
          {copied ? (
            <>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy Text
            </>
          )}
        </button>
      </div>

      {/* Rendered Markdown Content */}
      <div className="p-8">
        <div className="prose prose-sm md:prose-base prose-invert max-w-none 
          prose-headings:text-white prose-headings:font-bold
          prose-p:leading-relaxed prose-p:text-slate-300
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:text-slate-300 prose-ol:text-slate-300
          prose-pre:bg-slate-900/80 prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-lg
          prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:text-slate-300"
        >
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [inputText, setInputText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, string> | null>(null)

  const [options, setOptions] = useState({
    videoScript: true,
    socialPosts: true,
    newsletter: false,
  })

  const requiredCredits = Object.values(options).filter(Boolean).length * 10

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim() || requiredCredits === 0) return

    setIsGenerating(true)
    setError(null)
    setResults(null)

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          options,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      setResults(data.data)
      setInputText("")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }

  const toggleOption = (key: keyof typeof options) => {
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const OUTPUT_OPTIONS = [
    { id: "videoScript", label: "Video Script", desc: "1-2 min engaging script for Reels/TikTok", icon: Video },
    { id: "socialPosts", label: "Social Posts", desc: "3-5 catchy posts for Twitter/LinkedIn", icon: MessageSquare },
    { id: "newsletter", label: "Newsletter", desc: "150-200 word summary with CTA", icon: Mail },
  ]

  return (
    <div className="min-h-screen pb-24 selection:bg-blue-500/30">
      
      {/* Subtle Background Glow */}
      <div className="fixed top-0 inset-x-0 h-[500px] pointer-events-none z-0">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 space-y-12 mt-12">
        {/* Header Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white tracking-tight">
            Repurpose Your Content
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl">
            Paste your source material below, select your desired formats, and let our AI engine do the heavy lifting.
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleGenerate} className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 fill-mode-both">
          
          {/* Editor Area */}
          <div className="rounded-2xl border border-slate-800 bg-[#0c0c0e]/80 backdrop-blur-sm overflow-hidden shadow-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all group">
            <div className="bg-slate-900/50 px-6 py-3 border-b border-slate-800 flex items-center gap-2 text-sm font-medium text-slate-400">
              <FileText className="w-4 h-4" />
              Source Material
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your long-form blog post, article, or raw notes here..."
              className="w-full h-72 bg-transparent p-6 text-slate-200 placeholder:text-slate-600 resize-y outline-none leading-relaxed"
              required
            />
            <div className="bg-slate-900/80 px-6 py-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center transition-colors group-focus-within:bg-slate-900">
              <span className="font-mono">{inputText.length} chars</span>
              <span>Supports up to ~5,000 words</span>
            </div>
          </div>

          {/* Options Grid */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              Select Outputs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {OUTPUT_OPTIONS.map((opt) => {
                const isActive = options[opt.id as keyof typeof options];
                const Icon = opt.icon;
                
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.id as keyof typeof options)}
                    className={`cursor-pointer rounded-2xl border p-5 transition-all duration-200 relative overflow-hidden group ${
                      isActive
                        ? "border-blue-500 bg-blue-500/10 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] transform -translate-y-0.5"
                        : "border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-400 group-hover:text-slate-300'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? "border-blue-500 bg-blue-500" : "border-slate-700"}`}>
                        {isActive && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      </div>
                    </div>
                    <div className={`font-semibold mb-1 ${isActive ? "text-white" : "text-slate-300"}`}>
                      {opt.label}
                    </div>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Submission Bar */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-xl">
            <div className="flex items-center gap-3 pl-2">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">Total Cost</p>
                <p className="text-lg text-white font-bold">{requiredCredits} <span className="text-sm text-slate-500 font-normal">Credits</span></p>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isGenerating || requiredCredits === 0 || !inputText.trim()}
              className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-3.5 font-semibold text-white transition-all hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_-5px_rgba(37,99,235,0.6)]"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Content...
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  Generate Now
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Section */}
        {results && (
          <div className="space-y-8 pt-12 mt-12 border-t border-slate-800/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-8 bg-blue-500 rounded-full" />
              <h2 className="text-2xl font-bold text-white">Your Generated Content</h2>
            </div>
            
            <div className="grid gap-8">
              {results.videoScript && (
                <ResultCard 
                  title="Video Script" 
                  content={results.videoScript} 
                  icon={Video}
                />
              )}
              {results.socialPosts && (
                <ResultCard 
                  title="Social Media Posts" 
                  content={results.socialPosts} 
                  icon={MessageSquare}
                />
              )}
              {results.newsletter && (
                <ResultCard 
                  title="Newsletter Draft" 
                  content={results.newsletter} 
                  icon={Mail}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}