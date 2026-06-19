import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { InboxIcon, MailOpenIcon } from "lucide-react";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateUser, getAgentRuns, getUserIntegrations } from "@/db/queries";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default async function MailPage() {
    const { userId: clerkId } = await auth();
    if (!clerkId) redirect("/sign-in");

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress ?? "";
    const name = clerkUser?.fullName ?? "";

    const user = await getOrCreateUser(clerkId, email, name);
    const integrations = await getUserIntegrations(user.id);
    const runs = await getAgentRuns(user.id);

    const processedEmails = runs.flatMap((run) => 
        run.actionsLog.map((log) => ({
            ...log,
            runId: run.id,
            processedAt: run.completedAt || run.startedAt
        }))
    );

    return (
        <div className="page-wrapper p-8">
            <div className="mb-8">
                <h1 className="page-title text-3xl font-bold mb-1">Mail</h1>
                <p className="page-description text-muted-foreground">
                    AI-processed emails and draft replies.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inbox</CardTitle>
                    <CardDescription>
                        Your AI-categorized emails and automated drafts.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {processedEmails.length === 0 ? (
                        <div className="empty-state py-8 text-center">
                            <InboxIcon className="empty-state-icon mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                            <p className="empty-state-title font-semibold text-lg">No emails yet</p>
                            <p className="empty-state-text text-muted-foreground text-sm">
                                Connect Gmail in Settings to start processing emails.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {processedEmails.map((mail, idx) => (
                                <div key={`${mail.emailId}-${idx}`} className="border-b pb-6 last:border-0 last:pb-0 space-y-3">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-base">{mail.subject}</span>
                                                <Badge variant="outline">{mail.category}</Badge>
                                                <Badge variant={mail.priority === "high" ? "destructive" : mail.priority === "medium" ? "default" : "secondary"}>
                                                    {mail.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                From: {mail.from} | Date: {new Date(mail.processedAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {mail.status === "success" ? (
                                            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Processed</Badge>
                                        ) : (
                                            <Badge variant="destructive">Failed</Badge>
                                        )}
                                    </div>
                                    
                                    <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground block mb-1">AI Summary:</span>
                                        {mail.summary}
                                    </div>

                                    {mail.draftCreated && mail.draftReply && (
                                        <div className="bg-blue-500/5 border border-blue-500/20 p-4 rounded-lg text-sm">
                                            <span className="font-semibold text-blue-500 block mb-1 flex items-center gap-1.5">
                                                <MailOpenIcon className="h-4 w-4" /> AI Drafted Response:
                                            </span>
                                            <p className="whitespace-pre-wrap text-muted-foreground mt-1 italic">
                                                {mail.draftReply}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
