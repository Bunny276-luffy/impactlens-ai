'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Activity, Users, Zap, Shield, BarChart3, Database, ChevronRight, CheckCircle2 } from 'lucide-react';

import { AnimatedText } from '@/components/ui/AnimatedText';
import { Constellation } from '@/components/ui/Constellation';
import { TiltCard } from '@/components/ui/TiltCard';
import { StepCarousel } from '@/components/ui/StepCarousel';
import { ExpandableCards } from '@/components/ui/ExpandableCards';
import { Floating3DGrid } from '@/components/ui/Floating3DGrid';

const FEATURES = [
  {
    icon: <Database className="w-8 h-8 text-cyan" />,
    title: "AI-Powered CRM",
    description: "Centralize your donor database with predictive AI that suggests optimal engagement times and tailored outreach strategies.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: <BarChart3 className="w-8 h-8 text-violet" />,
    title: "Real-Time Impact Analytics",
    description: "Visualize your non-profit's field impact instantly. Generate stunning, data-driven reports for your stakeholders.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: <Users className="w-8 h-8 text-mint" />,
    title: "Smart Volunteer Routing",
    description: "Automatically match volunteers to field tasks based on their skills, location, and past performance metrics.",
    image: "https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80"
  },
  {
    icon: <Shield className="w-8 h-8 text-cyan" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption, Role-Level Security (RLS), and comprehensive audit logs keep your sensitive data locked down.",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80"
  }
];

const STATS = [
  { value: "50M+", label: "Beneficiaries Tracked" },
  { value: "99.9%", label: "Platform Uptime" },
  { value: "12k+", label: "Active Field Workers" },
  { value: "$2B+", label: "Donations Routed" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden font-sans selection:bg-cyan/20 bg-transparent">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 border-b border-white/5 bg-obsidian-deep/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-cyan-violet flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">ImpactLens <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-violet">AI</span></span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="#features" className="hidden md:block text-sm font-medium text-text-secondary hover:text-white transition-colors">
              Features
            </Link>
            <Link href="#platform" className="hidden md:block text-sm font-medium text-text-secondary hover:text-white transition-colors">
              Platform
            </Link>
            <div className="h-4 w-px bg-white/10 hidden md:block"></div>
            <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-obsidian-deep bg-white rounded-full hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent pt-20">
        <Constellation />
        
        <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-cyan animate-pulse"></span>
            <span className="text-xs font-medium text-cyan uppercase tracking-widest">Platform 2.0 Now Live</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tight mb-8">
            Amplify Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-white animate-gradient-x">Impact at Scale.</span>
          </h1>
          
          <div className="max-w-2xl mx-auto mb-10">
            <AnimatedText 
              text="The first AI-native operating system designed exclusively for modern non-profits and visionary NGOs."
              className="text-lg md:text-xl text-text-secondary font-medium leading-relaxed justify-center"
            />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/login" className="group relative inline-flex h-14 overflow-hidden rounded-full p-[2px] focus:outline-none hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(0,242,254,0.3)]">
              <span className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00f2fe_0%,#4facfe_50%,#00f2fe_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-obsidian-deep px-8 font-bold text-white backdrop-blur-3xl gap-2">
                Deploy Infrastructure <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link href="#features" className="inline-flex items-center justify-center px-8 py-4 font-bold text-text-secondary transition-all duration-200 rounded-full hover:text-white">
              Explore Platform
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-20 py-20 border-y border-white/5 bg-obsidian-deep/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x divide-white/5">
            {STATS.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
                className="text-center px-4"
              >
                <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 mb-2">{stat.value}</div>
                <div className="text-sm text-text-muted font-medium uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <StepCarousel />
      
      {/* 3D Spacer Section */}
      <Floating3DGrid />

      {/* Platform Deep Dive Section */}
      <section id="platform" className="relative z-20 py-16 px-6 overflow-hidden bg-transparent">
        <Constellation />
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 relative"
            >
              {/* Decorative Glowing Orb behind text */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-violet-glow blur-[100px] rounded-full opacity-40 animate-pulse pointer-events-none" />
              
              <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/10 border border-violet/20 text-violet text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                <Activity className="w-3.5 h-3.5 animate-pulse" /> Telemetry Engine
              </div>
              <h2 className="relative z-10 text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                Stop guessing. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet via-pink-500 to-cyan animate-gradient-x">Start measuring.</span>
              </h2>
              <p className="relative z-10 text-lg text-text-secondary leading-relaxed">
                ImpactLens AI consumes raw data from field workers, digital forms, and biometrics, instantly transforming it into actionable intelligence. 
              </p>
              
              <ul className="space-y-4 relative z-10">
                {['Real-time biometric tracking', 'Automated anomaly detection', 'Predictive intervention alerts'].map((item, i) => (
                  <motion.li 
                    key={i} 
                    whileHover={{ x: 10, color: "#fff" }}
                    className="flex items-center gap-3 text-text-primary font-medium cursor-default transition-colors"
                  >
                    <CheckCircle2 className="w-5 h-5 text-mint drop-shadow-[0_0_8px_rgba(0,255,170,0.6)]" /> {item}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-end w-full"
            >
              <ExpandableCards />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section id="features" className="relative z-20 py-16 px-6 bg-obsidian-deep/20 backdrop-blur-sm border-t border-white/5">
        <Constellation />
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan to-violet">Mission Critical</span> scale.</h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Everything you need to manage your organization, orchestrate volunteers, and measure impact, built on an enterprise-grade stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1 }}
              >
                <TiltCard className="h-full">
                  <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-60" style={{ backgroundImage: `url(${feature.image})` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-card via-obsidian-card/60 to-transparent" />
                  <div className="p-8 flex flex-col h-full justify-between gap-8 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center shadow-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                      <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-20 py-16 px-6 bg-transparent text-center">
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial-cyan opacity-5" />
          <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold text-white mb-6 relative z-10">Ready to transform your NGO?</h2>
          <p className="text-lg text-text-secondary mb-10 relative z-10 max-w-2xl mx-auto">
            Join the most visionary non-profits using ImpactLens AI to scale their operations and prove their impact to the world.
          </p>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 font-bold text-obsidian-deep bg-cyan rounded-full hover:bg-cyan-light transition-all shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              Get Started for Free
            </Link>
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-obsidian-deep/80 backdrop-blur-md text-text-muted">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-text-secondary" />
              <span className="text-lg font-bold text-white">ImpactLens AI</span>
            </div>
            <p className="max-w-xs text-sm">Empowering the world's non-profits with military-grade intelligence and impact telemetry.</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-cyan transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-cyan transition-colors">Integrations</Link></li>
              <li><Link href="#" className="hover:text-cyan transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-cyan transition-colors">Changelog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="hover:text-cyan transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-cyan transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-cyan transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-cyan transition-colors">Legal</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-xs">
          <p>© {new Date().getFullYear()} ImpactLens AI, Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
