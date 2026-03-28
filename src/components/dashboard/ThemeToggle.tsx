"use client"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Card className="glass shadow-sm">
      <CardHeader>
        <CardTitle>Interface Theme</CardTitle>
        <CardDescription>Select your preferred aesthetic. Light mode is our clinical default.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button 
             variant={theme === 'light' ? 'default' : 'outline'} 
             onClick={() => setTheme('light')}
             className="rounded-full"
          >
            <Sun className="w-4 h-4 mr-2" />
            Light
          </Button>
          <Button 
             variant={theme === 'dark' ? 'default' : 'outline'} 
             onClick={() => setTheme('dark')}
             className="rounded-full"
          >
            <Moon className="w-4 h-4 mr-2" />
            Dark
          </Button>
          <Button 
             variant={theme === 'system' ? 'default' : 'outline'} 
             onClick={() => setTheme('system')}
             className="rounded-full"
          >
            <Monitor className="w-4 h-4 mr-2" />
            System
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
