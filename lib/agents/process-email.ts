import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import type { CalendarEvent } from "./calendar";
import type { ParsedEmail } from "./gmail";

const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const emailAnalysisSchema = z.object({
    summary: z.string().describe("A 1-2 sentence summary of the email"),
    priority: z
        .enum(["low", "medium", "high"])
        .describe("Priority level: high = urgent/time-sensitive, medium = requires action soon, low = informational"),
    actionItems: z
        .array(
            z.object({
                title: z.string().describe("Short task title"),
                description: z.string().describe("More detail about what needs to be done"),
                dueDate: z
                    .string()
                    .nullable()
                    .describe("ISO date string if a deadline is mentioned, otherwise null"),
            }),
        )
        .describe("Concrete action items extracted from the email"),
    needsReply: z.boolean().describe("Whether this email requires a response"),
    draftReply: z
        .string()
        .nullable()
        .describe("A professional draft reply if needsReply is true, otherwise null"),
    calendarEvents: z
        .array(
            z.object({
                title: z.string().describe("Short event title"),
                description: z.string().describe("Brief event description with context from the email"),
                date: z.string().describe("ISO date string for the event"),
                startTime: z.string().nullable().describe("ISO datetime string if a specific time is mentioned, otherwise null"),
                endTime: z.string().nullable().describe("ISO datetime string for event end, otherwise null"),
            }),
        )
        .describe("Calendar events to create from this email"),
    category: z
        .enum(["work", "personal", "newsletter", "notification", "spam", "other"])
        .describe("Email category for organization"),
});

export type EmailAnalysis = z.infer<typeof emailAnalysisSchema>;

export async function anaylzeWithAI(
    email: ParsedEmail,
    upcomingEvents: CalendarEvent[],
): Promise<EmailAnalysis> {
    const today = new Date().toISOString().split("T")[0];

    let calendarContext = "";
    if (upcomingEvents.length > 0) {
        const eventsList = upcomingEvents
            .map((e) => `- ${e.summary} (${e.start} to ${e.end}${e.location ? `, at ${e.location}` : ""})`)
            .join("\n");
        calendarContext = `\n\nUpcoming calendar events (next 24 hours):\n${eventsList}\n\nUse these to avoid creating duplicate tasks or events.`;
    }

    const { object } = await generateObject({
        model: google("gemini-2.5-flash"),
        schema: emailAnalysisSchema,
        prompt: `You are an AI assistant analyzing emails. Today's date is ${today}.

Analyze the following email and extract structured information:

From: ${email.from}
To: ${email.to}
Subject: ${email.subject}
Date: ${email.date}

Body:
${email.body}${calendarContext}

Instructions:
- Extract action items for any tasks or requests mentioned.
- If the email mentions ANY deadline, meeting, or time-sensitive event, create a calendar event for it.
- Convert relative dates like "Friday" to actual ISO dates based on today's date (${today}).
- If a reply is needed, draft a professional response.
- Categorize the email and set priority based on urgency.`,
    });

    return object;
}