import { auth } from "@clerk/nextjs/server"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { updateUserProfile } from "@/app/actions/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const result = await db.select().from(users).where(eq(users.id, userId));
  const user = result[0];

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Profile</h1>
        <p className="text-muted-foreground text-lg">Update your physical metrics for accurate health calculations.</p>
      </div>

      <form action={updateUserProfile}>
        <Card className="glass shadow-sm">
          <CardHeader>
            <CardTitle>Personal & Health Information</CardTitle>
            <CardDescription>Your data is securely saved in our private health database.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input type="number" id="age" name="age" defaultValue={user?.age || ""} placeholder="e.g. 35" className="bg-white/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNo">Contact Number</Label>
                <Input type="tel" id="contactNo" name="contactNo" defaultValue={user?.contactNo || ""} placeholder="+1 (555) 000-0000" className="bg-white/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input type="number" id="weight" name="weight" defaultValue={user?.weight || ""} placeholder="e.g. 70" className="bg-white/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input type="number" id="height" name="height" defaultValue={user?.height || ""} placeholder="e.g. 175" className="bg-white/50" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Home Address</Label>
                <Input type="text" id="address" name="address" defaultValue={user?.address || ""} placeholder="123 Health Ave, Medical City, MC 12345" className="bg-white/50" />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
               <Button type="submit" size="lg" className="rounded-full px-8 bg-primary text-white shadow-lg hover:bg-primary/90">
                 Save Profile
               </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
