"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PlayCircle, Stethoscope, ActivitySquare, Pill } from "lucide-react"

export default function NewSessionDialog() {
  const [symptoms, setSymptoms] = useState("")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const suggestDoctor = () => {
    const text = symptoms.toLowerCase()
    if (text.includes("child") || text.includes("baby") || text.includes("kid")) return {
      id: "pediatrician-123",
      role: "Pediatrician",
      icon: <Pill className="w-8 h-8 text-blue-400" />
    }
    if (text.includes("sad") || text.includes("anxious") || text.includes("depress")) return {
      id: "psychologist-123",
      role: "Psychologist",
      icon: <ActivitySquare className="w-8 h-8 text-purple-400" />
    }
    return {
      id: "general-123",
      role: "General Physician",
      icon: <Stethoscope className="w-8 h-8 text-primary" />
    }
  }

  const doctor = suggestDoctor()
  const isReady = symptoms.length > 5

  const startConsultation = () => {
    // Generate a random ID for the new session route or just push to consultation with the doctor string
    const targetSessionId = crypto.randomUUID()
    router.push(`/dashboard/consultation/${targetSessionId}?doc=${doctor.id}&symptoms=${encodeURIComponent(symptoms)}`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button 
            size="lg" 
            className="w-full sm:w-auto shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 rounded-full px-8 py-6 text-lg" 
          />
        }
      >
        <PlayCircle className="w-5 h-5 mr-2" />
        Start New Consultation
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-white/10 glass rounded-3xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">What&apos;s bothering you?</DialogTitle>
          <DialogDescription className="text-muted-foreground text-base">
            Briefly describe your symptoms so we can connect you with the right specialist.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <Textarea 
            placeholder="E.g., I've had a severe headache and fever for the last 2 days..."
            className="min-h-[120px] bg-white/5 border-white/10 focus-visible:ring-primary rounded-xl text-lg p-4"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />

          {isReady && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-between animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-4">
                <div className="bg-background/50 p-3 rounded-full">
                  {doctor.icon}
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-foreground">Suggested Doctor</h4>
                  <p className="text-sm text-muted-foreground">{doctor.role}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            disabled={!isReady} 
            onClick={startConsultation}
            className="w-full sm:w-auto rounded-full px-8 bg-blue-600 hover:bg-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Connect to {doctor.role}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
