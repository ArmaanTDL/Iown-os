"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RunAgentButton } from "@/components/agents/run-agent-button";
import { BotIcon, CheckCircle2, MailIcon, CalendarIcon, ZapIcon, ClockIcon, SparklesIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DashboardContentProps {
    greeting: string;
    firstName?: string | null;
    agentReady: boolean;
    gmailConnected: boolean;
    calendarConnected: boolean;
    stats: {
        emailsProcessed: number;
        tasksCreated: number;
        draftsCreated: number;
    };
    latestRun?: {
        summary: string | null;
        status: string;
    } | null;
    lastRunTime: string;
}

const staggerContainer: any = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const fadeUpVariant: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 60, damping: 15 } },
};

const scaleVariant: any = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 60, damping: 15 } },
};

export function DashboardContent({
    greeting,
    firstName,
    agentReady,
    gmailConnected,
    calendarConnected,
    stats,
    latestRun,
    lastRunTime,
}: DashboardContentProps) {
    return (
        <motion.div 
            className="page-wrapper p-8"
            initial="hidden"
            animate="show"
            variants={staggerContainer}
        >
            {/* Greeting Section */}
            <motion.div variants={fadeUpVariant} style={{ marginBottom: '2.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                    <span className="greeting-pill inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-foreground/80">
                        <span className="dot w-2 h-2 rounded-full bg-[#00d4aa] shadow-[0_0_8px_rgba(0,212,170,0.6)]" />
                        Dashboard
                    </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="page-title gradient-text-static" style={{
                            fontSize: 'clamp(1.8rem, 3vw, 2.5rem)',
                            margin: 0,
                            lineHeight: 1.2,
                        }}>
                            {greeting}{firstName ? `, ${firstName}` : ""} 👋
                        </h1>
                        <p className="page-description text-muted-foreground" style={{ marginTop: '0.5rem', fontSize: '15px' }}>
                            Here&apos;s your AI assistant&apos;s latest activity.
                        </p>
                    </div>

                    <div className="flex-shrink-0" style={{ minWidth: '200px' }}>
                        {agentReady ? (
                            <RunAgentButton />
                        ) : (
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full" asChild style={{
                                    borderColor: 'rgba(0, 212, 170, 0.2)',
                                    color: '#00d4aa',
                                    backgroundColor: 'rgba(0, 212, 170, 0.05)',
                                }}>
                                    <Link href="/dashboard/settings">
                                        Connect Gmail to Start
                                        <ArrowRightIcon style={{ width: '14px', height: '14px', marginLeft: '6px' }} />
                                    </Link>
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            <motion.div variants={fadeUpVariant} className="section-line h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

            {/* Stats Grid */}
            <motion.div variants={staggerContainer} className="stats-grid-4 mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        title: "Emails Processed",
                        value: stats.emailsProcessed,
                        subtitle: gmailConnected ? "From last run" : "Connect Gmail to start",
                        icon: MailIcon,
                        color: "#00d4aa",
                    },
                    {
                        title: "Tasks Created",
                        value: stats.tasksCreated,
                        subtitle: "Auto-extracted from emails",
                        icon: CheckCircle2,
                        color: "#7b61ff",
                    },
                    {
                        title: "Drafts Written",
                        value: stats.draftsCreated,
                        subtitle: "AI-generated replies",
                        icon: ZapIcon,
                        color: "#ffd93d",
                    },
                    {
                        title: "Last Run",
                        value: null,
                        subtitle: lastRunTime,
                        icon: ClockIcon,
                        color: "#4ecdc4",
                        badge: latestRun,
                    },
                ].map((stat) => (
                    <motion.div key={stat.title} variants={scaleVariant}>
                        <Card className="stat-card-accent h-full bg-white/[0.02] border-white/5 backdrop-blur-md hover:bg-white/[0.04] transition-colors">
                            <CardHeader className="stat-card-header flex flex-row items-center justify-between pb-2">
                                <CardTitle className="stat-card-title text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                                <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                            </CardHeader>
                            <CardContent>
                                {stat.badge !== undefined ? (
                                    <div className="stat-value" style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                                        {stat.badge ? (
                                            <Badge style={{
                                                background: stat.badge.status === "success"
                                                    ? 'rgba(0, 212, 170, 0.12)'
                                                    : 'rgba(255, 69, 58, 0.12)',
                                                color: stat.badge.status === "success" ? '#00d4aa' : '#ff453a',
                                                border: `1px solid ${stat.badge.status === "success" ? 'rgba(0,212,170,0.2)' : 'rgba(255,69,58,0.2)'}`,
                                                fontWeight: 600,
                                                fontSize: '12px',
                                            }}>
                                                {stat.badge.status}
                                            </Badge>
                                        ) : "—"}
                                    </div>
                                ) : (
                                    <div className="stat-value text-2xl font-bold">{stat.value}</div>
                                )}
                                <p className="stat-card-subtitle text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {/* Two-column layout */}
            <motion.div variants={staggerContainer} className="stats-grid-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Agent Status Card */}
                <motion.div variants={fadeUpVariant}>
                    <Card className="h-full bg-white/[0.02] border-white/5 backdrop-blur-md">
                        <CardHeader>
                            <div className="card-title-with-icon flex items-center gap-3">
                                <div style={{
                                    width: '40px', height: '40px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #00d4aa, #7b61ff)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                    boxShadow: '0 4px 14px rgba(123,97,255,0.2)',
                                }}>
                                    <BotIcon style={{ width: '20px', height: '20px', color: '#000' }} />
                                </div>
                                <div>
                                    <CardTitle style={{ letterSpacing: '-0.02em', fontSize: '18px' }}>AI Agent Status</CardTitle>
                                    <CardDescription style={{ color: '#8a8a93', marginTop: '2px' }}>Your autonomous executive assistant</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="card-content-stack space-y-4">
                            <div className="agent-locked flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5">
                                <div style={{
                                    width: '44px', height: '44px',
                                    borderRadius: '12px',
                                    background: agentReady ? 'rgba(0, 212, 170, 0.1)' : 'rgba(255,255,255,0.03)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0,
                                }}>
                                    {agentReady ? (
                                        <SparklesIcon style={{ width: '22px', height: '22px', color: '#00d4aa' }} />
                                    ) : (
                                        <BotIcon style={{ width: '22px', height: '22px', color: '#6e6e73' }} />
                                    )}
                                </div>
                                <div>
                                    <p style={{ fontSize: '15px', fontWeight: 600, color: agentReady ? '#00d4aa' : '#8a8a93' }}>
                                        {agentReady ? "Agent Ready" : "Agent Idle"}
                                    </p>
                                    <p style={{ fontSize: '13px', color: '#6e6e73', marginTop: '2px' }}>
                                        {agentReady
                                            ? "Click Run Agent Now to process your inbox"
                                            : "Connect Gmail in Settings to activate"}
                                    </p>
                                </div>
                            </div>

                            <div className="card-content-stack-sm space-y-3 pt-2">
                                <div className="status-row flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                    <span className="status-label text-muted-foreground">Gmail</span>
                                    <span style={{
                                        fontSize: '13px', fontWeight: 500,
                                        color: gmailConnected ? '#00d4aa' : '#8a8a93',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                    }}>
                                        {gmailConnected && <CheckCircle2 style={{ width: '14px', height: '14px' }} />}
                                        {gmailConnected ? "Connected" : "Not connected"}
                                    </span>
                                </div>
                                <div className="status-row flex justify-between items-center text-sm border-b border-white/5 pb-2">
                                    <span className="status-label text-muted-foreground">Google Calendar</span>
                                    <span style={{
                                        fontSize: '13px', fontWeight: 500,
                                        color: calendarConnected ? '#00d4aa' : '#8a8a93',
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                    }}>
                                        {calendarConnected && <CheckCircle2 style={{ width: '14px', height: '14px' }} />}
                                        {calendarConnected ? "Connected" : "Not connected"}
                                    </span>
                                </div>
                                <div className="status-row flex justify-between items-center text-sm">
                                    <span className="status-label text-muted-foreground">Last Run</span>
                                    <span style={{ fontSize: '12px', color: '#8a8a93', maxWidth: '160px', textAlign: 'right' }}>
                                        {latestRun?.summary ?? "No runs yet"}
                                    </span>
                                </div>
                            </div>

                            <div style={{ paddingTop: '0.5rem' }}>
                                {agentReady ? (
                                    <RunAgentButton />
                                ) : (
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button variant="outline" className="w-full" asChild style={{
                                            borderColor: 'rgba(255, 255, 255, 0.1)',
                                            color: '#f5f5f7',
                                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                        }}>
                                            <Link href="/dashboard/settings">→ Go to Settings</Link>
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Quick Setup */}
                <motion.div variants={fadeUpVariant}>
                    <Card className="h-full bg-white/[0.02] border-white/5 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle style={{ letterSpacing: '-0.02em', fontSize: '18px' }}>Quick Setup</CardTitle>
                            <CardDescription style={{ color: '#8a8a93' }}>Get started in 3 easy steps</CardDescription>
                        </CardHeader>
                        <CardContent className="card-content-stack space-y-4">
                            {[
                                { label: "Create your account", done: true },
                                { label: "Connect Gmail integration", done: gmailConnected },
                                { label: "Connect Google Calendar", done: calendarConnected },
                            ].map((step, i) => (
                                <motion.div 
                                    key={i} 
                                    className="onboarding-step flex items-center gap-3 p-3 rounded-xl"
                                    whileHover={{ x: 5, backgroundColor: 'rgba(255,255,255,0.03)' }}
                                    style={{
                                        border: step.done ? '1px solid transparent' : '1px solid rgba(255,255,255,0.05)',
                                        backgroundColor: step.done ? 'transparent' : 'rgba(0,0,0,0.2)'
                                    }}
                                >
                                    <div style={{
                                        width: '32px', height: '32px',
                                        borderRadius: '10px',
                                        background: step.done
                                            ? 'linear-gradient(135deg, #00d4aa, #00b394)'
                                            : 'rgba(255,255,255,0.05)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                        boxShadow: step.done ? '0 4px 12px rgba(0,212,170,0.2)' : 'none',
                                    }}>
                                        {step.done ? (
                                            <CheckCircle2 style={{ width: '16px', height: '16px', color: '#000' }} />
                                        ) : (
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#6e6e73' }}>{i + 1}</span>
                                        )}
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: step.done ? '#6e6e73' : '#f5f5f7',
                                        textDecoration: step.done ? 'line-through' : 'none',
                                    }}>
                                        {step.label}
                                    </span>
                                </motion.div>
                            ))}

                            {!gmailConnected && (
                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                    <Button className="w-full bg-[#00d4aa] text-black hover:bg-[#00d4aa]/90" asChild style={{
                                        marginTop: '1rem',
                                        borderRadius: '12px',
                                        boxShadow: '0 8px 24px rgba(0,212,170,0.25)',
                                    }}>
                                        <Link href="/dashboard/settings">
                                            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                                                Connect Integrations
                                                <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
                                            </span>
                                        </Link>
                                    </Button>
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
