/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ApaarLogo } from '../components/common/ApaarLogo';
import { SecurityBadge } from '../components/common/SecurityBadge';
import { Button } from '../components/common/Button';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  Fingerprint,
  Lock,
  Layers,
  Network,
  QrCode,
  FileCheck,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  Activity,
  Database,
  Search,
  Check,
  EyeOff,
  UserCheck,
  HelpCircle,
  FileSpreadsheet,
  Globe,
  Award,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldAlert,
  GraduationCap,
  Brain,
  Users,
} from 'lucide-react';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  // Navigation active tab
  const [activeNav, setActiveNav] = useState<'home' | 'about' | 'features' | 'how-it-works' | 'institutions' | 'contact'>('home');

  // Interactive Live Hero Sandbox active tab
  const [activeHeroTab, setActiveHeroTab] = useState<'IMPOSSIBILITY' | 'CREDENTIAL' | 'LEAK_TRACER' | 'AUDIT'>('IMPOSSIBILITY');

  // Interactive Contact modal state
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const scrollToSection = (sectionId: string, navKey: 'home' | 'about' | 'features' | 'how-it-works' | 'institutions' | 'contact') => {
    setActiveNav(navKey);
    if (sectionId === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="min-h-screen bg-[#F4F8FC] text-[#17324F] flex flex-col font-sans selection:bg-[#EAF4FF] selection:text-[#1673D1]"
      style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
    >
      {/* ========================================================================= */}
      {/* TOP NAVIGATION BAR — Pure White Institutional Theme Matching image.png   */}
      {/* ========================================================================= */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#DCE7F2] sticky top-0 z-40 transition-shadow duration-200 shadow-xs">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 h-18 flex items-center justify-between gap-4">
          {/* Brand Wordmark & New Official Insignia */}
          <div
            onClick={() => scrollToSection('top', 'home')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <ApaarLogo variant="dark" size="md" withSubtitle={true} />
          </div>

          {/* Navigation Links — Restored & Prominent in Calibri typography */}
          <nav className="hidden md:flex items-center gap-7 text-[14.5px] font-medium text-[#40566E]">
            <button
              onClick={() => scrollToSection('top', 'home')}
              className={`relative py-1 transition-colors hover:text-[#1673D1] cursor-pointer ${
                activeNav === 'home' ? 'text-[#1673D1] font-semibold' : ''
              }`}
            >
              <span>Home</span>
              {activeNav === 'home' && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2.5px] bg-[#1673D1] rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('about-section', 'about')}
              className={`relative py-1 transition-colors hover:text-[#1673D1] cursor-pointer ${
                activeNav === 'about' ? 'text-[#1673D1] font-semibold' : ''
              }`}
            >
              <span>About</span>
              {activeNav === 'about' && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2.5px] bg-[#1673D1] rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('features-section', 'features')}
              className={`relative py-1 transition-colors hover:text-[#1673D1] cursor-pointer ${
                activeNav === 'features' ? 'text-[#1673D1] font-semibold' : ''
              }`}
            >
              <span>Features</span>
              {activeNav === 'features' && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2.5px] bg-[#1673D1] rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('how-it-works-section', 'how-it-works')}
              className={`relative py-1 transition-colors hover:text-[#1673D1] cursor-pointer ${
                activeNav === 'how-it-works' ? 'text-[#1673D1] font-semibold' : ''
              }`}
            >
              <span>How It Works</span>
              {activeNav === 'how-it-works' && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2.5px] bg-[#1673D1] rounded-full" />
              )}
            </button>

            <button
              onClick={() => scrollToSection('institutions-section', 'institutions')}
              className={`relative py-1 transition-colors hover:text-[#1673D1] cursor-pointer ${
                activeNav === 'institutions' ? 'text-[#1673D1] font-semibold' : ''
              }`}
            >
              <span>Institutions</span>
              {activeNav === 'institutions' && (
                <span className="absolute bottom-[-18px] left-0 right-0 h-[2.5px] bg-[#1673D1] rounded-full" />
              )}
            </button>

            <button
              onClick={() => setShowContactModal(true)}
              className={`relative py-1 transition-colors hover:text-[#1673D1] cursor-pointer ${
                activeNav === 'contact' ? 'text-[#1673D1] font-semibold' : ''
              }`}
            >
              <span>Contact</span>
            </button>
          </nav>

          {/* Action Buttons: New Institute Registration (Prominent) & Login */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Prominent Register Institution Button (Requested by User) */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/institution/register')}
            >
              Register Institution
            </Button>

            {/* Login Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* HERO SECTION — Matching image.png layout, typography, and visual assets   */}
      {/* ========================================================================= */}
      <section className="relative pt-10 pb-16 px-5 lg:px-8 max-w-[1400px] mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column (7 cols): Heading, SIH Badge, Copy, CTAs, Trust Points */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Official SIH 2026 Badge (4px rounded, non-pill) */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EAF4FF] border border-[#C5DCFA] rounded-[4px] text-[12.5px] font-semibold text-[#1673D1]">
              <Award className="w-4 h-4 text-[#1673D1]" />
              <span>Smart India Hackathon 2026</span>
              <span className="text-[#C5DCFA]">|</span>
              <span className="font-medium text-[#40566E]">Problem Statement ID: 26263</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-[46px] lg:text-[50px] font-bold text-[#17324F] tracking-tight leading-[1.12]">
              Secure Student Records. <br />
              <span className="text-[#1673D1]">For a Stronger Tomorrow.</span>
            </h1>

            {/* Core Context Paragraph */}
            <p className="text-[15.5px] sm:text-[16.5px] text-[#40566E] max-w-xl leading-relaxed">
              True-Trace is an integrity-first student data management and verification platform for AICTE-approved institutions to manage, verify, and protect student records with transparent auditing and anomaly detection.
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-0 mb-[15px]">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />}
                iconPosition="right"
                onClick={() => navigate('/institution/register')}
                className="group"
              >
                Register Institution
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/login')}
              >
                Login to Portal
              </Button>
            </div>

            {/* 4 Trust Strip Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#DCE7F2]">
              <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#40566E]">
                <div className="w-7 h-7 rounded-md bg-[#EAF4FF] flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-[#1673D1]" />
                </div>
                <span>AICTE Approved Institutions</span>
              </div>

              <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#40566E]">
                <div className="w-7 h-7 rounded-md bg-[#EAF4FF] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-[#1673D1]" />
                </div>
                <span>Tamper-Proof Audit Trail</span>
              </div>

              <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#40566E]">
                <div className="w-7 h-7 rounded-md bg-[#EAF4FF] flex items-center justify-center shrink-0">
                  <Network className="w-4 h-4 text-[#1673D1]" />
                </div>
                <span>Leak Tracing & Honeytokens</span>
              </div>

              <div className="flex items-center gap-2 text-[12.5px] font-medium text-[#40566E]">
                <div className="w-7 h-7 rounded-md bg-[#EAF4FF] flex items-center justify-center shrink-0">
                  <Fingerprint className="w-4 h-4 text-[#1673D1]" />
                </div>
                <span>Privacy-Preserving Verification</span>
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): Visual Composition with Student, Campus & Floating Badges */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Background Radial Light Glow */}
            <div className="absolute w-[440px] h-[440px] bg-gradient-to-tr from-[#C5DCFA]/60 via-[#EAF4FF] to-white rounded-full -z-10 blur-xl opacity-90" />

            {/* Container for Student Visual & Verification Badges */}
            <div className="relative w-full max-w-[480px] bg-gradient-to-b from-[#EBF4FD] to-[#D8E9FA] rounded-3xl p-5 pt-8 pb-4 border border-[#CDE0F5] shadow-sm overflow-hidden">
              
              {/* Subtle Map of India Geo Contour Lines */}
              <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
                <svg width="340" height="340" viewBox="0 0 100 100" fill="none" stroke="#1673D1" strokeWidth="0.5">
                  <circle cx="50" cy="50" r="45" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="32" strokeDasharray="2 2" />
                  <path d="M 50,15 L 53,25 L 65,30 L 70,45 L 65,60 L 52,80 L 48,80 L 35,60 L 30,45 L 35,30 L 47,25 Z" />
                </svg>
              </div>

              {/* Institution Building Stamp in Background */}
              <div className="absolute top-4 right-5 bg-white/90 backdrop-blur-xs border border-[#CDE0F5] px-3 py-1.5 rounded-lg text-right shadow-2xs">
                <div className="text-[11px] font-bold text-[#17324F] tracking-tight">AICTE</div>
                <div className="text-[9.5px] font-semibold text-[#1673D1]">Approved Institution</div>
              </div>

              {/* Student Portrait Illustration Representation */}
              <div className="relative flex justify-center items-end pt-6 pb-2">
                <div className="relative z-10 text-center">
                  {/* Clean SVG Artwork representing the student with backpack & tablet */}
                  <svg
                    width="280"
                    height="320"
                    viewBox="0 0 280 320"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="drop-shadow-md mx-auto"
                  >
                    <defs>
                      <linearGradient id="skinGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#E2A676" />
                        <stop offset="100%" stopColor="#C88554" />
                      </linearGradient>
                      <linearGradient id="hairGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2D1F1A" />
                        <stop offset="100%" stopColor="#171210" />
                      </linearGradient>
                      <linearGradient id="shirtGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#5CA6F8" />
                        <stop offset="100%" stopColor="#257CE0" />
                      </linearGradient>
                      <linearGradient id="bagGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#1E293B" />
                        <stop offset="100%" stopColor="#0F172A" />
                      </linearGradient>
                    </defs>

                    {/* Backpack Strap */}
                    <path d="M 60,160 Q 55,240 85,310" stroke="url(#bagGrad)" strokeWidth="18" strokeLinecap="round" />
                    <path d="M 220,160 Q 225,240 195,310" stroke="url(#bagGrad)" strokeWidth="18" strokeLinecap="round" />

                    {/* Long Hair Back */}
                    <path d="M 85,90 Q 70,160 80,240 Q 140,260 200,240 Q 210,160 195,90 Z" fill="url(#hairGrad)" />

                    {/* Shoulders / Blue Shirt */}
                    <path d="M 50,320 C 50,250 85,210 140,210 C 195,210 230,250 230,320 Z" fill="url(#shirtGrad)" />
                    {/* Collar */}
                    <path d="M 120,210 Q 140,230 160,210" stroke="#FFFFFF" strokeWidth="3" fill="none" />

                    {/* Neck */}
                    <rect x="124" y="165" width="32" height="48" rx="8" fill="url(#skinGrad)" />

                    {/* Head / Face */}
                    <ellipse cx="140" cy="130" rx="42" ry="48" fill="url(#skinGrad)" />

                    {/* Hair Waves Front */}
                    <path d="M 98,125 C 98,75 140,65 140,65 C 140,65 182,75 182,125 C 185,150 178,175 178,175 C 178,175 168,105 140,105 C 112,105 102,175 102,175 C 102,175 95,150 98,125 Z" fill="url(#hairGrad)" />

                    {/* Facial Features */}
                    {/* Eyebrows */}
                    <path d="M 115,115 Q 125,112 133,115" stroke="#171210" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M 147,115 Q 155,112 165,115" stroke="#171210" strokeWidth="2.2" strokeLinecap="round" />
                    {/* Eyes */}
                    <circle cx="125" cy="122" r="3" fill="#171210" />
                    <circle cx="155" cy="122" r="3" fill="#171210" />
                    {/* Nose */}
                    <path d="M 140,122 L 138,135 L 143,136" stroke="#9E5D32" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                    {/* Confident Smile */}
                    <path d="M 128,146 Q 140,155 152,146" stroke="#873E23" strokeWidth="2.2" strokeLinecap="round" fill="#FFFFFF" />

                    {/* Digital Tablet / Book Held in Front */}
                    <rect x="135" y="220" width="105" height="95" rx="10" transform="rotate(-12 135 220)" fill="#1E293B" stroke="#475569" strokeWidth="2" />
                    <rect x="142" y="228" width="90" height="78" rx="6" transform="rotate(-12 142 228)" fill="#0F172A" />
                    <path d="M 152,246 L 210,234" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 156,262 L 200,253" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="160" cy="285" r="4" fill="#10B981" />
                    <path d="M 172,282 L 215,273" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Floating Verification Badge 1: APAAR ID (Top-Left) */}
              <div className="absolute top-8 left-3 bg-white/95 backdrop-blur-md border border-[#DCE7F2] rounded-xl p-2.5 px-3 shadow-md z-20 flex items-center gap-2.5 max-w-[200px] animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#1673D1] shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#71849A]">APAAR ID</div>
                  <div className="text-[12px] font-mono font-bold text-[#17324F]">1234 5678 9012</div>
                  <div className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-[#16845B] mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>

              {/* Floating Verification Badge 2: Data Protected (Top-Right) */}
              <div className="absolute top-18 right-2 bg-white/95 backdrop-blur-md border border-[#DCE7F2] rounded-xl p-2.5 px-3 shadow-md z-20 flex items-center gap-2 max-w-[190px]">
                <div className="w-7 h-7 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#1673D1] shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-bold text-[#17324F] leading-tight">Data Protected</div>
                  <div className="text-[10px] text-[#40566E] leading-tight">End-to-end security & encryption</div>
                </div>
                <Lock className="w-3.5 h-3.5 text-[#71849A] shrink-0 ml-auto" />
              </div>

              {/* Floating Verification Badge 3: No Personal Data (Middle-Right) */}
              <div className="absolute top-36 right-2 bg-white/95 backdrop-blur-md border border-[#DCE7F2] rounded-xl p-2.5 px-3 shadow-md z-20 flex items-center gap-2 max-w-[190px]">
                <div className="w-7 h-7 rounded-full bg-[#EAF4FF] flex items-center justify-center text-[#1673D1] shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-[#1673D1]" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11.5px] font-bold text-[#17324F] leading-tight">No Personal Data</div>
                  <div className="text-[10px] text-[#40566E] leading-tight">Zero-PII verification (credential based)</div>
                </div>
                <EyeOff className="w-3.5 h-3.5 text-[#71849A] shrink-0 ml-auto" />
              </div>

              {/* Floating Verification Badge 4: Interactive QR Card (Bottom-Right) */}
              <div
                onClick={() => navigate('/verify')}
                className="absolute bottom-5 right-3 bg-white border border-[#DCE7F2] rounded-xl p-2.5 px-3 shadow-md z-20 flex items-center gap-3 cursor-pointer hover:border-[#1673D1] hover:shadow-lg transition-all"
                title="Click to launch interactive Public QR Verifier"
              >
                {/* QR Code Graphic */}
                <div className="w-9 h-9 bg-white border border-[#DCE7F2] rounded p-0.5 shrink-0 flex items-center justify-center">
                  <QrCode className="w-7 h-7 text-[#17324F]" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#1673D1]">
                    <CheckCircle2 className="w-3 h-3 text-[#1673D1]" />
                    <span>Verify</span>
                  </div>
                  <div className="text-[9.5px] text-[#40566E]">Scan · Check · Trust</div>
                </div>
              </div>

              {/* Handwriting Script Callout at bottom left: Real Students. Real Opportunities. */}
              <div className="absolute bottom-4 left-4 z-20 pointer-events-none select-none">
                <span
                  className="text-[16px] text-[#1673D1] font-semibold italic tracking-wide drop-shadow-xs"
                  style={{ fontFamily: 'Georgia, Cambria, serif' }}
                >
                  Real Students. Real Opportunities.
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3-PILLAR SECTION — Exactly matching image.png trust cards                 */}
      {/* ========================================================================= */}
      <section className="bg-white border-y border-[#DCE7F2] py-8 px-5 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1: Built for Trust */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F8FAFC] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#EAF4FF] border border-[#C5DCFA] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[#1673D1]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[17px] font-bold text-[#17324F]">
                  Built for Trust
                </h3>
                <p className="text-[13.5px] text-[#40566E] leading-normal">
                  From registration to verification, every step is secured with multi-layer defence and independent audit trails.
                </p>
              </div>
            </div>

            {/* Pillar 2: Powered by Intelligence */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F8FAFC] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#EAF4FF] border border-[#C5DCFA] flex items-center justify-center shrink-0">
                <Brain className="w-6 h-6 text-[#1673D1]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[17px] font-bold text-[#17324F]">
                  Powered by Intelligence
                </h3>
                <p className="text-[13.5px] text-[#40566E] leading-normal">
                  Detects anomalies, traces data leaks and identifies impossible enrolments — so you can act before it's too late.
                </p>
              </div>
            </div>

            {/* Pillar 3: Secure by Design */}
            <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F8FAFC] transition-colors">
              <div className="w-12 h-12 rounded-full bg-[#EAF4FF] border border-[#C5DCFA] flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6 text-[#1673D1]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-[17px] font-bold text-[#17324F]">
                  Secure by Design
                </h3>
                <p className="text-[13.5px] text-[#40566E] leading-normal">
                  Role-based access, mandatory MFA, cryptographic verification and privacy-first architecture.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VERIFIED STATISTICS STRIP — Matching image.png 4-metric row               */}
      {/* ========================================================================= */}
      <section className="bg-[#F4F8FC] py-8 px-5 lg:px-8 border-b border-[#DCE7F2]">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#EAF4FF] flex items-center justify-center shrink-0 text-[#1673D1]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-[28px] font-bold text-[#17324F] leading-tight font-mono">
                  20+
                </div>
                <div className="text-[13px] text-[#40566E] font-medium">
                  Registered Institutions
                </div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#EAF4FF] flex items-center justify-center shrink-0 text-[#1673D1]">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-[28px] font-bold text-[#17324F] leading-tight font-mono">
                  5,000+
                </div>
                <div className="text-[13px] text-[#40566E] font-medium">
                  Student Records (Synthetic)
                </div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#EAF4FF] flex items-center justify-center shrink-0 text-[#1673D1]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-[28px] font-bold text-[#17324F] leading-tight font-mono">
                  4
                </div>
                <div className="text-[13px] text-[#40566E] font-medium">
                  Security Layers
                </div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-[#EAF4FF] flex items-center justify-center shrink-0 text-[#1673D1]">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-2xl sm:text-[28px] font-bold text-[#17324F] leading-tight font-mono">
                  100%
                </div>
                <div className="text-[13px] text-[#40566E] font-medium">
                  Audit Traceability
                </div>
              </div>
            </div>

          </div>

          {/* Sub-Banner Line */}
          <div className="mt-6 pt-5 border-t border-[#DCE7F2] text-center text-[13px] text-[#71849A]">
            <span className="font-semibold text-[#17324F]">True-Trace</span>
            <span className="mx-2">|</span>
            <span>Empowering AICTE-approved institutions with a secure and transparent student data ecosystem.</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: ABOUT / PLATFORM OVERVIEW                                        */}
      {/* ========================================================================= */}
      <section id="about-section" className="py-14 px-5 lg:px-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF4FF] text-[#1673D1] rounded-md text-[12px] font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Institutional Record Integrity</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17324F] tracking-tight">
              Solving the Fundamental Challenges of National Higher Education Data
            </h2>
            <p className="text-[15px] text-[#40566E] leading-relaxed">
              In technical education governance, fragmented reporting across colleges can cause quota overflows, duplicate enrolments, and unverified credentials. True-Trace unifies student identity under APAAR ID while strictly maintaining institutional autonomy and zero personal data leakage.
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E7F7EF] text-[#16845B] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-[14.5px] font-semibold text-[#17324F]">Intake Quota Enforcement</div>
                  <div className="text-[13px] text-[#40566E]">Prevents colleges from enrolling beyond sanctioned seat capacities, protecting regular vs supernumerary quotas.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E7F7EF] text-[#16845B] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-[14.5px] font-semibold text-[#17324F]">Dual Enrolment Across Cities Detection</div>
                  <div className="text-[13px] text-[#40566E]">Haversine geographic distance rules flag cross-city physical attendance overlaps (&gt;100 km).</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#E7F7EF] text-[#16845B] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-[14.5px] font-semibold text-[#17324F]">Canary Honeytoken Export Attribution</div>
                  <div className="text-[13px] text-[#40566E]">Unique synthetic decoy records embed into exports to trace data leaks to specific administrative accounts.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-white border border-[#DCE7F2] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#1673D1]" />
                <span className="font-bold text-[15px] text-[#17324F]">AICTE Verification Protocol Architecture</span>
              </div>
              <span className="text-[11px] font-mono text-[#16845B] bg-[#E7F7EF] px-2 py-0.5 rounded font-semibold">
                ACTIVE DEFENSE
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#DCE7F2] flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-[#17324F]">Institutional Onboarding & Identity</div>
                  <div className="text-[11.5px] text-[#71849A]">AICTE Identifier validation + authorized registrar credentialing</div>
                </div>
                <SecurityBadge level="secure" size="xs">AUTHENTICATED</SecurityBadge>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#DCE7F2] flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-[#17324F]">Batch Ingestion & Formula Sanitization</div>
                  <div className="text-[11.5px] text-[#71849A]">Neutralizes CSV injection payloads (=, +, -, @) before parsing</div>
                </div>
                <SecurityBadge level="secure" size="xs">SANITIZED</SecurityBadge>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#DCE7F2] flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-[#17324F]">Multi-Witness Merkle Event Stream</div>
                  <div className="text-[11.5px] text-[#71849A]">Every status modification is Ed25519 signed across independent witness nodes</div>
                </div>
                <SecurityBadge level="secure" size="xs">IMMUTABLE</SecurityBadge>
              </div>

              <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#DCE7F2] flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold text-[#17324F]">Private Credential Verification</div>
                  <div className="text-[11.5px] text-[#71849A]">Employers verify degree validity without accessing student personal identity</div>
                </div>
                <SecurityBadge level="secure" size="xs">ZERO-PII</SecurityBadge>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-[12px] text-[#71849A]">
              <span>Aligned with DPDP Act 2023 & NEP 2020 guidelines</span>
              <button
                onClick={() => navigate('/institution/register')}
                className="text-[#1673D1] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Register Institution</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: HOW IT WORKS (4-STEP WORKFLOW)                                  */}
      {/* ========================================================================= */}
      <section id="how-it-works-section" className="py-14 px-5 lg:px-8 bg-white border-y border-[#DCE7F2]">
        <div className="max-w-[1400px] mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF4FF] text-[#1673D1] rounded-md text-[12px] font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>End-to-End Workflow</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17324F] tracking-tight">
              How True-Trace Operates
            </h2>
            <p className="text-[15px] text-[#40566E]">
              A four-stage pipeline transforming raw enrollment files into verifiable national records.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-5 rounded-xl border border-[#DCE7F2] bg-[#F4F8FC] space-y-3 relative">
              <div className="w-8 h-8 rounded-lg bg-[#1673D1] text-white flex items-center justify-center font-bold text-[14px]">
                1
              </div>
              <h3 className="text-[16px] font-bold text-[#17324F]">Institutional Onboarding</h3>
              <p className="text-[13px] text-[#40566E] leading-relaxed">
                Colleges submit permanent AICTE identifiers, GIS campus coordinates, and authorized registrar credentials for scrutiny.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#1673D1]">
                ● Identity Scrutiny Queue
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl border border-[#DCE7F2] bg-[#F4F8FC] space-y-3 relative">
              <div className="w-8 h-8 rounded-lg bg-[#1673D1] text-white flex items-center justify-center font-bold text-[14px]">
                2
              </div>
              <h3 className="text-[16px] font-bold text-[#17324F]">Batch Ingestion & Sanitization</h3>
              <p className="text-[13px] text-[#40566E] leading-relaxed">
                Registrars upload student cohorts. The engine automatically maps column headers and strips malicious CSV formula payloads.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#1673D1]">
                ● Formula Neutralization
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl border border-[#DCE7F2] bg-[#F4F8FC] space-y-3 relative">
              <div className="w-8 h-8 rounded-lg bg-[#1673D1] text-white flex items-center justify-center font-bold text-[14px]">
                3
              </div>
              <h3 className="text-[16px] font-bold text-[#17324F]">Impossibility AI Scrutiny</h3>
              <p className="text-[13px] text-[#40566E] leading-relaxed">
                Cross-institutional queries test for simultaneous enrollment across distant cities (&gt;100 km) and quota capacity violations.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#1673D1]">
                ● Deterministic Rules R1–R4
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-5 rounded-xl border border-[#DCE7F2] bg-[#F4F8FC] space-y-3 relative">
              <div className="w-8 h-8 rounded-lg bg-[#1673D1] text-white flex items-center justify-center font-bold text-[14px]">
                4
              </div>
              <h3 className="text-[16px] font-bold text-[#17324F]">Zero-PII Credential Issuance</h3>
              <p className="text-[13px] text-[#40566E] leading-relaxed">
                Students receive signed cryptographic credentials. Employers verify degree accreditation offline with zero personal data leakage.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#1673D1]">
                ● Ed25519 Signed QR Token
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: INTERACTIVE LIVE INTEGRITY SCANNER (DEMO ENGINE)                 */}
      {/* ========================================================================= */}
      <section id="features-section" className="py-14 px-5 lg:px-8 max-w-[1400px] mx-auto space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EAF4FF] text-[#1673D1] rounded-md text-[12px] font-semibold">
              <Activity className="w-3.5 h-3.5" />
              <span>Interactive SIH Judge Sandbox</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#17324F] tracking-tight">
              Test Real Engine Security Modules
            </h2>
            <p className="text-[14.5px] text-[#40566E]">
              Switch through live operational modules below to test detection logic and evidence verification.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="dark"
              size="sm"
              icon={<ArrowRight className="w-3.5 h-3.5 text-[#38BDF8]" />}
              iconPosition="right"
              onClick={() => navigate('/app/overview')}
            >
              Launch Full AICTE Console
            </Button>
          </div>
        </div>

        {/* Live Integrity Sandbox Container */}
        <div className="bg-white border border-[#DCE7F2] rounded-2xl shadow-xs overflow-hidden">
          {/* Sandbox Top Tabs */}
          <div className="flex border-b border-[#DCE7F2] bg-[#F8FAFC] text-[13px] font-medium text-[#40566E] overflow-x-auto">
            <button
              onClick={() => setActiveHeroTab('IMPOSSIBILITY')}
              className={`py-3 px-5 text-center border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeHeroTab === 'IMPOSSIBILITY'
                  ? 'border-[#1673D1] text-[#1673D1] font-semibold bg-white'
                  : 'border-transparent hover:text-[#17324F]'
              }`}
            >
              Impossibility Engine
            </button>
            <button
              onClick={() => setActiveHeroTab('CREDENTIAL')}
              className={`py-3 px-5 text-center border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeHeroTab === 'CREDENTIAL'
                  ? 'border-[#1673D1] text-[#1673D1] font-semibold bg-white'
                  : 'border-transparent hover:text-[#17324F]'
              }`}
            >
              Private Credential Verification
            </button>
            <button
              onClick={() => setActiveHeroTab('LEAK_TRACER')}
              className={`py-3 px-5 text-center border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeHeroTab === 'LEAK_TRACER'
                  ? 'border-[#1673D1] text-[#1673D1] font-semibold bg-white'
                  : 'border-transparent hover:text-[#17324F]'
              }`}
            >
              Canary Leak Tracer
            </button>
            <button
              onClick={() => setActiveHeroTab('AUDIT')}
              className={`py-3 px-5 text-center border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                activeHeroTab === 'AUDIT'
                  ? 'border-[#1673D1] text-[#1673D1] font-semibold bg-white'
                  : 'border-transparent hover:text-[#17324F]'
              }`}
            >
              Audit Verification Ledger
            </button>
          </div>

          {/* Sandbox Dynamic Body */}
          <div className="p-6">
            {activeHeroTab === 'IMPOSSIBILITY' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <SecurityBadge level="critical" size="sm" pulse>
                      CROSS-CITY DUPLICATE DETECTED
                    </SecurityBadge>
                    <span className="text-[12px] font-mono text-[#71849A]">Rule: R1_GEO_IMPOSSIBLE</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#17324F]">
                    Candidate Vikram Mehta reported in Delhi & Bangalore
                  </h3>
                  <p className="text-[13.5px] text-[#40566E] leading-relaxed">
                    The Impossibility Engine computes spatial coordinates between Delhi Institute of Technology (28.61° N) and NIT Bangalore (12.97° N). The Haversine distance is 1,740 km, which violates the maximum permissible distance (&gt;100 km) for full-time regular technical degrees.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<ArrowRight className="w-3.5 h-3.5" />}
                      iconPosition="right"
                      onClick={() => navigate('/app/analysis')}
                    >
                      Investigate in Anomaly Engine
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] font-mono text-[12px] space-y-2">
                  <div className="flex justify-between border-b border-[#DCE7F2] pb-1.5">
                    <span className="text-[#71849A]">Student APAAR:</span>
                    <span className="text-[#17324F] font-bold">8921-4412-9018</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71849A]">Institution 1:</span>
                    <span className="text-[#17324F] font-semibold">Delhi Inst of Tech (28.61° N)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71849A]">Institution 2:</span>
                    <span className="text-[#17324F] font-semibold">NIT Bangalore (12.97° N)</span>
                  </div>
                  <div className="flex justify-between text-[#C53D45] font-bold pt-1 border-t border-[#DCE7F2]">
                    <span>Haversine Distance:</span>
                    <span>1,740 km (Flagged)</span>
                  </div>
                  <div className="text-[11px] text-[#16845B] pt-1">
                    ✔ Auto-quarantine alert generated for AICTE Regional Officer
                  </div>
                </div>
              </div>
            )}

            {activeHeroTab === 'CREDENTIAL' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <SecurityBadge level="secure" size="sm">
                      ZERO-PII VERIFIED
                    </SecurityBadge>
                    <span className="text-[12px] font-mono text-[#71849A]">Protocol: Selective-Disclosure Ed25519</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#17324F]">
                    Accreditation Proof Without Exposing Personal Identity
                  </h3>
                  <p className="text-[13.5px] text-[#40566E] leading-relaxed">
                    Employers, overseas credential evaluators, and embassies scan the QR token to verify degree authenticity, AICTE approval status, and graduation standing without transmitting student full names, birth dates, or personal data.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<QrCode className="w-4 h-4" />}
                      iconPosition="left"
                      onClick={() => navigate('/verify')}
                    >
                      Open Interactive Public QR Scanner
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] font-mono text-[12px] space-y-2">
                  <div className="flex justify-between border-b border-[#DCE7F2] pb-1.5">
                    <span className="text-[#71849A]">Degree Claim:</span>
                    <span className="text-[#16845B] font-bold">B.Tech Computer Science</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71849A]">AICTE Status:</span>
                    <span className="text-[#16845B] font-semibold">APPROVED (Sanctioned Quota)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71849A]">Digital Signature:</span>
                    <span className="text-[#1673D1] font-semibold truncate max-w-[160px]">ed25519:7a89f0c2e3...</span>
                  </div>
                  <div className="flex justify-between text-[#17324F] font-bold pt-1 border-t border-[#DCE7F2]">
                    <span>Personal Data Exposed:</span>
                    <span className="text-[#16845B]">0 Bytes Transmitted</span>
                  </div>
                </div>
              </div>
            )}

            {activeHeroTab === 'LEAK_TRACER' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <SecurityBadge level="warning" size="sm">
                      SOURCE IDENTIFIED
                    </SecurityBadge>
                    <span className="text-[12px] font-mono text-[#71849A]">Canary Injection & Attribution</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#17324F]">
                    Forensic Leak Attribution from Public Dumps
                  </h3>
                  <p className="text-[13.5px] text-[#40566E] leading-relaxed">
                    When an authorized registrar exports student records, True-Trace seeds unique synthetic canary records and column permutations. If an export is later leaked, uploading any snippet identifies the exact downloading user, timestamp, and IP session.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Fingerprint className="w-4 h-4" />}
                      iconPosition="left"
                      onClick={() => navigate('/app/leak-tracer')}
                    >
                      Inspect Forensic Leak Tracer
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] font-mono text-[12px] space-y-2">
                  <div className="flex justify-between border-b border-[#DCE7F2] pb-1.5">
                    <span className="text-[#71849A]">Export Token:</span>
                    <span className="text-[#1673D1] font-bold">EXP-2026-8910</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71849A]">Downloading Admin:</span>
                    <span className="text-[#17324F] font-semibold">Dr. Ramesh Verma (Registrar)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71849A]">Institute:</span>
                    <span className="text-[#17324F]">Delhi Inst of Tech</span>
                  </div>
                  <div className="flex justify-between text-[#B7791F] font-bold pt-1 border-t border-[#DCE7F2]">
                    <span>Attribution Match:</span>
                    <span>98% Confidence (2/3 Canaries)</span>
                  </div>
                </div>
              </div>
            )}

            {activeHeroTab === 'AUDIT' && (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center gap-2">
                    <SecurityBadge level="secure" size="sm">
                      DECENTRALIZED RECEIPT
                    </SecurityBadge>
                    <span className="text-[12px] font-mono text-[#71849A]">SHA-256 Merkle Hash Chain</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#17324F]">
                    Multi-Witness Audit Ledger
                  </h3>
                  <p className="text-[13.5px] text-[#40566E] leading-relaxed">
                    Student modifications and admissions cannot be rewritten by malicious college staff or compromised database admins. Every batch generates a cryptographic root hash anchored across independent witness nodes outside institutional boundaries.
                  </p>
                  <div className="flex items-center gap-3 pt-2">
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<FileCheck className="w-4 h-4" />}
                      iconPosition="left"
                      onClick={() => navigate('/app/audit')}
                    >
                      Verify Multi-Witness Ledger
                    </Button>
                  </div>
                </div>

                <div className="md:col-span-5 p-4 rounded-xl bg-[#F8FAFC] border border-[#DCE7F2] font-mono text-[12px] space-y-2">
                  <div className="flex justify-between border-b border-[#DCE7F2] pb-1.5">
                    <span className="text-[#71849A]">Current Ledger Height:</span>
                    <span className="text-[#17324F] font-bold">1,024 Verified Blocks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71849A]">Witness 1 (NIC):</span>
                    <span className="text-[#16845B] font-semibold">SIGNED (0x81b2...)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#71849A]">Witness 2 (AICTE Trust):</span>
                    <span className="text-[#16845B] font-semibold">SIGNED (0xc41e...)</span>
                  </div>
                  <div className="flex justify-between text-[#1673D1] font-bold pt-1 border-t border-[#DCE7F2]">
                    <span>Chain Integrity:</span>
                    <span className="text-[#16845B]">100% VALID (Zero Tampering)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION: INSTITUTION ONBOARDING HIGHLIGHT (PROMINENT CALLOUT)             */}
      {/* ========================================================================= */}
      <section id="institutions-section" className="py-14 px-5 lg:px-8 max-w-[1400px] mx-auto">
        <div className="bg-gradient-to-r from-[#17324F] to-[#122A42] text-white rounded-2xl p-8 sm:p-12 relative overflow-hidden shadow-md">
          {/* Background Decorative Rings */}
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -right-8 -top-8 w-60 h-60 rounded-full border border-white/10 pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white rounded-md text-[12px] font-semibold">
              <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>For Universities, Autonomous Colleges & Polytechnics</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
              Ready to Connect Your Institution to True-Trace?
            </h2>

            <p className="text-[15px] text-slate-300 leading-relaxed">
              Register your institution's permanent AICTE identifier, configure approved course intake quotas, and onboard administrative staff with zero integration friction.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-3">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => navigate('/institution/register')}
              >
                Register Institution Now
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/institution/registration-status')}
                className="bg-white/10 hover:bg-white/15 text-white border-white/20 hover:border-white/30 hover:text-white"
              >
                Check Application Status
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CONTACT / SUPPORT MODAL (ACCESSIBLE FROM NAVBAR)                         */}
      {/* ========================================================================= */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-[#17324F]/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-xl border border-[#DCE7F2] space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE7F2] pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#1673D1]" />
                <h3 className="text-lg font-bold text-[#17324F]">Contact Platform Support</h3>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-[#71849A] hover:text-[#17324F] text-lg font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {contactSubmitted ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 bg-[#E7F7EF] text-[#16845B] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-[#17324F]">Inquiry Logged</h4>
                <p className="text-[13px] text-[#40566E]">
                  Your request has been recorded for the SIH 2026 technical evaluation team (Team Algo Shifters).
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setContactSubmitted(false);
                    setShowContactModal(false);
                  }}
                >
                  Close Window
                </Button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                className="space-y-3.5 text-[13px]"
              >
                <div>
                  <label className="block font-semibold text-[#17324F] mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. / Officer Name"
                    className="w-full px-3 py-2 rounded-md border border-[#DCE7F2] focus:border-[#1673D1] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17324F] mb-1">Official Email</label>
                  <input
                    type="email"
                    required
                    placeholder="officer@institution.ac.in"
                    className="w-full px-3 py-2 rounded-md border border-[#DCE7F2] focus:border-[#1673D1] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#17324F] mb-1">Institution AICTE ID / Query</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Please specify your institution name, inquiry or feedback..."
                    className="w-full px-3 py-2 rounded-md border border-[#DCE7F2] focus:border-[#1673D1] focus:outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowContactModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    type="submit"
                  >
                    Send Inquiry
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFICIAL INSTITUTIONAL FOOTER                                            */}
      {/* ========================================================================= */}
      <footer className="border-t border-[#DCE7F2] bg-white text-[#17324F] select-none mt-auto">
        <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Col 1: Brand & Logo */}
            <div className="md:col-span-5 space-y-3">
              <ApaarLogo size="md" variant="dark" withSubtitle={true} />
              <p className="text-[13.5px] text-[#40566E] leading-relaxed pt-1 max-w-md">
                Official AICTE Prototype developed for Smart India Hackathon 2026. True-Trace protects the integrity of national technical education records through automated anomaly detection, forensic leak tracing, and audit verification.
              </p>
              <div className="text-[11.5px] text-[#71849A] font-mono pt-1">
                Problem Statement ID: 26263 · Theme: Smart Automation · Team: Algo Shifters
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="md:col-span-4 space-y-2.5 text-[13.5px] text-[#40566E]">
              <span className="text-[12px] font-bold text-[#17324F] uppercase tracking-wider block">
                Platform Navigation
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => navigate('/institution/register')} className="text-left hover:text-[#1673D1] font-semibold text-[#1673D1] cursor-pointer">
                  Register Institution
                </button>
                <button onClick={() => navigate('/login')} className="text-left hover:text-[#1673D1] cursor-pointer">
                  Portal Login
                </button>
                <button onClick={() => navigate('/verify')} className="text-left hover:text-[#1673D1] cursor-pointer">
                  Public QR Verifier
                </button>
                <button onClick={() => navigate('/institution/registration-status')} className="text-left hover:text-[#1673D1] cursor-pointer">
                  Application Status
                </button>
                <button onClick={() => navigate('/app/overview')} className="text-left hover:text-[#1673D1] cursor-pointer">
                  AICTE Dashboard
                </button>
                <button onClick={() => navigate('/app/security-monitor')} className="text-left hover:text-[#1673D1] cursor-pointer">
                  Security Operations
                </button>
              </div>
            </div>

            {/* Col 3: Compliance & Standards */}
            <div className="md:col-span-3 space-y-2 text-[12.5px] text-[#40566E]">
              <span className="text-[12px] font-bold text-[#17324F] uppercase tracking-wider block">
                Governance & Standards
              </span>
              <div className="space-y-1">
                <div>Digital Personal Data Protection (DPDP) Act 2023</div>
                <div>AICTE Approval Process Handbook (APH) Quotas</div>
                <div>Ed25519 Cryptographic Root Signatures</div>
                <div>Zero-Knowledge Selective Disclosure Protocol</div>
              </div>
            </div>

          </div>

          <div className="mt-8 pt-5 border-t border-[#DCE7F2] flex flex-wrap items-center justify-between gap-3 text-[11.5px] text-[#71849A]">
            <div>
              © 2026 All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India.
            </div>
            <div className="font-mono">
              SIH 2026 PROTOTYPE EVALUATION ENVIRONMENT
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
