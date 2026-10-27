/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { SecurityBadge } from '../../components/common/SecurityBadge';
import { Radio } from 'lucide-react';

export const SecurityMonitorPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { securityIncidents, activeSession } = useApp();

  const layers = [
    {
      num: 1,
      title: 'Layer 1: Edge Infrastructure',
      subtitle: 'TLS 1.3 Termination, WAF Shield & DoS Throttling',
      status: 'OPTIMAL',
      statusColor: 'text-[#16805D] bg-[#E8F5E9] border-[#16805D]/30',
      lastCheck: '12s ago',
      metrics: '0 dropped packets · 120 req/min baseline rate limit',
      details: 'All incoming API requests are verified through edge gateway filters with strict payload size caps (max 10MB) and IP rate limiting.',
    },
    {
      num: 2,
      title: 'Layer 2: Identity & Access',
      subtitle: 'Mandatory TOTP MFA & Real-Time Risk Engine',
      status: activeSession.status === 'FROZEN' ? 'ALERT TRIGGERED' : 'ENFORCED',
      statusColor: activeSession.status === 'FROZEN' ? 'text-[#C43D43] bg-[#FFEBEE] border-[#C43D43]/30' : 'text-[#16805D] bg-[#E8F5E9] border-[#16805D]/30',
      lastCheck: 'Just now',
      metrics: 'MFA active for 100% of AICTE Officers & College Admins',
      details: 'Automated 4-tier security ladder monitors off-hours queries, sequential identifier scanning, and abnormal export volumes.',
    },
    {
      num: 3,
      title: 'Layer 3: API Gateway',
      subtitle: 'Tenant-Scoped RBAC & Strict Schema Validation',
      status: 'VERIFIED',
      statusColor: 'text-[#16805D] bg-[#E8F5E9] border-[#16805D]/30',
      lastCheck: '1m ago',
      metrics: 'Zero cross-tenant IDOR leakages permitted',
      details: 'Institution ID is derived exclusively from authenticated server-side session tokens, strictly preventing colleges from browsing rival records.',
    },
    {
      num: 4,
      title: 'Layer 4: Application Services',
      subtitle: 'Input Sanitization & Formula Injection Neutralization',
      status: 'ACTIVE',
      statusColor: 'text-[#16805D] bg-[#E8F5E9] border-[#16805D]/30',
      lastCheck: '2m ago',
      metrics: 'Dangerous leading prefixes (=, +, -, @) automatically deactivated',
      details: 'Strict CSV parsing protects against formula execution in spreadsheet software, combined with parameterized database queries.',
    },
    {
      num: 5,
      title: 'Layer 5: Data Governance',
      subtitle: 'APAAR PII Masking & Synthetic Canary Injections',
      status: 'PROTECTED',
      statusColor: 'text-[#16805D] bg-[#E8F5E9] border-[#16805D]/30',
      lastCheck: '4m ago',
      metrics: 'APAAR masked (XXXX-XXXX-XXXX) by default · 3-5 Canaries / Export',
      details: 'Every student export is forensically watermarked with synthetic honeytoken records and permutation fingerprints for leak attribution.',
    },
    {
      num: 6,
      title: 'Layer 6: Audit & Detection',
      subtitle: 'Multi-Witness SHA-256 Hash Chains & Merkle Roots',
      status: 'SEALED',
      statusColor: 'text-[#16805D] bg-[#E8F5E9] border-[#16805D]/30',
      lastCheck: '5m ago',
      metrics: '100% of state-changing operations hash-chained & witnessed',
      details: 'Signed Merkle checkpoints anchored with decentralized national witness receipts, exposing single-row edits and full-chain rewrites.',
    },
  ];

  return (
    <div className="space-y-5" style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight">
              Module 4 — Six-Layer Cybersecurity Operations Console
            </h1>
            <span className="text-xs font-semibold bg-[#10243A] text-white px-2.5 py-0.5 rounded font-mono">
              Defense-in-Depth
            </span>
          </div>
          <p className="text-[14px] text-[#59697C] mt-1">
            Real-time infrastructure telemetry, automated security response ladder, and tenant isolation governance across all access tiers.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/attack-simulator')}
          className="px-4 py-2 bg-[#C43D43] hover:bg-[#b0353a] text-white text-[13px] font-medium rounded transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Radio className="w-4 h-4" />
          <span>Launch Red Team Attack Simulator</span>
        </button>
      </div>

      {/* Automated Response Ladder Specification Bar */}
      <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-5">
        <h2 className="text-[14px] font-semibold text-[#172536] mb-3">
          Automated Risk Score Escalation Ladder
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[13px]">
          <div className="p-3 bg-[#FBFDFE] border border-[#D5DEE8] rounded">
            <div className="flex items-center justify-between font-mono font-semibold">
              <span className="text-[#172536]">Score 30+</span>
              <span className="text-[#2457A7] text-[11px]">TIER 1</span>
            </div>
            <div className="font-semibold text-[#172536] mt-1">Warning & Audit Event</div>
            <p className="text-[12px] text-[#59697C] mt-0.5">Logs off-hours access or high-volume query in immutable audit chain.</p>
          </div>

          <div className="p-3 bg-[#FFF3E0] border border-[#C17B20]/30 rounded">
            <div className="flex items-center justify-between font-mono font-semibold">
              <span className="text-[#C17B20]">Score 50+</span>
              <span className="text-[#C17B20] text-[11px]">TIER 2</span>
            </div>
            <div className="font-semibold text-[#172536] mt-1">Step-Up MFA Challenge</div>
            <p className="text-[12px] text-[#59697C] mt-0.5">Enforces immediate re-authentication with 6-digit TOTP token.</p>
          </div>

          <div className="p-3 bg-[#FFF3E0] border border-[#C17B20]/30 rounded">
            <div className="flex items-center justify-between font-mono font-semibold">
              <span className="text-[#C17B20]">Score 70+</span>
              <span className="text-[#C17B20] text-[11px]">TIER 3</span>
            </div>
            <div className="font-semibold text-[#172536] mt-1">Rate Throttling Enforced</div>
            <p className="text-[12px] text-[#59697C] mt-0.5">Throttles API bandwidth to 2 req/min to mitigate bulk record extraction.</p>
          </div>

          <div className="p-3 bg-[#FFEBEE] border border-[#C43D43]/30 rounded">
            <div className="flex items-center justify-between font-mono font-semibold">
              <span className="text-[#C43D43]">Score 90+</span>
              <span className="text-[#C43D43] text-[11px]">TIER 4</span>
            </div>
            <div className="font-semibold text-[#172536] mt-1">Session Freeze & Revocation</div>
            <p className="text-[12px] text-[#59697C] mt-0.5">Server-side session destroyed. All subsequent queries hard-denied (HTTP 403).</p>
          </div>
        </div>
      </div>

      {/* Six Defense Layers (Structured Grid Without Glowing Borders) */}
      <div className="space-y-3">
        <h2 className="text-[15px] font-semibold text-[#172536]">
          Defense-in-Depth Layered Architecture
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {layers.map((layer) => (
            <div
              key={layer.num}
              className="p-4 bg-white border border-[#D5DEE8] rounded shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D5DEE8]">
                  <span className="text-[12px] font-semibold text-[#2457A7]">{layer.title}</span>
                  <SecurityBadge
                    level={layer.status === 'ALERT TRIGGERED' ? 'critical' : 'secure'}
                    size="xs"
                    pulse={layer.status === 'ALERT TRIGGERED'}
                  >
                    {layer.status}
                  </SecurityBadge>
                </div>

                <h3 className="text-[14px] font-semibold text-[#172536] leading-snug">{layer.subtitle}</h3>
                <p className="text-[13px] text-[#59697C] mt-2 leading-normal">{layer.details}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#D5DEE8] text-[12px] text-[#59697C] font-mono flex items-center justify-between">
                <span>Checked: {layer.lastCheck}</span>
                <span className="text-[#8A9BA8]">Layer {layer.num}/6</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Incidents Log */}
      <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D5DEE8]">
          <div>
            <h3 className="text-[16px] font-semibold text-[#172536]">Live Security Incidents Log</h3>
            <p className="text-[13px] text-[#59697C] mt-0.5">Automated mitigation triggers recorded into cryptographic audit</p>
          </div>
          <span className="text-[12px] font-mono font-semibold text-[#991B1B] bg-[#FEF2F2] px-2.5 py-0.5 rounded border border-[#DC2626]/30">
            {securityIncidents.length} Recorded
          </span>
        </div>

        <div className="divide-y divide-[#D5DEE8]">
          {securityIncidents.map((inc) => (
            <div key={inc.id} className="py-3 text-[13px] flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-[#172536] text-[12px]">{inc.id}</span>
                  <span className="font-semibold text-[#172536]">{inc.title}</span>
                  <SecurityBadge
                    level={inc.severity === 'CRITICAL' ? 'critical' : 'warning'}
                    size="xs"
                    pulse={inc.severity === 'CRITICAL'}
                  >
                    {inc.severity}
                  </SecurityBadge>
                </div>
                <p className="text-[13px] text-[#59697C] mt-1 leading-normal">{inc.description}</p>
                <div className="text-[12px] text-[#8A9BA8] font-mono mt-1 flex items-center gap-3">
                  <span>Actor: {inc.actorEmail}</span>
                  <span>·</span>
                  <span>Action: {inc.actionTaken}</span>
                </div>
              </div>
              <span className="text-[11px] text-[#8A9BA8] font-mono shrink-0">
                {inc.timestamp.replace('T', ' ').slice(0, 19)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
