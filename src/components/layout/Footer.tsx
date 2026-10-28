/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ApaarLogo } from '../common/ApaarLogo';
import { ShieldCheck, Lock, ExternalLink, Activity, Building2 } from 'lucide-react';

interface FooterProps {
  navigate?: (path: string) => void;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ navigate, className = '' }) => {
  return (
    <footer
      className={`border-t border-[#DCE7F2] bg-white text-[#17324F] mt-auto select-none ${className}`}
      style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Top Status & Telemetry Bar */}
      <div className="bg-[#EDF5FC] border-b border-[#DCE7F2] px-5 py-2.5 text-[12px] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 font-mono text-[#40566E]">
          <span className="flex items-center gap-1.5 text-[#16845B] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#16845B] animate-pulse" />
            LIVE REGISTRY STATUS: 100% OPERATIONAL
          </span>
          <span className="hidden sm:inline text-[#DCE7F2]">|</span>
          <span className="hidden sm:inline">Node: DEL-AICTE-01</span>
          <span className="hidden md:inline text-[#DCE7F2]">|</span>
          <span className="hidden md:inline">Ed25519 Root Key Verified</span>
          <span className="hidden lg:inline text-[#DCE7F2]">|</span>
          <span className="hidden lg:inline">Hash Chain Height: 1,024 Blocks</span>
        </div>

        <div className="flex items-center gap-3 text-[11.5px] font-mono text-[#40566E]">
          <span className="bg-[#EAF4FF] text-[#1673D1] px-2 py-0.5 rounded border border-[#C5DCFA] font-bold">
            SIH 2026 · PS 26263
          </span>
          <span className="text-[#17324F] font-bold">Team Algo Shifters</span>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-[1560px] mx-auto px-5 py-7">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Col 1: Brand & Ministry Context (5 cols) */}
          <div className="md:col-span-5 space-y-2.5">
            <ApaarLogo size="sm" withSubtitle={true} variant="dark" />
            <p className="text-[13px] text-[#40566E] leading-relaxed pt-1 max-w-md">
              True-Trace is a student data management and verification platform for AICTE-approved institutions, providing centralized intake monitoring, anomaly detection, and tamper-evident audit trails.
            </p>
            <div className="flex items-center gap-2 text-[11.5px] text-[#71849A] pt-1">
              <span>All India Council for Technical Education (AICTE)</span>
              <span>·</span>
              <span>Ministry of Education, Govt. of India</span>
            </div>
          </div>

          {/* Col 2: Navigation & Quick Portals (4 cols) */}
          <div className="md:col-span-4 space-y-2.5">
            <span className="text-[12px] font-bold text-[#17324F] uppercase tracking-wider block">
              Core Security & Integrity Services
            </span>
            <div className="grid grid-cols-2 gap-2 text-[13px] text-[#40566E]">
              {navigate && (
                <>
                  <button
                    onClick={() => navigate('/institution/register')}
                    className="text-left text-[#1673D1] font-semibold hover:underline transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Register Institution</span>
                  </button>
                  <button
                    onClick={() => navigate('/app/overview')}
                    className="text-left hover:text-[#1673D1] transition-colors cursor-pointer"
                  >
                    Central AICTE Dashboard
                  </button>
                  <button
                    onClick={() => navigate('/app/analysis')}
                    className="text-left hover:text-[#1673D1] transition-colors cursor-pointer"
                  >
                    Impossibility Engine
                  </button>
                  <button
                    onClick={() => navigate('/app/leak-tracer')}
                    className="text-left hover:text-[#1673D1] transition-colors cursor-pointer"
                  >
                    Forensic Leak Tracer
                  </button>
                  <button
                    onClick={() => navigate('/app/audit')}
                    className="text-left hover:text-[#1673D1] transition-colors cursor-pointer"
                  >
                    Multi-Witness Audit
                  </button>
                  <button
                    onClick={() => navigate('/verify')}
                    className="text-left hover:text-[#1673D1] transition-colors text-[#1673D1] font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Public QR Verifier</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Col 3: Compliance & Legal (3 cols) */}
          <div className="md:col-span-3 space-y-2 text-[12.5px] text-[#40566E]">
            <span className="text-[12px] font-bold text-[#17324F] uppercase tracking-wider block">
              Governance & Compliance
            </span>
            <div className="space-y-1 leading-relaxed">
              <div className="flex items-center gap-1.5 text-[#16845B] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>DPDP Act 2023 Compliant</span>
              </div>
              <div>Zero-Knowledge Selective Disclosure Protocol</div>
              <div>Offline Public-Key Verification (Ed25519)</div>
              <div>Immutable Witness Checkpoint Registry</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Legal Disclaimer */}
        <div className="mt-6 pt-4 border-t border-[#DCE7F2] flex flex-wrap items-center justify-between gap-3 text-[11.5px] text-[#71849A]">
          <div>
            © 2026 True-Trace · Smart India Hackathon 2026 Prototype · Problem Statement 26263 (Theme: Smart Automation)
          </div>
          <div className="font-mono">
            CONFIDENTIAL & RESTRICTED — PROTOTYPE SIMULATION ENVIRONMENT FOR SIH JUDGING
          </div>
        </div>
      </div>
    </footer>
  );
};
