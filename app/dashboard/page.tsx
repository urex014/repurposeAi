// app/dashboard/page.tsx
"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
// A reusable sub-component for the output cards
function ResultCard({ title, content }: { title: string; content: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg animate-in fade-in slide-in-from-bottom-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-800/50 px-6 py-3">
        <h3 className="font-semibold text-slate-200">{title}</h3>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700"
        >
          {copied ? (
            <>
              <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Rendered Markdown Content */}
      <div className="p-6">
        <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-700">
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

  const requiredCredits = Object.values(options).filter(Boolean).length

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
      // Clear input after success for a clean slate
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

  return (
    <div className="space-y-12 pb-12">
      {/* Input Section */}
      <div className="animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold mb-2 text-white">Repurpose Your Content</h1>
        <p className="text-slate-400 mb-8">Paste your blog post below and select the formats you want to generate.</p>

        {error && (
          <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/20 p-4 text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleGenerate} className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste your long-form content here (e.g., a blog post, article, or essay)..."
              className="w-full h-64 bg-transparent p-6 text-slate-200 placeholder:text-slate-600 resize-y outline-none"
              required
            />
            <div className="bg-slate-800/50 px-6 py-3 border-t border-slate-800 text-xs text-slate-500 flex justify-between">
              <span>{inputText.length} characters</span>
              <span>Supports up to ~5,000 words</span>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Select Outputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "videoScript", label: "Video Script", desc: "1-2 min engaging script for Reels/TikTok" },
                { id: "socialPosts", label: "Social Posts", desc: "3-5 catchy posts for X/LinkedIn" },
                { id: "newsletter", label: "Newsletter", desc: "150-200 word summary with CTA" },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => toggleOption(opt.id as keyof typeof options)}
                  className={`cursor-pointer rounded-xl border p-5 transition-all ${options[opt.id as keyof typeof options]
                      ? "border-indigo-500 bg-indigo-500/10"
                      : "border-slate-800 bg-slate-900 hover:border-slate-700 hover:bg-slate-800/50"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-semibold ${options[opt.id as keyof typeof options] ? "text-indigo-400" : "text-slate-300"}`}>
                      {opt.label}
                    </span>
                    <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${options[opt.id as keyof typeof options] ? "border-indigo-500 bg-indigo-500" : "border-slate-600"}`}>
                      {options[opt.id as keyof typeof options] && (
                        <svg viewBox="0 0 14 14" fill="none" className="h-2.5 w-2.5 text-white">
                          <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Cost: <span className="text-slate-200 font-bold">{requiredCredits} credits</span>
            </p>
            <button
              type="submit"
              disabled={isGenerating || requiredCredits === 0 || !inputText.trim()}
              className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white transition-all hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing with AI...
                </>
              ) : (
                "Generate Content"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-8 pt-8 border-t border-slate-800">
          <h2 className="text-2xl font-bold text-white">Your Generated Content</h2>
          <div className="grid gap-6">
            {results.videoScript && (
              <ResultCard title="🎬 Video Script" content={results.videoScript} />
            )}
            {results.socialPosts && (
              <ResultCard title="📱 Social Media Posts" content={results.socialPosts} />
            )}
            {results.newsletter && (
              <ResultCard title="📧 Newsletter Summary" content={results.newsletter} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}