"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PricingTable,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { MailIcon, CalendarIcon, BrainCircuitIcon, SparklesIcon, ArrowRightIcon, ShieldCheckIcon, ZapIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Framer Motion Variants
const staggerContainer: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUpVariant: any = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } },
};

const scaleUpVariant: any = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50, damping: 15 } },
};

const floatingOrbVariant = (duration: number, delay: number): any => ({
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    scale: [1, 1.05, 1],
    transition: {
      duration: duration,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay,
    },
  },
});

export default function Home() {
  return (
    <div className="landing-wrapper overflow-hidden relative">
      {/* Floating Orbs using Framer Motion */}
      <div className="orb-container absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          className="orb orb-1 absolute w-[40vw] h-[40vw] rounded-full blur-[100px] opacity-30" 
          style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.4) 0%, rgba(0,0,0,0) 70%)', top: '-10%', left: '-10%' }}
          variants={floatingOrbVariant(12, 0)}
          animate="animate"
        />
        <motion.div 
          className="orb orb-2 absolute w-[35vw] h-[35vw] rounded-full blur-[100px] opacity-20" 
          style={{ background: 'radial-gradient(circle, rgba(123,97,255,0.4) 0%, rgba(0,0,0,0) 70%)', bottom: '-10%', right: '-10%' }}
          variants={floatingOrbVariant(15, 2)}
          animate="animate"
        />
        <motion.div 
          className="orb orb-3 absolute w-[25vw] h-[25vw] rounded-full blur-[80px] opacity-20" 
          style={{ background: 'radial-gradient(circle, rgba(255,217,61,0.3) 0%, rgba(0,0,0,0) 70%)', top: '40%', left: '50%' }}
          variants={floatingOrbVariant(10, 1)}
          animate="animate"
        />
      </div>

      {/* Noise Texture */}
      <div className="noise-overlay absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%22")' }} />

      {/* Header */}
      <motion.header 
        className="landing-header relative z-10 border-b border-white/5 bg-background/50 backdrop-blur-md"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="landing-header-inner max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="logo-container flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #00d4aa, #7b61ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <SparklesIcon style={{ width: '16px', height: '16px', color: '#000' }} />
              </div>
              <span className="logo-text font-bold text-lg text-foreground tracking-tight">IownOS</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Show when="signed-in">
              <div className="nav-actions flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="ghost" style={{ color: '#b0b0b5' }}>Dashboard</Button>
                </Link>
                <UserButton />
              </div>
            </Show>
            <Show when="signed-out">
              <div className="nav-actions flex items-center gap-4">
                <SignInButton />
                <SignUpButton />
              </div>
            </Show>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="section-heading relative z-10" style={{ paddingTop: '8rem', paddingBottom: '6rem' }}>
        <motion.div 
          className="text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {/* Tag */}
          <motion.div variants={fadeUpVariant} style={{ marginBottom: '2rem' }}>
            <span className="greeting-pill inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-foreground/80">
              <span className="dot w-2 h-2 rounded-full bg-[#00d4aa] shadow-[0_0_8px_rgba(0,212,170,0.6)]" />
              AI-Powered Productivity
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={fadeUpVariant}
            className="gradient-text font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/40" 
            style={{
              fontSize: 'clamp(3rem, 8vw, 6rem)',
              lineHeight: 1.05,
              maxWidth: '900px',
              margin: '0 auto 1.5rem',
            }}
          >
            Your Inbox.<br />
            Managed by AI.
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            variants={fadeUpVariant}
            className="hero-description text-lg md:text-xl text-muted-foreground mx-auto" 
            style={{ maxWidth: '560px', marginBottom: '3rem', lineHeight: 1.6 }}
          >
            IownOS reads your emails, extracts tasks, drafts replies, and
            manages your calendar — all autonomously.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={fadeUpVariant} className="hero-buttons flex justify-center gap-4">
            <Link href="/sign-up">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="glow-button bg-[#00d4aa] text-black hover:bg-[#00d4aa]/90 border-0" style={{
                  padding: '14px 32px',
                  fontSize: '15px',
                  borderRadius: '14px',
                  boxShadow: '0 8px 30px rgba(0,212,170,0.3)',
                }}>
                  <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                    Get Started Free
                    <ArrowRightIcon style={{ width: '16px', height: '16px' }} />
                  </span>
                </Button>
              </motion.div>
            </Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="outline" style={{
                padding: '14px 32px',
                fontSize: '15px',
                borderRadius: '14px',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                color: '#f5f5f7',
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(10px)',
              }}>
                See How It Works
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust badges */}
          <motion.div 
            variants={fadeUpVariant}
            style={{
              marginTop: '4rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '2.5rem',
              flexWrap: 'wrap',
            }}
          >
            {[
              { icon: ShieldCheckIcon, text: "End-to-End Encrypted" },
              { icon: ZapIcon, text: "Gemini 2.5 Flash AI" },
              { icon: CalendarIcon, text: "Calendar Sync" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-4 py-2 rounded-full border border-white/5">
                <item.icon className="w-4 h-4 text-[#00d4aa]" />
                {item.text}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Divider */}
      <div className="section-line h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ maxWidth: '800px', margin: '0 auto' }} />

      {/* How it works */}
      <section className="section-heading relative z-10" style={{ paddingTop: '6rem', paddingBottom: '4rem' }}>
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.span variants={fadeUpVariant} className="hero-subtitle text-[#7b61ff] font-semibold tracking-wide uppercase text-sm mb-4 block">
            How it works
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Three Steps to Freedom
          </motion.h2>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            maxWidth: '1000px',
            margin: '0 auto',
            padding: '0 1.5rem',
          }}
        >
          {[
            { step: "01", title: "Connect Gmail", desc: "Link your Google account with one click. OAuth 2.0 keeps your data secure." },
            { step: "02", title: "AI Analyzes", desc: "Gemini reads each email, extracts tasks, and drafts intelligent replies." },
            { step: "03", title: "You Relax", desc: "Review AI-generated drafts and tasks. Approve or edit — you're always in control." },
          ].map((item, i) => (
            <motion.div 
              key={item.step} 
              variants={scaleUpVariant}
              whileHover={{ y: -5, transition: { type: "spring", stiffness: 300 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div style={{
                padding: '2.5rem 2rem',
                borderRadius: '20px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                textAlign: 'left',
                height: '100%',
                backdropFilter: 'blur(10px)',
              }}>
                <div style={{
                  fontSize: '56px',
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                  marginBottom: '1.5rem',
                  background: 'linear-gradient(135deg, #00d4aa, #7b61ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  opacity: 0.8,
                }}>{item.step}</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#f5f5f7',
                  marginBottom: '0.75rem',
                }}>{item.title}</h3>
                <p style={{ fontSize: '15px', color: '#8a8a93', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="section-heading relative z-10" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.span variants={fadeUpVariant} className="hero-subtitle text-[#00d4aa] font-semibold tracking-wide uppercase text-sm mb-4 block">
            Features
          </motion.span>
          <motion.h2 variants={fadeUpVariant} className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Built for Productivity
          </motion.h2>
        </motion.div>

        <motion.div 
          className="features-grid max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
        >
          {[
            {
              key: "email-management",
              title: "Autonomous Email Management",
              description:
                "AI processes your emails, categorizes them, and drafts intelligent replies automatically.",
              icon: MailIcon,
              gradient: "linear-gradient(135deg, #00d4aa, #00b394)",
              shadow: "rgba(0,212,170,0.2)",
            },
            {
              key: "task-extraction",
              title: "Smart Task Extraction",
              description:
                "Automatically creates tasks from your emails and calendar events. Never miss a to-do.",
              icon: BrainCircuitIcon,
              gradient: "linear-gradient(135deg, #7b61ff, #5b42e0)",
              shadow: "rgba(123,97,255,0.2)",
            },
            {
              key: "calendar-intelligence",
              title: "Calendar Intelligence",
              description:
                "Detects meetings, creates calendar events, and keeps your schedule organized.",
              icon: CalendarIcon,
              gradient: "linear-gradient(135deg, #ffd93d, #ff9500)",
              shadow: "rgba(255,217,61,0.2)",
            },
          ].map((feature) => (
            <motion.div key={feature.key} variants={fadeUpVariant}>
              <motion.div whileHover={{ y: -5 }} className="h-full">
                <Card className="p-8 feature-card h-full bg-white/[0.02] border-white/5 backdrop-blur-xl">
                  <CardHeader className="p-0">
                    <div style={{
                      width: '56px', height: '56px',
                      borderRadius: '16px',
                      background: feature.gradient,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '1.5rem',
                      boxShadow: `0 8px 32px ${feature.shadow}`,
                    }}>
                      <feature.icon style={{ width: '28px', height: '28px', color: '#000' }} />
                    </div>
                    <CardTitle className="text-xl mb-3" style={{ color: '#f5f5f7', letterSpacing: '-0.02em' }}>
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base leading-relaxed" style={{ color: '#8a8a93' }}>
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Pricing */}
      <section className="section-heading relative z-10" id="pricing" style={{ paddingBottom: '6rem' }}>
        <div className="section-line h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" style={{ maxWidth: '800px', margin: '0 auto 4rem' }} />
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="max-w-4xl mx-auto px-6"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-8">Simple, Transparent Pricing</h2>
          <PricingTable />
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="footer-wrapper relative z-10 border-t border-white/5 bg-background/80 backdrop-blur-md mt-10">
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '7px',
              background: 'linear-gradient(135deg, #00d4aa, #7b61ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <SparklesIcon style={{ width: '12px', height: '12px', color: '#000' }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#8a8a93' }}>IownOS</span>
          </div>
          <p style={{ fontSize: '13px', color: '#6e6e73' }}>
            © 2026 IownOS. Built with Next.js, Gemini AI & Drizzle ORM.
          </p>
        </div>
      </footer>
    </div>
  );
}