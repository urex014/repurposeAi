// app/dashboard/layout.tsx
import { auth, signOut } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { BuyCreditsButton } from "@/components/BuyCreditButton"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  // Protect the route: boot them to login if no session exists
  if (!session) redirect("/login")

  return (
    <div className="flex h-screen bg-slate-950 text-slate-50 font-sans selection:bg-indigo-500/30">

      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-6 flex flex-col justify-between">
        <div>
          <Link href="/dashboard" className="text-2xl font-bold tracking-tight mb-8 block">
            Repurpose<span className="text-indigo-500">AI</span>
          </Link>

          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="block px-4 py-2.5 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 rounded-lg font-medium transition-colors"
            >
              New Generation
            </Link>
            <Link
              href="/dashboard/history"
              className="block px-4 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Past Outputs
            </Link>
          </nav>
        </div>

        {/* User Profile, Credits & Logout */}
        <div className="border-t border-slate-800 pt-6">
          {/* Credit Counter */}
          <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Available Credits</p>
            <p className="text-2xl font-bold text-slate-100">10</p>
            <BuyCreditsButton />
            {/* Note: In a real app, fetch the live credit count from the DB here */}
          </div>

          <p className="text-sm font-medium text-slate-200 mb-1">{session.user?.name}</p>
          <p className="text-xs text-slate-500 mb-4 truncate">{session.user?.email}</p>

          <form
            action={async () => {
              "use server"
              await signOut({ redirectTo: "/login" })
            }}
          >
            <button className="w-full text-left text-sm text-red-400 hover:text-red-300 transition-colors">
              Log Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 overflow-y-auto p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}