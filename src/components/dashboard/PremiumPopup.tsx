"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, CreditCard } from "lucide-react"

export default function PremiumPopup({ credits }: { credits: number }) {
  const [open, setOpen] = useState(credits < 999);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] border-orange-500/20 shadow-xl bg-orange-50/95 glass rounded-3xl">
        <DialogHeader className="flex items-center flex-col text-center">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
             <AlertCircle className="w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">Membership Missing</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground mt-2">
            You currently do not have an active membership plan. Premium access is required for unlimited medical consultations and personalized AI health reports.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-6">
           <Button onClick={() => router.push('/pricing')} size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg rounded-full h-12">
             <CreditCard className="w-5 h-5 mr-2" /> View Billing & Plans
           </Button>
           <DialogClose render={<Button variant="ghost" className="w-full text-muted-foreground rounded-full hover:bg-black/5">Dismiss</Button>} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
