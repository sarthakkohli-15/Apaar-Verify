/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ApaarLogo } from '../common/ApaarLogo';
import { ShieldCheck, Lock, ExternalLink, Activity } from 'lucide-react';

interface FooterProps {
  navigate?: (path: string) => void;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ navigate, className = '' }) => {
  return (
    <footer
      className={`border-t border-[#D5DEE8] bg-white text-[#172536] mt-auto select-none ${className}`}
      style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Top Status & Telemetry Bar */}
      <div className="bg-[#F8FAFC] border-b border-[#D5DEE8] px-5 py-2.5 text-[12px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-[#59697C]">
          <span className="flex items-center gap-1.5 text-[#16805D] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#16805D] animate-pulse" />
            LIVE REGISTRY STATUS: 100% OPERATIONAL
          </span>
          <span className="hidden sm:inline text-[#D5DEE8]">|</span>
          <span className="hidden sm:inline">Node: DEL-AICTE-01</span>
          <span className="hidden md:inline text-[#D5DEE8]">|</span>
          <span className="hidden md:inline">Ed25519 Root Key Verified</span>
          <span className="hidden lg:inline text-[#D5DEE8]">|</span>
          <span className="hidden lg:inline">Hash Chain Height: 1,024 Blocks</span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-[#59697C]">
          <span className="bg-[#EBF1F8] text-[#2457A7] px-2 py-0.5 rounded border border-[#2457A7]/20 font-semibold">
            SIH 2026 · PS 26263
          </span>
          <span className="text-[#10243A] font-semibold">Team Algo Shifters</span>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-[1560px] mx-auto px-5 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Col 1: Brand & Ministry Context (5 cols) */}
          <div className="md:col-span-5 space-y-2">
            <ApaarLogo size="sm" withSubtitle={true} variant="dark" />
            <p className="text-[13px] text-[#59697C] leading-normal pt-1 max-w-md">
              APAAR-VERIFY is an automated student data management and verification platform for AICTE-approved institutions, providing centralized intake monitoring, anomaly detection, and tamper-evident audit trails.
            </p>
            <div className="flex items-center gap-3 text-[11px] text-[#59697C] pt-1">
              <span>All India Council for Technical Education (AICTE)</span>
              <span>·</span>
              <span>Ministry of Education, Govt. of India</span>
            </div>
          </div>

          {/* Col 2: Navigation & Quick Portals (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <span className="text-[12px] font-semibold text-[#172536] uppercase tracking-wider block">
              Core Security & Integrity Services
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[12.5px] text-[#59697C]">
              {navigate && (
                <>
                  <button
                    onClick={() => navigate('/app/overview')}
                    className="text-left hover:text-[#2457A7] transition-colors"
                  >
                    Central AICTE Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/app/analysis')}
                    className="text-left hover:text-[#2457A7] transition-colors"
                  >
                    Impossibility Engine
                  </button>
                  <button
                    onClick={() => navigate('/app/leak-tracer')}
                    className="text-left hover:text-[#2457A7] transition-colors"
                  >
                    Forensic Leak Tracer
                  </button>
                  <button
                    onClick={() => navigate('/app/audit')}
                    className="text-left hover:text-[#2457A7] transition-colors"
                  >
                    Multi-Witness Audit
                  </button>
                  <button
                    onClick={() => navigate('/verify')}
                    className="text-left hover:text-[#2457A7] transition-colors text-[#2457A7] font-semibold inline-flex items-center gap-1"
                  >
                    <span>Public QR Verifier</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => navigate('/app/security-monitor')}
                    className="text-left hover:text-[#2457A7] transition-colors"
                  >
                    6-Layer Defense Console
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Col 3: Compliance & Legal (3 cols) */}
          <div className="md:col-span-3 space-y-2 text-[12px] text-[#59697C]">
            <span className="text-[12px] font-semibold text-[#172536] uppercase tracking-wider block">
              Governance & Compliance
            </span>
            <div className="space-y-1 leading-normal">
              <div className="flex items-center gap-1.5 text-[#16805D] font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DPDP Act 2023 Compliant</span>
              </div>
              <div>Zero-Knowledge Selective Disclosure Protocol</div>
              <div>Offline Public-Key Verification (Ed25519)</div>
              <div>Immutable Witness Checkpoint Registry</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal Disclaimer */}
        <div className="mt-5 pt-4 border-t border-[#D5DEE8] flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#8A9BA8]">
          <div>
            © 2026 APAAR-VERIFY · Smart India Hackathon 2026 Prototype · Problem Statement 26263 (Theme: Smart Automation)
          </div>
          <div className="font-mono">
            CONFIDENTIAL & RESTRICTED — PROTOTYPE SIMULATION ENVIRONMENT FOR SIH JUDGING
          </div>
        </div>
      </div>
    </footer>
  );
};
