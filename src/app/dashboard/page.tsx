import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { sessionHistory, users } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import NewSessionDialog from "@/components/dashboard/NewSessionDialog"
import PremiumPopup from "@/components/dashboard/PremiumPopup"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ActivitySquare, Calendar, Clock, Stethoscope, ChevronRight, Scale } from "lucide-react"

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch strictly from Neon
  const [userQuery, sessions] = await Promise.all([
     db.select().from(users).where(eq(users.id, userId)),
     db.select().from(sessionHistory).where(eq(sessionHistory.userId, userId)).orderBy(desc(sessionHistory.consultationDate))
  ]);
  
  const user = userQuery[0];

  // BMI Calculation
  let bmi = null;
  let bmiCategory = "";
  if (user?.weight && user?.height) {
    const heightInMeters = user.height / 100;
    bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
    const bmiVal = parseFloat(bmi);
    if (bmiVal < 18.5) { bmiCategory = "Underweight"; }
    else if (bmiVal < 24.9) { bmiCategory = "Healthy Weight"; }
    else if (bmiVal < 29.9) { bmiCategory = "Overweight"; }
    else { bmiCategory = "Obese"; }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <PremiumPopup credits={user?.credits || 0} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-foreground">Health Overview</h1>
          <p className="text-muted-foreground text-lg">Manage your consultations and health insights.</p>
        </div>
        <NewSessionDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Health Metrics Card (BMI) */}
        <Card className="glass md:col-span-1 shadow-md bg-white/70">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Body Mass Index</CardTitle>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <Scale className="w-5 h-5" />
            </div>
          </CardHeader>
          <CardContent>
             {bmi ? (
               <div className="mt-2">
                 <div className="text-5xl font-black text-primary tracking-tighter">{bmi}</div>
                 <div className="mt-2 font-medium bg-black/5 text-foreground px-3 py-1 inline-flex rounded-md text-sm ring-1 ring-black/10">
                   {bmiCategory}
                 </div>
                 <p className="text-xs text-muted-foreground mt-4">Based on your saved {user?.weight}kg weight & {user?.height}cm height.</p>
               </div>
             ) : (
               <div className="text-muted-foreground text-sm mt-4 p-4 border border-dashed border-black/20 rounded-xl bg-white/50 text-center">
                  Update your weight and height in <b>Settings</b> to unlock personalized BMI tracking.
               </div>
             )}
          </CardContent>
        </Card>

        {/* Consultation History explicit list */}
        <Card className="glass md:col-span-2 shadow-md bg-white/70">
          <CardHeader>
             <CardTitle className="text-xl font-bold">Recent Consultations</CardTitle>
             <CardDescription>Your past medical AI conversations.</CardDescription>
          </CardHeader>
          <CardContent className="h-[250px] overflow-y-auto pr-2 space-y-3">
             {sessions.length === 0 ? (
               <div className="flex flex-col items-center justify-center p-8 text-center h-full opacity-50">
                 <ActivitySquare className="w-12 h-12 text-muted-foreground mb-4" />
                 <p className="text-muted-foreground">You have no prior medical histories logged.</p>
               </div>
             ) : (
               sessions.map(s => (
                 <div key={s.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white hover:bg-primary/5 rounded-2xl border border-black/5 shadow-sm transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0">
                         <Stethoscope className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="font-semibold text-foreground line-clamp-1">{s.symptoms}</h4>
                         <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-3">
                           <span className="flex items-center"><Calendar className="w-3 h-3 mr-1"/> {new Date(s.consultationDate).toLocaleDateString()}</span>
                           <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {new Date(s.consultationDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         </div>
                       </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                 </div>
               ))
             )}
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
