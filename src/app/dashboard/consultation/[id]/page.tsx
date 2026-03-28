"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import Vapi from "@vapi-ai/web"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, PhoneOff, ActivitySquare, Loader2, User } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || "dummy_key_to_prevent_crash")

const SYSTEM_PROMPT = "You are an expert AI Medical Assistant acting as a General Physician. Your goal is to help users understand their symptoms and provide initial guidance in real-time. Greet the user warmly and ask how they are feeling. Ask clarifying questions about symptoms, including duration, severity, and potential triggers. Do not provide a final medical diagnosis. Suggest possible causes, recommend over-the-counter remedies if appropriate, or advise seeing a doctor for further evaluation. If symptoms seem severe, prioritize advising the user to seek immediate medical attention. Keep responses conversational but brief to maintain low-latency, real-time flow. Structure output to be easily transcribed by speech-to-text systems."

interface TranscriptMessage {
  role: "user" | "assistant" | "system"
  content: string
}

export default function ConsultationPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const symptoms = searchParams.get("symptoms") || ""
  const docType = searchParams.get("doc") || "general-123"

  const [callStatus, setCallStatus] = useState<"inactive" | "loading" | "active">("inactive")
  const [messages, setMessages] = useState<TranscriptMessage[]>([])
  const [partialTranscript, setPartialTranscript] = useState<{ role: string, content: string } | null>(null)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleCallStart = () => {
      setCallStatus("active")
    }

    const handleCallEnd = async () => {
      setCallStatus("inactive")
      if (messages.length > 0) {
        setIsGeneratingReport(true)
        try {
          // Pass transcript to the API to generate report
          const response = await fetch("/api/generate-report", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              transcript: messages,
              symptoms,
              doctorId: docType,
              sessionId: params.id 
            })
          })
          
          if (response.ok) {
            router.push("/dashboard")
          }
        } catch (error) {
          console.error("Failed to generate report:", error)
        } finally {
          setIsGeneratingReport(false)
        }
      }
    }

    const handleMessage = (message: any) => {
      if (message.type === "transcript") {
        const mappedRole = (message.role === "assistant" || message.role === "bot") ? "assistant" : "user";
        
        if (message.transcriptType === "partial") {
          setPartialTranscript({ role: mappedRole, content: message.transcript });
        } else if (message.transcriptType === "final") {
          setPartialTranscript(null);
          setMessages((prev) => [...prev, { role: mappedRole as "user" | "assistant", content: message.transcript }]);
        }
        // Scroll to bottom
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
          }
        }, 100)
      }
    }

    // Vapi Event Listeners
    vapi.on("call-start", handleCallStart)
    vapi.on("call-end", handleCallEnd)
    vapi.on("message", handleMessage)

    return () => {
      vapi.removeAllListeners()
    }
  }, [messages, router, params.id, symptoms, docType])

  const startCall = () => {
    setCallStatus("loading")
    vapi.start({
       transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT + `\n\nUser initially reported symptoms: ${symptoms}`
          }
        ]
      },
      voice: {
        provider: "11labs",
        voiceId: "cgSgspJ2msm6clMCkdW9" // Example voice
      }
    })
  }

  const endCall = () => {
    vapi.stop()
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
      
      {isGeneratingReport ? (
        <div className="flex flex-col items-center justify-center glass p-12 rounded-3xl animate-in fade-in duration-500">
          <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
          <h2 className="text-2xl font-bold mb-2">Generating Medical Report</h2>
          <p className="text-muted-foreground text-center max-w-sm">
            Our AI is analyzing the consultation transcript to structure your clinical summary.
          </p>
        </div>
      ) : (
        <div className="w-full glass rounded-3xl overflow-hidden border border-white/10 flex flex-col h-[600px] shadow-2xl">
          <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center relative">
                  <ActivitySquare className="w-6 h-6 text-primary" />
                  {callStatus === "active" && (
                     <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full animate-ping" />
                  )}
               </div>
               <div>
                 <h2 className="text-xl font-bold">AI Doctor Consultation</h2>
                 <p className="text-sm text-green-400 font-medium">
                   {callStatus === "active" ? "Connected - Speak Now" : callStatus === "loading" ? "Connecting..." : "Ready"}
                 </p>
               </div>
            </div>
            {callStatus === "active" ? (
              <Button variant="destructive" size="icon" className="w-12 h-12 rounded-full shadow-[0_0_20px_rgba(239,68,68,0.5)]" onClick={endCall}>
                <PhoneOff className="w-6 h-6" />
              </Button>
            ) : null}
          </div>

          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                 <Mic className="w-16 h-16 mb-4" />
                 <p>Your real-time transcript will appear here.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex gap-4 ${msg.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-primary text-white" : "bg-blue-600 text-white"}`}>
                      {msg.role === "assistant" ? <ActivitySquare className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === "assistant" ? "bg-white/10 rounded-tl-sm" : "bg-blue-600/20 text-blue-100 rounded-tr-sm border border-blue-500/20"}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {partialTranscript && (
                  <div className={`flex gap-4 ${partialTranscript.role === "assistant" ? "flex-row" : "flex-row-reverse"} opacity-70 animate-pulse`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${partialTranscript.role === "assistant" ? "bg-primary text-white" : "bg-blue-600 text-white"}`}>
                      {partialTranscript.role === "assistant" ? <ActivitySquare className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl max-w-[80%] ${partialTranscript.role === "assistant" ? "bg-white/10 rounded-tl-sm" : "bg-blue-600/20 text-blue-100 rounded-tr-sm border border-blue-500/20"}`}>
                      {partialTranscript.content}
                      <span className="ml-1 opacity-50">...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {callStatus === "inactive" && messages.length === 0 && (
            <div className="p-6 bg-background/50 border-t border-white/10 flex justify-center">
              <Button size="lg" className="rounded-full px-12 py-6 text-xl shadow-lg shadow-primary/30 group" onClick={startCall}>
                <Mic className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Initialize Call
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
