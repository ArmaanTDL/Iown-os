import { runAgent } from "@/lib/agent";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/db/queries";

export async function POST() {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserByClerkId(clerkId);
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        const result = await runAgent(user.id);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Agent run error:", error);
        return NextResponse.json(
            { error: "Agent run failed", details: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 },
        );
    }
}
