import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { getOrCreateUser, getUserIntegrations } from "@/db/queries";
import { auth, currentUser } from "@clerk/nextjs/server";
import { CalendarIcon, MailIcon, ArrowRightIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
        redirect("/sign-in");
    }

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
    const name = clerkUser?.fullName ?? "";

    const user = await getOrCreateUser(clerkId, email, name);
    const userIntegrations = await getUserIntegrations(user.id);

    const gmailIntegration = userIntegrations.find((i) => i.provider === "gmail");
    const calendarIntegration = userIntegrations.find((i) => i.provider === "google_calendar");

    const providers = [
        {
            key: "gmail",
            name: "Gmail",
            description: "Read and manage your emails with AI.",
            icon: MailIcon,
            integration: gmailIntegration,
            color: "#00d4aa",
        },
        {
            key: "google_calendar",
            name: "Google Calendar",
            description: "View and manage your calendar events.",
            icon: CalendarIcon,
            integration: calendarIntegration,
            color: "#ffd93d",
        },
    ];

    return (
        <div className="page-wrapper p-8">
            <div className="animate-fade-in-up" style={{ marginBottom: '2.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <span className="greeting-pill">
                        <span className="dot" />
                        Settings
                    </span>
                </div>
                <h1 className="page-title gradient-text-static" style={{
                    fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                    margin: 0,
                    lineHeight: 1.2,
                }}>
                    Configuration
                </h1>
                <p className="page-description" style={{ marginTop: '0.5rem', fontSize: '15px' }}>
                    Manage your integrations and preferences.
                </p>
            </div>

            <div className="section-line" />

            {/* Account */}
            <Card className="mb-6 animate-fade-in-up delay-1">
                <CardHeader>
                    <CardTitle style={{ letterSpacing: '-0.02em' }}>Account</CardTitle>
                    <CardDescription style={{ color: '#48484a' }}>Your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="status-row" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <span className="status-label">Email</span>
                        <span className="status-value">{email}</span>
                    </div>
                    <div className="status-row" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                        <span className="status-label">Name</span>
                        <span className="status-value">{name || "—"}</span>
                    </div>
                    <div className="status-row" style={{ padding: '8px 0' }}>
                        <span className="status-label">Member since</span>
                        <span className="status-value">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Integrations */}
            <Card className="animate-fade-in-up delay-2">
                <CardHeader>
                    <CardTitle style={{ letterSpacing: '-0.02em' }}>Integrations</CardTitle>
                    <CardDescription style={{ color: '#48484a' }}>
                        Connect your Google accounts to enable AI assistance
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {providers.map((provider) => (
                        <div key={provider.key} className="integration-row">
                            <div className="integration-info">
                                <div style={{
                                    width: '40px', height: '40px',
                                    borderRadius: '10px',
                                    background: `linear-gradient(135deg, ${provider.color}22, ${provider.color}11)`,
                                    border: `1px solid ${provider.color}33`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    <provider.icon style={{ width: '20px', height: '20px', color: provider.color }} />
                                </div>
                                <div>
                                    <p className="font-medium" style={{ color: '#e5e5e7', fontSize: '15px' }}>{provider.name}</p>
                                    <p className="status-label" style={{ fontSize: '13px', marginTop: '2px' }}>{provider.description}</p>
                                </div>
                            </div>
                            <div className="integration-actions">
                                {provider.integration ? (
                                    <>
                                        <Badge style={{
                                            background: 'rgba(0, 212, 170, 0.1)',
                                            color: '#00d4aa',
                                            border: '1px solid rgba(0, 212, 170, 0.2)',
                                            fontWeight: 600,
                                        }}>Connected</Badge>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                            style={{
                                                borderColor: 'rgba(255, 255, 255, 0.08)',
                                                color: '#b0b0b5',
                                            }}
                                        >
                                            <a href={`/api/auth/google?provider=${provider.key}`}>
                                                Reconnect
                                            </a>
                                        </Button>
                                    </>
                                ) : (
                                    <Button asChild className="glow-button" style={{ borderRadius: '8px', padding: '0 16px' }}>
                                        <a href={`/api/auth/google?provider=${provider.key}`}>
                                            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                Connect
                                                <ArrowRightIcon style={{ width: '14px', height: '14px' }} />
                                            </span>
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}