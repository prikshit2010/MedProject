import { auth, currentUser } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Zap, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function PricingPage() {
  const { userId } = await auth();
  const userDetails = await currentUser();

  // If user is authenticated, check their credits or simulated premium access
  let premiumAccess = false
  let credits = 1

  if (userId) {
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (user.length > 0) {
      credits = user[0].credits
      premiumAccess = credits >= 999 // Simulated premium flag
    } else if (userDetails) {
      // Failsafe: if the Clerk Webhook hasn't synced the user because we are on localhost,
      // dynamically inject them into the database so the Stripe hook has a target!
      await db.insert(users).values({
        id: userId,
        email: userDetails.emailAddresses[0].emailAddress,
        name: userDetails.fullName || "User",
        credits: 1,
      });
      console.log("Auto-synced missing user to database!");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 py-20 bg-background relative overflow-hidden">
      <div className="absolute top-[20%] right-[20%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[20%] left-[20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -z-10" />

      <div className="text-center max-w-3xl mb-16 px-4">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground">Choose the plan that best fits your telehealth needs. Upgrade anytime.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-4">
        {/* Free Plan */}
        <div className="glass p-10 rounded-[2.5rem] relative border border-white/5 flex flex-col">
           <h3 className="text-2xl font-bold mb-2">Basic Access</h3>
           <div className="flex items-baseline gap-2 mb-6">
             <span className="text-5xl font-black">$0</span>
             <span className="text-muted-foreground">/ month</span>
           </div>
           
           <ul className="space-y-4 mb-10 flex-1">
             <li className="flex items-center gap-3">
               <div className="bg-primary/20 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
               <span>1 Free Consultation</span>
             </li>
             <li className="flex items-center gap-3">
               <div className="bg-primary/20 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
               <span>General Physician Access Only</span>
             </li>
             <li className="flex items-center gap-3">
               <div className="bg-primary/20 p-1 rounded-full"><Check className="w-4 h-4 text-primary" /></div>
               <span>Basic Post-call Reports</span>
             </li>
           </ul>

           <Link href={userId ? "/dashboard" : "/sign-up"}>
             <Button variant="outline" size="lg" className="w-full rounded-2xl py-6 text-lg border-white/10 hover:bg-white/5 disabled:opacity-50" disabled={premiumAccess}>
               {premiumAccess ? "Upgraded" : userId ? (credits > 0 ? "Current Plan" : "Out of Credits") : "Get Started"}
             </Button>
           </Link>
        </div>

        {/* Pro Plan */}
        <div className="glass p-10 rounded-[2.5rem] relative border-2 border-primary/50 flex flex-col transform md:-translate-y-4 shadow-[0_0_50px_rgba(121,40,202,0.15)] overflow-hidden">
           <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-primary" />
           <div className="absolute top-4 right-4 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full">RECOMMENDED</div>
           
           <h3 className="text-2xl font-bold mb-2 text-primary">Aura Premium</h3>
           <div className="flex items-baseline gap-2 mb-6">
             <span className="text-5xl font-black">$29</span>
             <span className="text-muted-foreground">/ month</span>
           </div>
           
           <ul className="space-y-4 mb-10 flex-1">
             <li className="flex items-center gap-3">
               <div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-blue-400" /></div>
               <span className="font-medium text-foreground">Unlimited Consultations</span>
             </li>
             <li className="flex items-center gap-3">
               <div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-blue-400" /></div>
               <span>Access all Specialists (Psychiatry, Pediatrics, etc.)</span>
             </li>
             <li className="flex items-center gap-3">
               <div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-blue-400" /></div>
               <span>Advanced Clinical Insight Reports</span>
             </li>
             <li className="flex items-center gap-3">
               <div className="bg-blue-500/20 p-1 rounded-full"><Check className="w-4 h-4 text-blue-400" /></div>
               <span>Priority Low-latency Voice Routing</span>
             </li>
           </ul>

           <form action="/api/stripe/checkout" method="POST" className="w-full">
             <Button type="submit" size="lg" className="w-full rounded-2xl py-6 text-lg bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(121,40,202,0.4)]" disabled={premiumAccess || !userId}>
                {premiumAccess ? "Active Plan" : !userId ? "Log in to Upgrade" : "Upgrade to Premium"}
                <Zap className="w-5 h-5 ml-2" />
             </Button>
           </form>
        </div>
      </div>
    </div>
  )
}
