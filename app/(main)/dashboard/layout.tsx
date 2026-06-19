import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getOrCreateUser } from "@/db/queries";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { HomeIcon, MailIcon, SettingsIcon, SparklesIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, has } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();
  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";
  const name = clerkUser?.fullName ?? "";

  const user = await getOrCreateUser(userId, email, name);

  const isPaidUser = has({ plan: "pro_plan" });

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: HomeIcon,
    },
    {
      label: "Monitoring",
      href: "/dashboard/monitor",
      icon: MailIcon,
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: SettingsIcon,
    },
  ];

  return (
    <div className="layout-wrapper">
      <div className="noise-overlay" />
      <aside className="sidebar-container">
        <div className="sidebar-inner">
          <div className="logo-container" style={{
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
          }}>
            <Link href="/" className="flex items-center gap-2">
              <div style={{
                width: '28px', height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #00d4aa, #7b61ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SparklesIcon style={{ width: '14px', height: '14px', color: '#000' }} />
              </div>
              <span className="logo-text gradient-text-static">IownOS</span>
            </Link>
          </div>
          <nav className="sidebar-nav" style={{ paddingTop: '12px' }}>
            {navItems.map((item) => (
              <Link href={item.href} key={item.href} className="w-full">
                <Button variant="ghost" className="sidebar-nav-button">
                  <item.icon className="sidebar-icon" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
          {!isPaidUser && (
            <div className="sidebar-section">
              <div className="upgrade-card">
                <div className="upgrade-card-header">
                  <ZapIcon style={{ width: '16px', height: '16px' }} />
                  <span className="font-semibold" style={{ fontSize: '13px' }}>Upgrade to Pro</span>
                </div>
                <p className="upgrade-card-text">Unlock autonomous AI agents</p>
                <Button variant="secondary" className="w-full glow-button" asChild style={{
                  padding: '8px',
                  height: 'auto',
                  borderRadius: '10px',
                  fontSize: '12px',
                }}>
                  <Link href="/#pricing">
                    <span style={{ position: 'relative', zIndex: 1 }}>Upgrade Now</span>
                  </Link>
                </Button>
              </div>
            </div>
          )}

          <div className="sidebar-section">
            <div className="user-profile">
              <UserButton />
              {isPaidUser && <Badge style={{
                background: 'rgba(0, 212, 170, 0.1)',
                color: '#00d4aa',
                border: '1px solid rgba(0, 212, 170, 0.2)',
                fontSize: '11px',
                fontWeight: 600,
              }}>Pro</Badge>}
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <div className="main-content-inner">{children}</div>
      </main>
    </div>
  );
}