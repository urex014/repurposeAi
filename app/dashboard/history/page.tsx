// app/dashboard/history/page.tsx
import { auth } from "@/auth"
import clientPromise from "@/lib/mongodb"
import { redirect } from "next/navigation"
import ReactMarkdown from "react-markdown"
import Link from "next/link"

// Helper to format the MongoDB timestamp into a readable date
function formatDate(dateString: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString))
}

export default async function HistoryPage() {
  // 1. Authenticate the user
  const session = await auth()
  if (!session?.user?.email) redirect("/login")

  // 2. Connect to Database
  const client = await clientPromise
  const db = client.db()

  const user = await db.collection("users").findOne({ email: session.user.email })
  if (!user) redirect("/login")

  // 3. Fetch user's content history, sorted by newest first
  const history = await db.collection("content")
    .find({ userId: user._id })
    .sort({ createdAt: -1 })
    .toArray()

  return (
    <div className="animate-in fade-in duration-500 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Past Outputs</h1>
          <p className="text-slate-400">Review and retrieve your previously generated content.</p>
        </div>
        <Link
          href="/dashboard"
          className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
        >
          + New Generation
        </Link>
      </div>

      {/* Empty State */}
      {history.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 className="text-lg font-medium text-slate-300 mb-2">No history yet</h3>
          <p className="text-slate-500 mb-6">You haven't generated any content yet.</p>
          <Link
            href="/dashboard"
            className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        /* History Feed */
        <div className="space-y-8">
          {history.map((item) => (
            <div key={item._id.toString()} className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">

              {/* Card Header */}
              <div className="border-b border-slate-800 bg-slate-800/30 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <span className="text-sm font-medium text-slate-300">
                    {formatDate(item.createdAt)}
                  </span>
                </div>
                <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-400 border border-slate-700">
                  {item.creditsUsed} Credits Used
                </span>
              </div>

              {/* Original Text Snippet */}
              <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-900">
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Original Input</h4>
                <p className="text-sm text-slate-400 line-clamp-2 italic">"{item.originalText}"</p>
              </div>

              {/* Generated Outputs Grid */}
              <div className="p-6 grid gap-6 md:grid-cols-2">
                {item.outputs.videoScript && (
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <h4 className="text-sm font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                      🎬 Video Script
                    </h4>
                    <div className="prose prose-sm prose-invert max-w-none text-slate-300 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      <ReactMarkdown>{item.outputs.videoScript}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {item.outputs.socialPosts && (
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4">
                    <h4 className="text-sm font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                      📱 Social Posts
                    </h4>
                    <div className="prose prose-sm prose-invert max-w-none text-slate-300 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      <ReactMarkdown>{item.outputs.socialPosts}</ReactMarkdown>
                    </div>
                  </div>
                )}

                {item.outputs.newsletter && (
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 md:col-span-2">
                    <h4 className="text-sm font-semibold text-indigo-400 mb-3 flex items-center gap-2">
                      📧 Newsletter
                    </h4>
                    <div className="prose prose-sm prose-invert max-w-none text-slate-300 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                      <ReactMarkdown>{item.outputs.newsletter}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}