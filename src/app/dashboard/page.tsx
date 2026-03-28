import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { sessionHistory } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import NewSessionDialog from "@/components/dashboard/NewSessionDialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivitySquare, Calendar, Stethoscope, ChevronRight } from "lucide-react"

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const sessions = await db.select()
    .from(sessionHistory)
    .where(eq(sessionHistory.userId, userId))
    .orderBy(desc(sessionHistory.consultationDate));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Overview</h1>
          <p className="text-muted-foreground text-lg">Manage your consultations and health reports.</p>
        </div>
        <NewSessionDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.length === 0 ? (
          <div className="col-span-full glass flex flex-col items-center justify-center p-16 rounded-3xl text-center border-dashed border-2 border-white/10">
            <ActivitySquare className="w-16 h-16 text-muted-foreground mb-6 opacity-20" />
            <h3 className="text-2xl font-semibold mb-2">No past consultations</h3>
            <p className="text-muted-foreground">Start a new session to begin your first medical consultation.</p>
          </div>
        ) : (
          sessions.map((session) => (
            <Card key={session.id} className="glass border-white/10 hover:border-primary/50 transition-colors group cursor-pointer relative overflow-hidden rounded-3xl">
              <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10 group-hover:scale-150 transition-transform duration-500">
                <Stethoscope className="w-24 h-24 text-primary" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                    {session.doctorId === "general-123" ? "General Physician" : 
                     session.doctorId === "pediatrician-123" ? "Pediatrician" : "Psychologist"}
                  </span>
                </div>
                <CardTitle className="text-xl line-clamp-1">{session.symptoms}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(session.consultationDate).toLocaleDateString(undefined, {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex justify-between items-center bg-white/5 border-t border-white/10 mt-4 rounded-b-3xl">
                 <span className="text-sm text-muted-foreground inline-flex items-center">
                   View Report <ChevronRight className="w-4 h-4 ml-1" />
                 </span>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
