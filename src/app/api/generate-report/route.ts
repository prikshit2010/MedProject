import { auth } from "@clerk/nextjs/server"
import { OpenAI } from "openai"
import { db } from "@/db"
import { sessionHistory } from "@/db/schema"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 })
    }

    const { transcript, symptoms, doctorId, sessionId } = await req.json()

    if (!transcript || transcript.length === 0) {
      console.error(`[REPORT_ERROR] Empty transcript received for session: ${sessionId}`);
      return new Response("No transcript provided", { status: 400 })
    }

    // Format transcript for OpenAI
    const conversation = transcript
      .map((t: { role: string; content: string }) => `${t.role.toUpperCase()}: ${t.content}`)
      .join("\n")

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are an expert medical AI tasked with generating a structured clinical report from a raw voice consultation transcript.
          Output ONLY JSON in the following format:
          {
            "chiefComplaint": "string",
            "symptoms": ["string"],
            "recommendations": ["string"],
            "severityAssessment": "low" | "medium" | "high",
            "summary": "string"
          }`
        },
        {
          role: "user",
          content: `Here is the transcript of the consultation:\n\n${conversation}\n\nInitial reported symptoms: ${symptoms}`
        }
      ]
    })

    let reportJson = {}
    try {
      reportJson = JSON.parse(completion.choices[0].message.content || "{}")
    } catch (e) {
      console.error("Failed to parse JSON from OpenAI", e)
    }

    // Insert the session and report into Neon Database
    try {
      await db.insert(sessionHistory).values({
        id: sessionId, // This was passed from the client UUID
        userId: userId,
        doctorId: doctorId,
        symptoms: symptoms,
        generatedReport: reportJson
      })

    } catch (dbError) {
      console.error("[REPORT_ERROR] Database insertion failed:", dbError)
      return new Response(JSON.stringify({ error: "Failed to save generated report" }), { status: 500 })
    }

    console.log(`[REPORT_SUCCESS] Successfully generated and saved report for session: ${sessionId}`);
    return new Response(JSON.stringify({ success: true, report: reportJson }), { status: 200 })

  } catch (error) {
    console.error("[REPORT_ERROR] Fatal error generating report:", error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal Server Error" }), { status: 500 })
  }
}
