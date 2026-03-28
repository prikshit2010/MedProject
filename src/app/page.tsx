"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { PlayCircle, ShieldCheck, ActivitySquare, ArrowRight } from "lucide-react"
import Link from "next/link"

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />

      <main className="container mx-auto px-4 pt-32 pb-24 text-center max-w-5xl z-10 flex flex-col items-center">
        <motion.div
           initial="hidden" animate="visible" variants={fadeIn}
           className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium text-primary shadow-2xl"
        >
          <ActivitySquare className="w-4 h-4" />
          <span>Next Generation Telehealth</span>
        </motion.div>

        <motion.h1 
          initial="hidden" animate="visible" variants={fadeIn}
          className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-tight"
        >
          Your Personal <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
            AI Medical Agent
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          Talk to a highly specialized AI doctor in real-time. Get instant medical guidance, symptom analysis, and a structured health report instantly.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, type: 'spring' }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full"
        >
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg group bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/25">
              Start Free Consultation
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 text-lg glass border-white/10 hover:bg-white/5 transition-all">
              <ShieldCheck className="w-5 h-5 mr-2 text-blue-400" />
              View Pricing
            </Button>
          </Link>
        </motion.div>

        {/* Feature Cards Showcase */}
        <motion.div 
          initial="hidden" animate="visible" variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.8 }}
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full"
        >
          {[
            { title: "Real-time Voice", icon: <PlayCircle className="w-8 h-8 text-primary" />, desc: "Ultra-low latency conversational AI utilizing advanced speech-to-text models." },
            { title: "Specialized Doctors", icon: <ShieldCheck className="w-8 h-8 text-blue-400" />, desc: "Consult with virtual General Physicians, Pediatricians, and Psychologists." },
            { title: "Instant Reports", icon: <ActivitySquare className="w-8 h-8 text-purple-400" />, desc: "Automatically generated, structured JSON clinical summaries post-call." }
          ].map((feature, i) => (
            <motion.div key={i} variants={fadeIn} className="glass p-8 rounded-3xl text-left border-t border-white/10 hover:-translate-y-2 transition-transform duration-300">
              <div className="bg-white/5 p-4 rounded-2xl inline-block mb-6 shadow-inner">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  )
}
