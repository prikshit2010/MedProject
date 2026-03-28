import { UserButton } from "@clerk/nextjs"
import { LayoutDashboard, Settings, CreditCard, ActivitySquare } from "lucide-react"
import Link from "next/link"
import { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-card/60 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/20 flex items-center justify-center rounded-xl text-primary shadow-[0_0_15px_rgba(121,40,202,0.5)]">
            <ActivitySquare className="w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">AuraHealth</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl text-foreground font-medium transition-all hover:bg-white/10">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            Overview
          </Link>
          <Link href="/pricing" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all">
            <CreditCard className="w-5 h-5 text-purple-400" />
            Billing & Plans
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all">
            <Settings className="w-5 h-5 text-gray-400" />
            Settings
          </Link>
        </nav>
        
        <div className="p-6 border-t border-white/10 flex items-center gap-4">
          <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 shadow-lg" } }} />
          <div className="flex flex-col text-sm">
            <span className="font-medium text-foreground">My Account</span>
            <span className="text-xs text-muted-foreground">Manage profile</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative flex flex-col min-h-screen z-10">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-white/10 bg-card/60 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <ActivitySquare className="w-6 h-6 text-primary" />
            <span className="font-bold">AuraHealth</span>
          </div>
          <UserButton />
        </header>
        
        <div className="flex-1 overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Background gradients for dashboard */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px]" />
      </div>
    </div>
  )
}
