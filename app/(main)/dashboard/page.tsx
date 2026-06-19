import { getOrCreateUser, getUnreadEmails, getLatestAgentRun, getUserIntegrations } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard-content";

export default async function DashboardPage() {
    const { userId: clerkId } = await auth();
    if (!clerkId) redirect("/sign-in");

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
    const name = clerkUser?.fullName ?? "";

    const user = await getOrCreateUser(clerkId, email, name);
    const integrations = await getUserIntegrations(user.id);
    const stats = await getUnreadEmails(user.id);
    const latestRun = await getLatestAgentRun(user.id);

    const gmailConnected = integrations.some((i) => i.provider === "gmail");
    const calendarConnected = integrations.some((i) => i.provider === "google_calendar");
    const agentReady = gmailConnected;

    const lastRunTime = latestRun?.completedAt
        ? new Date(latestRun.completedAt).toLocaleString()
        : "Never";

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

    // Pass the fetched data to the Client Component which handles all Framer Motion animations
    return (
        <DashboardContent
            greeting={greeting}
            firstName={clerkUser?.firstName}
            agentReady={agentReady}
            gmailConnected={gmailConnected}
            calendarConnected={calendarConnected}
            stats={stats}
            latestRun={latestRun}
            lastRunTime={lastRunTime}
        />
    );
}