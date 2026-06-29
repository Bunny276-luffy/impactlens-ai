'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from '@/contexts/ToastContext';
import { 
  TrendingUp, 
  Brain, 
  ShieldCheck, 
  Users, 
  ChevronRight, 
  ArrowRight, 
  Check, 
  HelpCircle,
  Activity, 
  FilePieChart,
  Heart,
  Globe,
  Sparkles,
  Award
} from 'lucide-react';

export default function LandingPage() {
  const { toast } = useToast();
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMsg, setContactMsg] = useState('');
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMsg) {
      toast('Please fill out all fields.', { type: 'warning', title: 'Form Incomplete' });
      return;
    }
    toast('Your message has been received! Our NGO coordinator will get back to you shortly.', { 
      type: 'success', 
      title: 'Message Sent Successfully' 
    });
    setContactName('');
    setContactEmail('');
    setContactMsg('');
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-bg-dark text-white flex flex-col scroll-smooth">
      {/* Decorative background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-purple/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-brand-blue/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[40vw] h-[40vw] rounded-full bg-pink-500/5 blur-[150px] pointer-events-none" />

      <Header />

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 text-center flex flex-col items-center">
        {/* Glow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-purple/30 bg-brand-purple/5 text-xs text-brand-purple mb-8 animate-pulse-subtle">
          <Sparkles className="w-3.5 h-3.5" />
          <span>NGO Intelligence Platform v1.2 Release</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight sm:leading-none mb-6">
          Measure, Predict, & Improve <br />
          <span className="text-gradient-purple-blue">Child Growth</span> with Precision AI
        </h1>

        {/* Description */}
        <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed mb-10">
          ImpactLens AI helps NGOs, donors, and volunteers track nutritional levels, analyze academic dropout risks, and distribute resources transparently.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <Link 
            href="/login?role=donor" 
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-95 transition-all text-sm shadow-xl shadow-brand-purple/20"
          >
            Sponsor a Child Now
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/login" 
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all text-sm"
          >
            Explore Dashboard
          </Link>
        </div>

        {/* Interactive mock dashboard visual */}
        <div className="w-full max-w-5xl rounded-2xl border border-white/8 bg-bg-darker/80 p-3 sm:p-5 shadow-2xl relative glow-purple group">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple/5 via-transparent to-brand-blue/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <div className="w-full rounded-xl bg-black/60 border border-white/5 overflow-hidden flex flex-col">
            
            {/* Mock Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-bg-panel/80 border-b border-white/5 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-gray-400">dashboard.impactlens.ai</span>
              </div>
              <div className="flex items-center gap-4">
                <span>Care & Share School Node #12</span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-brand-purple">Active</span>
              </div>
            </div>

            {/* Mock Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4">
              
              {/* Metric Card */}
              <div className="p-4 rounded-xl bg-bg-panel/40 border border-white/5 text-left flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Total Audited</span>
                <span className="text-xl font-bold text-white">8,245 Children</span>
                <span className="text-[9px] text-emerald-400 flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" /> +12.4% enrollment this term
                </span>
              </div>

              {/* Metric Card */}
              <div className="p-4 rounded-xl bg-bg-panel/40 border border-white/5 text-left flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Nutrition Score</span>
                <span className="text-xl font-bold text-gradient-emerald-blue">78.5 / 100</span>
                <span className="text-[9px] text-emerald-400">+4.2% Growth (6 months)</span>
              </div>

              {/* Metric Card */}
              <div className="p-4 rounded-xl bg-bg-panel/40 border border-white/5 text-left flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">Academic Stability</span>
                <span className="text-xl font-bold text-white">92.4% Attendance</span>
                <span className="text-[9px] text-yellow-400">8 children at dropout risk</span>
              </div>

              {/* Metric Card */}
              <div className="p-4 rounded-xl bg-bg-panel/40 border border-white/5 text-left flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 uppercase font-semibold">AI Interventions</span>
                <span className="text-xl font-bold text-brand-purple">24 Dispatched</span>
                <span className="text-[9px] text-purple-400 font-semibold uppercase">Priority 1 Active</span>
              </div>
            </div>

            {/* Mock Charts and Child Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 pt-0 text-left">
              <div className="sm:col-span-2 p-4 rounded-xl bg-bg-panel/40 border border-white/5 flex flex-col gap-2">
                <span className="text-[11px] font-semibold text-gray-300">Growth Tracking Analytics (Recharts simulated)</span>
                
                {/* Simulated Chart visual */}
                <div className="h-40 w-full flex items-end justify-between pt-6 px-4">
                  {[28, 45, 38, 62, 54, 76, 85, 92].map((val, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1.5 w-1/10">
                      <div className="w-full bg-gradient-to-t from-brand-blue/30 to-brand-purple/80 rounded-t-sm transition-all duration-500 hover:opacity-90" style={{ height: `${val}%` }}>
                        <div className="w-full h-1 bg-purple-400" />
                      </div>
                      <span className="text-[8px] text-gray-500">M{idx+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Notification / Risk alerts */}
              <div className="p-4 rounded-xl bg-bg-panel/40 border border-white/5 flex flex-col gap-3">
                <span className="text-[11px] font-semibold text-gray-300">Active Health Alerts</span>
                
                <div className="flex flex-col gap-2">
                  <div className="p-2.5 rounded-lg bg-red-950/20 border border-red-500/20 flex gap-2 items-start">
                    <Activity className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="text-[10px] font-bold text-red-200">Critical: Malnutrition</h5>
                      <p className="text-[9px] text-red-400">Vikram Singh (Age 7) BMI standard limit crossed</p>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-yellow-950/20 border border-yellow-500/20 flex gap-2 items-start">
                    <TrendingUp className="w-4 h-4 text-yellow-400 mt-0.5 shrink-0" />
                    <div>
                      <h5 className="text-[10px] font-bold text-yellow-200">Medium: Dropout Risk</h5>
                      <p className="text-[9px] text-yellow-400">Ananya Das (Age 11) Attendance dropped below 74%</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* STATISTICS STRIP */}
      <section className="bg-bg-darker border-y border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-extrabold text-white mb-2">12,500+</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Underprivileged Children Assisted</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-brand-purple mb-2">180+</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Partner NGOs Nationwide</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-brand-blue mb-2">94.8%</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Retention & Attendance Rates</p>
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-emerald-400 mb-2">4.5x</h3>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Nutritional Growth Acceleration</p>
          </div>
        </div>
      </section>

      {/* THEME FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features for Modern Philanthropy</h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Our platform provides structural support to all four cornerstones of child welfare operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4 text-left">
            <div className="h-10 w-10 rounded-lg bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20 text-brand-purple">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Full Child CRUD Management</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Maintain dynamic digital records of names, guardian profiles, physical growth stats (height, weight), schools and attendance.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4 text-left">
            <div className="h-10 w-10 rounded-lg bg-brand-blue/10 flex items-center justify-center border border-brand-blue/20 text-brand-blue">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">AI Predictions & Intervention</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Generate AI Risk Scores, malnutrition curves, and dropout probabilities. Provide priority intervention suggestions automatically.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4 text-left">
            <div className="h-10 w-10 rounded-lg bg-pink-500/10 flex items-center justify-center border border-pink-500/20 text-pink-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Transparent Donor Portal</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Donors can sponsor individual children, track exactly where funds are deployed (Food, Books, Medical), and download reports.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4 text-left">
            <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Verified Volunteer Audits</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Enable volunteer workers to assign weekly field tasks, record biometrics, upload photos, and verify academic registries.
            </p>
          </div>

          {/* Card 5 */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4 text-left">
            <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20 text-yellow-400">
              <FilePieChart className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Production PDF Reports</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Export high-fidelity summary documents for child growth tracking, NGO resource usage, and donation impact history.
            </p>
          </div>

          {/* Card 6 */}
          <div className="p-6 rounded-2xl glass-card flex flex-col gap-4 text-left">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Real-time Risk Alerts</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Instant email mock logs, achievement badges, and critical health risk notifications pushed to coordinators instantly.
            </p>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-bg-darker py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How ImpactLens AI Operates</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Our structured flow guarantees real-time updates from field operations directly to donor analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-purple font-bold flex items-center justify-center text-lg">
                1
              </div>
              <h3 className="text-base font-semibold">Child Onboarding</h3>
              <p className="text-xs text-gray-400 max-w-xs">
                NGO partners enroll underprivileged children, recording school details and basic metrics.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-brand-blue/20 border border-brand-blue/40 text-brand-blue font-bold flex items-center justify-center text-lg">
                2
              </div>
              <h3 className="text-base font-semibold">Volunteer Auditing</h3>
              <p className="text-xs text-gray-400 max-w-xs">
                Volunteers conduct field checks, measuring height, weight, and school attendance monthly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-lg">
                3
              </div>
              <h3 className="text-base font-semibold">AI Risk Diagnosis</h3>
              <p className="text-xs text-gray-400 max-w-xs">
                ImpactLens engine analyzes indicators to flag malnutrition scores, dropout risks, and suggest interventions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="h-12 w-12 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 font-bold flex items-center justify-center text-lg">
                4
              </div>
              <h3 className="text-base font-semibold">Targeted Funding</h3>
              <p className="text-xs text-gray-400 max-w-xs">
                Donors supply targeted funds (Food, Books) directly mapped to children in high priority rankings.
              </p>
            </div>

            {/* Connected background lines for desktop */}
            <div className="absolute top-6 left-1/8 right-1/8 h-0.5 bg-gradient-to-r from-brand-purple/20 via-brand-blue/20 to-pink-500/20 hidden md:block z-0" />
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Loved by NGOs & Donors Worldwide</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl glass-panel text-left flex flex-col gap-4">
            <p className="text-xs text-gray-300 italic leading-relaxed">
              "We managed to lower school dropout rates by 40% in our Lajpat Nagar center within 4 months of adopting ImpactLens AI. The predictive reports highlight exactly who needs family counseling."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-purple flex items-center justify-center text-xs font-bold text-white">
                MD
              </div>
              <div>
                <h4 className="text-xs font-bold">Meera Deshmukh</h4>
                <p className="text-[10px] text-gray-500">Director, Care & Share India</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel text-left flex flex-col gap-4">
            <p className="text-xs text-gray-300 italic leading-relaxed">
              "Donating to social causes was always a black box. With ImpactLens, I sponsored Amit and Sneha, and I receive bi-monthly volunteer records showing their height increase and final school attendance report."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-xs font-bold text-white">
                AK
              </div>
              <div>
                <h4 className="text-xs font-bold">Anish Kapoor</h4>
                <p className="text-[10px] text-gray-500">Tech Lead & Global Philanthropist</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl glass-panel text-left flex flex-col gap-4">
            <p className="text-xs text-gray-300 italic leading-relaxed">
              "Inputting metrics in the field used to take hours of paperwork. The volunteer app portal is incredibly simple. I can record 20 children's height, weight and school attendance in 10 minutes."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                SJ
              </div>
              <div>
                <h4 className="text-xs font-bold">Sarah Jenkins</h4>
                <p className="text-[10px] text-gray-500">Field Volunteer Coordinator</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-bg-darker py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">Flexible Hosting Packages</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">
              Choose the deployment tier that suits your NGO operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            
            {/* Tier 1 */}
            <div className="p-8 rounded-2xl glass-card flex flex-col gap-6 text-left relative">
              <div>
                <h3 className="text-lg font-bold">Community</h3>
                <p className="text-xs text-gray-500 mt-1">For single localized centers.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">$0</span>
                <span className="text-xs text-gray-500">/ forever</span>
              </div>
              <hr className="border-white/5" />
              <ul className="flex flex-col gap-3 text-xs text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Up to 50 Children Profiles</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 1 NGO Coordinator Account</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Basic AI Predictions</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Online Donor Logs</li>
              </ul>
              <Link 
                href="/login" 
                className="w-full text-center py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold mt-auto transition-all"
              >
                Get Started
              </Link>
            </div>

            {/* Tier 2 */}
            <div className="p-8 rounded-2xl glass-card flex flex-col gap-6 text-left relative border-brand-purple/40 glow-purple">
              <div className="absolute top-3 right-4 px-2 py-0.5 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-[9px] text-brand-purple font-bold">
                Most Popular
              </div>
              <div>
                <h3 className="text-lg font-bold">Impact Growth</h3>
                <p className="text-xs text-gray-500 mt-1">For growing multi-regional NGOs.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">$49</span>
                <span className="text-xs text-gray-500">/ month</span>
              </div>
              <hr className="border-white/5" />
              <ul className="flex flex-col gap-3 text-xs text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Unlimited Children Profiles</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 10 NGO & Volunteer Accounts</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full AI Predictive Engine</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> High-fidelity PDF Exports</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Direct Email Alert Integrations</li>
              </ul>
              <Link 
                href="/login" 
                className="w-full text-center py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue text-white text-xs font-semibold mt-auto transition-all shadow-md shadow-brand-purple/20"
              >
                Deploy Professional
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="p-8 rounded-2xl glass-card flex flex-col gap-6 text-left relative">
              <div>
                <h3 className="text-lg font-bold">Enterprise</h3>
                <p className="text-xs text-gray-500 mt-1">For national developmental agencies.</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold">Custom</span>
                <span className="text-xs text-gray-500">/ query</span>
              </div>
              <hr className="border-white/5" />
              <ul className="flex flex-col gap-3 text-xs text-gray-400">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Dedicated AWS Aurora Cluster</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Custom Machine Learning Models</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> 24/7 Priority SLA Support</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Full Audit Logs & Whitelabeling</li>
              </ul>
              <a 
                href="#contact" 
                className="w-full text-center py-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold mt-auto transition-all"
              >
                Contact Sales
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        </div>

        <div className="flex flex-col gap-4">
          {[
            {
              q: "Can I connect my own AWS Aurora PostgreSQL cluster?",
              a: "Yes. The platform is designed with Prisma ORM. By default, it runs in a local mock configuration. To connect to an active Amazon Aurora PostgreSQL cluster, you simply append your DATABASE_URL to the environment configurations."
            },
            {
              q: "How does the AI predict Dropout Risk?",
              a: "Our prediction model uses longitudinal attendance rates and physical nutrition metrics. If a child's attendance rate falls below 80% or fluctuates heavily alongside nutritional drops, the system triggers an alert ranking the child as Priority 1 or 2 for home counseling visits."
            },
            {
              q: "Is there any mobile layout for field volunteers?",
              a: "Absolutely. The ImpactLens platform is fully responsive. Volunteers can access the volunteer portal from any mobile web browser to log height, weight, and check school registries on the go."
            },
            {
              q: "How can donors verify where their donations go?",
              a: "Every donation is registered with a specific target allocation (Food, Books, Health, or general NGO operations) and optionally tied to sponsored children. Progress metrics logged by volunteers are visible on the donor's impact timeline."
            }
          ].map((item, idx) => (
            <div key={idx} className="border border-white/8 bg-bg-panel/20 rounded-xl overflow-hidden">
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 flex items-center justify-between text-left font-semibold text-sm hover:bg-white/3 transition-colors text-white"
              >
                <span>{item.q}</span>
                <HelpCircle className={`w-4 h-4 text-brand-purple transition-transform ${faqOpen === idx ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen === idx && (
                <div className="px-6 pb-4 pt-2 text-xs text-gray-400 leading-relaxed border-t border-white/5 bg-black/10">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="bg-bg-darker border-t border-white/5 py-24 px-6">
        <div className="max-w-xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Partner with ImpactLens AI</h2>
            <p className="text-gray-400 text-sm">
              Are you an NGO seeking deployment help, or a foundation wishing to run a pilot? Fill in the details.
            </p>
          </div>

          <form onSubmit={handleContactSubmit} className="glass-panel p-8 rounded-2xl flex flex-col gap-4 text-left border border-white/8">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Full Name</label>
              <input 
                type="text" 
                placeholder="Aarav Sharma"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="glass-input px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</label>
              <input 
                type="email" 
                placeholder="aarav@ngoalliance.org"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="glass-input px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Message Description</label>
              <textarea 
                rows={4}
                placeholder="We would love to set up an ImpactLens deployment for our 3 child development centers in Pune..."
                value={contactMsg}
                onChange={(e) => setContactMsg(e.target.value)}
                className="glass-input px-4 py-2.5 text-xs text-white resize-none"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3 rounded-lg bg-gradient-to-r from-brand-purple to-brand-blue font-bold text-xs text-white hover:opacity-95 transition-all shadow-lg shadow-brand-purple/10 flex items-center justify-center gap-1.5 mt-2"
            >
              Submit Inquiry
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
