import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MonitorIcon, CheckCircle2, XCircleIcon, ClockIcon, AlertCircleIcon } from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser, getAgentRuns, getUserIntegrations } from "@/db/queries";
import { redirect } from "next/navigation";

export default async function MonitorPage() {
    const { userId: clerkId } = await auth();
    if (!clerkId) redirect("/sign-in");

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
    const name = clerkUser?.fullName ?? "";

    const user = await getOrCreateUser(clerkId, email, name);
    const integrations = await getUserIntegrations(user.id);
    const runs = await getAgentRuns(user.id);

    const gmailConnected = integrations.some((i) => i.provider === "gmail");

    let agentStatus = "Idle";
    let statusSubtitle = "No integrations connected";

    if (gmailConnected) {
        agentStatus = "Ready";
        statusSubtitle = "Gmail integration connected";
    }

    const totalRuns = runs.length;
    const latestRun = runs[0];
    const lastRunTime = latestRun?.completedAt
        ? new Date(latestRun.completedAt).toLocaleString()
        : "Never";

    return (
        <div className="page-wrapper p-8">
            <div className="animate-fade-in-up" style={{ marginBottom: '2.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <span className="greeting-pill">
                        <span className="dot" />
                        Monitoring
                    </span>
                </div>
                <h1 className="page-title gradient-text-static" style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                    margin: 0,
                    lineHeight: 1.2,
                }}>
                    Agent Activity
                </h1>
                <p className="page-description" style={{ marginTop: '0.5rem', fontSize: '15px' }}>
                    Track your AI agent&apos;s activity and run history.
                </p>
            </div>

            <div className="section-line" />

            {/* Status Overview */}
            <div className="stats-grid-3 mb-8">
                <Card className="stat-card-accent animate-fade-in-up delay-1">
                    <CardHeader className="stat-card-header">
                        <CardTitle className="stat-card-title">Agent Status</CardTitle>
                        <MonitorIcon className="stat-icon" style={{ color: '#00d4aa' }} />
                    </CardHeader>
                    <CardContent>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <Badge style={{
                                background: gmailConnected ? 'rgba(0, 212, 170, 0.12)' : 'rgba(255, 255, 255, 0.05)',
                                color: gmailConnected ? '#00d4aa' : '#b0b0b5',
                                border: `1px solid ${gmailConnected ? 'rgba(0, 212, 170, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
                                fontWeight: 600,
                            }}>
                                {agentStatus}
                            </Badge>
                        </div>
                        <p className="stat-card-subtitle">{statusSubtitle}</p>
                    </CardContent>
                </Card>

                <Card className="stat-card-accent animate-fade-in-up delay-2">
                    <CardHeader className="stat-card-header">
                        <CardTitle className="stat-card-title">Total Runs</CardTitle>
                        <CheckCircle2 className="stat-icon" style={{ color: '#7b61ff' }} />
                    </CardHeader>
                    <CardContent>
                        <div className="stat-value">{totalRuns}</div>
                        <p className="stat-card-subtitle">Lifetime executions</p>
                    </CardContent>
                </Card>

                <Card className="stat-card-accent animate-fade-in-up delay-3">
                    <CardHeader className="stat-card-header">
                        <CardTitle className="stat-card-title">Last Run</CardTitle>
                        <ClockIcon className="stat-icon" style={{ color: '#ff6b6b' }} />
                    </CardHeader>
                    <CardContent>
                        <div className="stat-value text-xl font-semibold">{lastRunTime !== "Never" ? new Date(latestRun.completedAt!).toLocaleDateString() : "—"}</div>
                        <p className="stat-card-subtitle">{lastRunTime !== "Never" ? new Date(latestRun.completedAt!).toLocaleTimeString() : "Never"}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Log */}
            <Card className="animate-fade-in-up delay-4">
                <CardHeader>
                    <CardTitle style={{ letterSpacing: '-0.02em' }}>Agent Run History</CardTitle>
                    <CardDescription style={{ color: '#48484a' }}>
                        A log of all your AI agent executions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {runs.length === 0 ? (
                        <div className="empty-state py-8 text-center">
                            <XCircleIcon className="empty-state-icon mx-auto mb-4 h-12 w-12" style={{ color: '#2c2c2e' }} />
                            <p className="empty-state-title">No runs yet</p>
                            <p className="empty-state-text">
                                Connect Gmail in Settings to activate your agent.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {runs.map((run) => (
                                <div key={run.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0" style={{ borderColor: 'rgba(255, 255, 255, 0.04)' }}>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            {run.status === "success" ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" style={{ color: '#00d4aa' }} />
                                            ) : (
                                                <AlertCircleIcon className="h-4 w-4 text-red-500" style={{ color: '#ff453a' }} />
                                            )}
                                            <span className="font-medium text-sm" style={{ color: '#e5e5e7' }}>{run.summary || "Agent Run"}</span>
                                        </div>
                                        <div className="text-xs" style={{ color: '#6e6e73' }}>
                                            Started: {new Date(run.startedAt).toLocaleString()} | Duration: {((run.durationMs ?? 0) / 1000).toFixed(1)}s
                                        </div>
                                        {run.errorMessage && (
                                            <p className="text-xs mt-1" style={{ color: '#ff453a' }}>Error: {run.errorMessage}</p>
                                        )}
                                    </div>
                                    <Badge style={{
                                        background: run.status === "success" ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255, 69, 58, 0.1)',
                                        color: run.status === "success" ? '#00d4aa' : '#ff453a',
                                        border: `1px solid ${run.status === "success" ? 'rgba(0, 212, 170, 0.2)' : 'rgba(255, 69, 58, 0.2)'}`,
                                    }}>
                                        {run.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
