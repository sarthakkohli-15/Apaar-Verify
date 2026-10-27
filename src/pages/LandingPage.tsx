/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ApaarLogo } from '../components/common/ApaarLogo';
import { SecurityBadge } from '../components/common/SecurityBadge';
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
} from 'lucide-react';

interface LandingPageProps {
  navigate: (path: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ navigate }) => {
  // Interactive Live Hero Sandbox active tab
  const [activeHeroTab, setActiveHeroTab] = useState<'IMPOSSIBILITY' | 'CREDENTIAL' | 'LEAK_TRACER' | 'AUDIT'>('IMPOSSIBILITY');
  const [simulatedCheckPassed, setSimulatedCheckPassed] = useState(true);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleRunHeroSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulatedCheckPassed(prev => !prev);
    }, 500);
  };

  return (
    <div
      className="min-h-screen bg-[#F4F6F9] text-[#172536] flex flex-col font-sans"
      style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Top Navigation Bar */}
      <header className="bg-[#10243A] text-white border-b border-[#1B3552] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Brand Wordmark & New Insignia */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <ApaarLogo variant="light" size="md" withSubtitle={true} />
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13.5px] font-medium text-slate-300">
            <button
              onClick={() => navigate('/app/overview')}
              className="hover:text-white transition-colors"
            >
              Central Console
            </button>
            <button
              onClick={() => navigate('/app/analysis')}
              className="hover:text-white transition-colors"
            >
              Impossibility Engine
            </button>
            <button
              onClick={() => navigate('/app/leak-tracer')}
              className="hover:text-white transition-colors"
            >
              Canary Leak Tracer
            </button>
            <button
              onClick={() => navigate('/verify')}
              className="hover:text-white transition-colors flex items-center gap-1 text-[#38BDF8]"
            >
              <span>Public QR Verifier</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={() => navigate('/institution/register')}
              className="hover:text-white transition-colors"
            >
              Institution Onboarding
            </button>
          </nav>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-[13px] font-semibold text-white bg-[#2457A7] hover:bg-[#3169B5] rounded transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Engaging Split Hero Section */}
        <section className="relative pt-12 pb-16 px-5 lg:px-8 max-w-7xl mx-auto overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 7 Columns: Powerful Value Proposition */}
            <div className="lg:col-span-7 space-y-5 text-left">
              {/* Official SIH 2026 Badge */}
              <div className="inline-flex items-center gap-2.5 px-3 py-1 bg-[#10243A]/5 border border-[#10243A]/15 rounded text-[12px] font-semibold text-[#10243A]">
                <span className="w-2 h-2 rounded-full bg-[#D97706] animate-pulse" />
                <span className="font-mono text-[#2457A7]">SMART INDIA HACKATHON 2026</span>
                <span className="text-[#D5DEE8]">|</span>
                <span>Problem Statement 26263</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl font-semibold text-[#10243A] tracking-tight leading-[1.15]">
                One Student Identity. <br />
                <span className="text-[#2457A7]">Verifiable Institutional Records.</span> <br />
                <span className="text-[#168C83]">Zero Unauthorized Leakage.</span>
              </h1>

              {/* Core Context Paragraph */}
              <p className="text-[15px] sm:text-[16px] text-[#59697C] max-w-xl leading-normal">
                APAAR-VERIFY is AICTE's automated student-data management and verification platform. It replaces fragmented aggregate reporting with cryptographically verified student-level records, deterministic physical impossibility detection, and tamper-evident multi-witness audit chains.
              </p>

              {/* Key National Metrics Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-2.5 bg-white border border-[#D5DEE8] rounded shadow-2xs">
                  <div className="text-[11px] text-[#59697C] font-semibold uppercase">Enrolled Students</div>
                  <div className="text-[20px] font-semibold font-mono text-[#10243A]">4,435</div>
                  <div className="text-[10px] text-[#16805D] font-mono mt-0.5">● 100% Validated</div>
                </div>

                <div className="p-2.5 bg-white border border-[#D5DEE8] rounded shadow-2xs">
                  <div className="text-[11px] text-[#59697C] font-semibold uppercase">Institutions</div>
                  <div className="text-[20px] font-semibold font-mono text-[#2457A7]">10 Colleges</div>
                  <div className="text-[10px] text-[#59697C] font-mono mt-0.5">Approved Quotas</div>
                </div>

                <div className="p-2.5 bg-white border border-[#D5DEE8] rounded shadow-2xs">
                  <div className="text-[11px] text-[#59697C] font-semibold uppercase">Detection Engine</div>
                  <div className="text-[20px] font-semibold font-mono text-[#168C83]">R1–R4 Rules</div>
                  <div className="text-[10px] text-[#59697C] font-mono mt-0.5">Haversine &gt;100km</div>
                </div>

                <div className="p-2.5 bg-white border border-[#D5DEE8] rounded shadow-2xs">
                  <div className="text-[11px] text-[#59697C] font-semibold uppercase">Witnessed Audit</div>
                  <div className="text-[20px] font-semibold font-mono text-[#16805D]">1,024 Blks</div>
                  <div className="text-[10px] text-[#16805D] font-mono mt-0.5">Ed25519 Signed</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-6 py-3 text-[14px] font-semibold text-white bg-[#10243A] hover:bg-[#0B1728] rounded transition-colors shadow-xs flex items-center gap-2"
                >
                  <span>Launch AICTE Console</span>
                  <ArrowRight className="w-4 h-4 text-[#D97706]" />
                </button>

                <button
                  onClick={() => navigate('/verify')}
                  className="px-5 py-3 text-[14px] font-semibold text-[#172536] bg-white border border-[#D5DEE8] hover:bg-[#F9FAFC] rounded transition-colors shadow-2xs flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4 text-[#2457A7]" />
                  <span>Public QR Verifier</span>
                </button>

                <button
                  onClick={() => navigate('/institution/register')}
                  className="px-4 py-3 text-[13px] font-medium text-[#59697C] hover:text-[#2457A7] transition-colors"
                >
                  New Institution Registration →
                </button>
              </div>
            </div>

            {/* Right 5 Columns: Interactive Live Integrity Scanner Sandbox */}
            <div className="lg:col-span-5 bg-white border border-[#D5DEE8] rounded shadow-sm overflow-hidden">
              {/* Sandbox Header */}
              <div className="bg-[#10243A] text-white p-4 flex items-center justify-between border-b border-[#1D3B5C]">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#38BDF8]" />
                  <span className="font-semibold text-[13.5px]">Live Verification Engine Sandbox</span>
                </div>
                <span className="text-[10px] font-mono bg-[#1D3B5C] text-[#38BDF8] px-2 py-0.5 rounded border border-[#38BDF8]/30 font-semibold">
                  INTERACTIVE DEMO
                </span>
              </div>

              {/* Sandbox Tabs */}
              <div className="flex border-b border-[#D5DEE8] bg-[#F8FAFC] text-[12px] font-medium text-[#59697C]">
                <button
                  onClick={() => setActiveHeroTab('IMPOSSIBILITY')}
                  className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors ${
                    activeHeroTab === 'IMPOSSIBILITY'
                      ? 'border-[#2457A7] text-[#2457A7] font-semibold bg-white'
                      : 'border-transparent hover:text-[#172536]'
                  }`}
                >
                  Impossibility AI
                </button>
                <button
                  onClick={() => setActiveHeroTab('CREDENTIAL')}
                  className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors ${
                    activeHeroTab === 'CREDENTIAL'
                      ? 'border-[#2457A7] text-[#2457A7] font-semibold bg-white'
                      : 'border-transparent hover:text-[#172536]'
                  }`}
                >
                  Zero-PII QR
                </button>
                <button
                  onClick={() => setActiveHeroTab('LEAK_TRACER')}
                  className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors ${
                    activeHeroTab === 'LEAK_TRACER'
                      ? 'border-[#2457A7] text-[#2457A7] font-semibold bg-white'
                      : 'border-transparent hover:text-[#172536]'
                  }`}
                >
                  Canary Tracer
                </button>
                <button
                  onClick={() => setActiveHeroTab('AUDIT')}
                  className={`flex-1 py-2.5 px-2 text-center border-b-2 transition-colors ${
                    activeHeroTab === 'AUDIT'
                      ? 'border-[#2457A7] text-[#2457A7] font-semibold bg-white'
                      : 'border-transparent hover:text-[#172536]'
                  }`}
                >
                  Merkle Ledger
                </button>
              </div>

              {/* Sandbox Dynamic Body */}
              <div className="p-4 space-y-3 min-h-[260px] flex flex-col justify-between text-[13px]">
                {activeHeroTab === 'IMPOSSIBILITY' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#172536]">Cross-City Dual Enrolment Check</span>
                      <SecurityBadge level="critical" size="xs" pulse>
                        IMPOSSIBILITY DETECTED
                      </SecurityBadge>
                    </div>

                    <p className="text-[12px] text-[#59697C] leading-normal">
                      Candidate Vikram Mehta (APAAR: 8921-4412-9018) simultaneously reported as full-time regular student in Delhi and Bangalore.
                    </p>

                    <div className="p-2.5 bg-[#F8FAFC] border border-[#D5DEE8] rounded font-mono text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#59697C]">Institute A:</span>
                        <span className="text-[#172536] font-semibold">Delhi Inst of Tech (28.61° N)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#59697C]">Institute B:</span>
                        <span className="text-[#172536] font-semibold">NIT Bangalore (12.97° N)</span>
                      </div>
                      <div className="flex justify-between text-[#991B1B] font-semibold pt-1 border-t border-[#D5DEE8]">
                        <span>Haversine Distance:</span>
                        <span>1,740 km (Exceeds &gt;100km limit)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeHeroTab === 'CREDENTIAL' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#172536]">Selective Disclosure QR Token</span>
                      <SecurityBadge level="secure" size="xs">
                        ZERO PII EXPOSED
                      </SecurityBadge>
                    </div>

                    <p className="text-[12px] text-[#59697C] leading-normal">
                      Authenticates academic enrollment and AICTE approval without revealing student name, date of birth, or full APAAR ID.
                    </p>

                    <div className="p-2.5 bg-[#F8FAFC] border border-[#D5DEE8] rounded font-mono text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#59697C]">Program Claim:</span>
                        <span className="text-[#065F46] font-semibold">B.Tech Computer Science</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#59697C]">Accreditation:</span>
                        <span className="text-[#065F46] font-semibold">AICTE-APPROVED (Ed25519)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#59697C]">PII Residual:</span>
                        <span className="text-[#10243A] font-semibold">0 Bytes Transmitted</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeHeroTab === 'LEAK_TRACER' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#172536]">Canary & Permutation Attribution</span>
                      <SecurityBadge level="warning" size="xs">
                        SOURCE IDENTIFIED
                      </SecurityBadge>
                    </div>

                    <p className="text-[12px] text-[#59697C] leading-normal">
                      Every institutional export injects unique synthetic canaries. Traces an unauthorized DarkWeb dump to the exact terminal session.
                    </p>

                    <div className="p-2.5 bg-[#F8FAFC] border border-[#D5DEE8] rounded font-mono text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#59697C]">Export ID:</span>
                        <span className="text-[#2457A7] font-semibold">EXP-2026-8910</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#59697C]">Actor Responsible:</span>
                        <span className="text-[#172536] font-semibold">Dr. Ramesh Verma (Registrar)</span>
                      </div>
                      <div className="flex justify-between text-[#92400E] font-semibold pt-1 border-t border-[#D5DEE8]">
                        <span>Attribution Match:</span>
                        <span>98% Confidence (2/3 Canaries)</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeHeroTab === 'AUDIT' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#172536]">Multi-Witness Merkle Checkpoint</span>
                      <SecurityBadge level="secure" size="xs">
                        DECENTRALIZED RECEIPT
                      </SecurityBadge>
                    </div>

                    <p className="text-[12px] text-[#59697C] leading-normal">
                      Append-only SHA-256 event stream anchored across 4 independent national witness nodes outside institutional reach.
                    </p>

                    <div className="p-2.5 bg-[#F8FAFC] border border-[#D5DEE8] rounded font-mono text-[11px] space-y-1">
                      <div className="flex justify-between">
                        <span className="text-[#59697C]">Root Hash:</span>
                        <span className="text-[#2457A7] font-semibold truncate max-w-[170px]">1f83d9ab5be0cd19...</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#59697C]">Witness 1:</span>
                        <span className="text-[#065F46] font-semibold">Natl Informatics Centre (NIC)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#59697C]">Witness 2:</span>
                        <span className="text-[#065F46] font-semibold">AICTE National Trust Node</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interactive Sandbox Action */}
                <div className="pt-2 border-t border-[#D5DEE8] flex items-center justify-between">
                  <span className="text-[11px] text-[#8A9BA8] font-mono">
                    Deterministic Prototype Engine
                  </span>
                  <button
                    onClick={() => {
                      if (activeHeroTab === 'IMPOSSIBILITY') navigate('/app/analysis');
                      else if (activeHeroTab === 'CREDENTIAL') navigate('/verify');
                      else if (activeHeroTab === 'LEAK_TRACER') navigate('/app/leak-tracer');
                      else navigate('/app/audit');
                    }}
                    className="px-3 py-1 bg-[#2457A7] hover:bg-[#3169B5] text-white text-[12px] font-medium rounded transition-colors"
                  >
                    Inspect Full Evidence →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-Time Operational Defense Strip */}
        <section className="bg-white border-y border-[#D5DEE8] py-8 px-5 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <span className="text-[11px] font-semibold text-[#2457A7] uppercase tracking-widest font-mono">
                NATIONAL TECHNICAL EDUCATION DATA TRUST ARCHITECTURE
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-[#172536] mt-0.5">
                Engineered for Integrity, Scalability, and Institutional Sovereignty
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded border border-[#D5DEE8] bg-[#FBFDFE]">
                <div className="w-8 h-8 rounded bg-[#10243A] text-white flex items-center justify-center font-bold text-xs mb-3">
                  01
                </div>
                <h3 className="text-[15px] font-semibold text-[#172536]">
                  Strict Intake Quota Enforcement
                </h3>
                <p className="text-[13px] text-[#59697C] mt-1.5 leading-normal">
                  Institutions cannot exceed sanctioned council intake. Supernumerary (NRI, OCI, FN) quotas are quarantined and validated separately from general technical admissions.
                </p>
              </div>

              <div className="p-4 rounded border border-[#D5DEE8] bg-[#FBFDFE]">
                <div className="w-8 h-8 rounded bg-[#2457A7] text-white flex items-center justify-center font-bold text-xs mb-3">
                  02
                </div>
                <h3 className="text-[15px] font-semibold text-[#172536]">
                  Impossibility AI & Fraud-Ring Detection
                </h3>
                <p className="text-[13px] text-[#59697C] mt-1.5 leading-normal">
                  Identifies phantom enrolments where students appear in multiple institutes across physical distance thresholds (&gt;100 km) using deterministic Haversine computations.
                </p>
              </div>

              <div className="p-4 rounded border border-[#D5DEE8] bg-[#FBFDFE]">
                <div className="w-8 h-8 rounded bg-[#168C83] text-white flex items-center justify-center font-bold text-xs mb-3">
                  03
                </div>
                <h3 className="text-[15px] font-semibold text-[#172536]">
                  Cryptographic Verification & Zero PII
                </h3>
                <p className="text-[13px] text-[#59697C] mt-1.5 leading-normal">
                  Digital degree & enrollment credentials contain only signed cryptographic assertions. Verifiers validate accreditation offline with zero leakage of names, birthdates, or identity records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6-Layer Defense Architecture Grid */}
        <section className="py-12 px-5 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
              <div>
                <h2 className="text-xl font-semibold text-[#172536]">
                  Six-Layer Cybersecurity Architecture
                </h2>
                <p className="text-[13px] text-[#59697C] mt-0.5">
                  Multi-layered defense-in-depth model protecting AICTE student records against outsider and insider threats
                </p>
              </div>

              <button
                onClick={() => navigate('/app/security-monitor')}
                className="px-3.5 py-1.5 bg-[#10243A] text-white text-[13px] font-medium rounded hover:bg-[#0B1728] transition-colors"
              >
                Inspect Live Security Monitor →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3.5 rounded border border-[#D5DEE8] bg-[#F8FAFC]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#2457A7] font-mono">LAYER 1: EDGE</span>
                  <SecurityBadge level="secure" size="xs">ACTIVE</SecurityBadge>
                </div>
                <h4 className="text-[13.5px] font-semibold text-[#172536]">TLS 1.3 & DoS Throttling</h4>
                <p className="text-[12px] text-[#59697C] mt-1">Strict edge API gateway, 10MB payload size limits, and rate caps.</p>
              </div>

              <div className="p-3.5 rounded border border-[#D5DEE8] bg-[#F8FAFC]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#2457A7] font-mono">LAYER 2: IDENTITY</span>
                  <SecurityBadge level="secure" size="xs">ENFORCED</SecurityBadge>
                </div>
                <h4 className="text-[13.5px] font-semibold text-[#172536]">Mandatory TOTP MFA</h4>
                <p className="text-[12px] text-[#59697C] mt-1">Time-based one-time password challenges on all administrative logins.</p>
              </div>

              <div className="p-3.5 rounded border border-[#D5DEE8] bg-[#F8FAFC]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#2457A7] font-mono">LAYER 3: API GATEWAY</span>
                  <SecurityBadge level="secure" size="xs">VERIFIED</SecurityBadge>
                </div>
                <h4 className="text-[13.5px] font-semibold text-[#172536]">Tenant Isolation & RBAC</h4>
                <p className="text-[12px] text-[#59697C] mt-1">Colleges strictly access only their approved cohort via session tokens.</p>
              </div>

              <div className="p-3.5 rounded border border-[#D5DEE8] bg-[#F8FAFC]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#2457A7] font-mono">LAYER 4: APP SERVICES</span>
                  <SecurityBadge level="secure" size="xs">PROTECTED</SecurityBadge>
                </div>
                <h4 className="text-[13.5px] font-semibold text-[#172536]">Formula Injection Defense</h4>
                <p className="text-[12px] text-[#59697C] mt-1">Leading CSV prefixes (=, +, -, @) automatically disarmed during ingestion.</p>
              </div>

              <div className="p-3.5 rounded border border-[#D5DEE8] bg-[#F8FAFC]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#2457A7] font-mono">LAYER 5: DATA GOVERNANCE</span>
                  <SecurityBadge level="secure" size="xs">GUARDED</SecurityBadge>
                </div>
                <h4 className="text-[13.5px] font-semibold text-[#172536]">Honeytoken Canaries</h4>
                <p className="text-[12px] text-[#59697C] mt-1">Unique synthetic records embedded into exports for forensic attribution.</p>
              </div>

              <div className="p-3.5 rounded border border-[#D5DEE8] bg-[#F8FAFC]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#2457A7] font-mono">LAYER 6: AUDIT</span>
                  <SecurityBadge level="secure" size="xs">WITNESSED</SecurityBadge>
                </div>
                <h4 className="text-[13.5px] font-semibold text-[#172536]">Multi-Witness Merkle Roots</h4>
                <p className="text-[12px] text-[#59697C] mt-1">Immutable hash chains anchored outside the institutional database.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Public Credential Instant Test CTA Banner */}
        <section className="pb-16 px-5 lg:px-8 max-w-7xl mx-auto">
          <div className="bg-[#10243A] text-white rounded p-8 sm:p-10 flex flex-wrap items-center justify-between gap-6 shadow-sm">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[11px] font-mono text-[#F59E0B] font-semibold tracking-wider uppercase">
                Zero-Knowledge Offline Credential Verification
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Need to verify a student's degree or accreditation?
              </h3>
              <p className="text-[14px] text-slate-300 leading-normal">
                Employers, foreign universities, and government agencies can verify signed AICTE QR credentials instantly without requiring database accounts or exposing personal identifiers.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('/verify')}
                className="px-6 py-3 bg-[#2457A7] hover:bg-[#3169B5] text-white text-[14px] font-semibold rounded transition-colors shadow-xs flex items-center gap-2"
              >
                <span>Launch Public Verifier</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white text-[14px] font-semibold rounded border border-white/20 transition-colors"
              >
                Institutional Portal Login
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Official Government Footer */}
      <footer className="border-t border-[#D5DEE8] bg-white text-[#172536] select-none">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="md:col-span-5 space-y-2">
              <ApaarLogo size="md" variant="dark" withSubtitle={true} />
              <p className="text-[13px] text-[#59697C] leading-normal pt-1 max-w-md">
                Official AICTE Prototype developed for Smart India Hackathon 2026. Designed to protect the integrity of national technical education records through automated anomaly detection and cryptographic trust.
              </p>
              <div className="text-[11px] text-[#8A9BA8] font-mono pt-1">
                Problem Statement ID: 26263 · Theme: Smart Automation · Team: Algo Shifters
              </div>
            </div>

            <div className="md:col-span-4 space-y-2 text-[13px] text-[#59697C]">
              <span className="text-[12px] font-semibold text-[#172536] uppercase tracking-wider block">
                Quick Demonstration Links
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => navigate('/login')} className="text-left hover:text-[#2457A7]">
                  Portal Sign In
                </button>
                <button onClick={() => navigate('/verify')} className="text-left hover:text-[#2457A7]">
                  Public QR Verifier
                </button>
                <button onClick={() => navigate('/institution/register')} className="text-left hover:text-[#2457A7]">
                  Register Institution
                </button>
                <button onClick={() => navigate('/institution/registration-status')} className="text-left hover:text-[#2457A7]">
                  Application Status
                </button>
                <button onClick={() => navigate('/app/overview')} className="text-left hover:text-[#2457A7]">
                  AICTE Dashboard
                </button>
                <button onClick={() => navigate('/app/security-monitor')} className="text-left hover:text-[#2457A7]">
                  Security Operations
                </button>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2 text-[12px] text-[#59697C]">
              <span className="text-[12px] font-semibold text-[#172536] uppercase tracking-wider block">
                Regulatory Standards
              </span>
              <div className="space-y-1">
                <div>Digital Personal Data Protection (DPDP) Act 2023</div>
                <div>AICTE Approval Process Handbook (APH) Quotas</div>
                <div>Ed25519 Cryptographic Root Signatures</div>
                <div>Zero-Knowledge Selective Disclosure Protocol</div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-[#D5DEE8] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#8A9BA8]">
            <div>
              © 2026 All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India.
            </div>
            <div className="font-mono">
              PROTOTYPE APPLICATION FOR EVALUATION ONLY
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
