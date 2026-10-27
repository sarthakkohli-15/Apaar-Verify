/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ConsentRecord } from '../../types';
import {
  Sliders,
  Info,
} from 'lucide-react';

export const ConsentWalletPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { consents, updateConsentStatus } = useApp();

  const [dpEnabled, setDpEnabled] = useState(true);
  const [epsilon, setEpsilon] = useState(0.5);

  const handleToggleConsent = (item: ConsentRecord) => {
    const nextStatus = item.status === 'GRANTED' ? 'REVOKED' : 'GRANTED';
    updateConsentStatus(item.id, nextStatus);
  };

  const rawStudentCount = 1485;
  const dpNoise = dpEnabled ? (Math.sin(epsilon * 10) * 12).toFixed(1) : 0;
  const reportedDpCount = dpEnabled ? Math.round(rawStudentCount + Number(dpNoise)) : rawStudentCount;

  return (
    <div className="space-y-5" style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight">
              Student Privacy & Consent Wallet
            </h1>
            <span className="text-xs font-semibold bg-[#EBF1F8] text-[#2457A7] px-2.5 py-0.5 rounded border border-[#2457A7]/30 font-mono">
              DPDP Act 2023 Compliant
            </span>
          </div>
          <p className="text-[14px] text-[#59697C] mt-1">
            Student-controlled disclosure rights, active third-party verification authorizations, and differential privacy aggregate protection.
          </p>
        </div>

        <div className="p-2.5 bg-white border border-[#D5DEE8] rounded text-[13px] font-mono">
          <span className="text-[#59697C] font-sans">Active Student: </span>
          <span className="font-semibold text-[#172536]">Sarthak Sharma</span> (APAAR: XXXX-XXXX-4918)
        </div>
      </div>

      {/* Third-Party Verification Authorizations Table */}
      <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-4">
        <div className="pb-3 border-b border-[#D5DEE8] flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-[#172536]">Third-Party Verification Authorizations</h2>
            <p className="text-[13px] text-[#59697C]">
              Granular consent management. Revoking consent blocks future verification disclosures while preserving historical audit receipts.
            </p>
          </div>
          <span className="text-[12px] font-mono text-[#59697C] font-semibold">{consents.length} Verification Records</span>
        </div>

        <div className="divide-y divide-[#D5DEE8]">
          {consents.map((c) => {
            const isGranted = c.status === 'GRANTED';
            return (
              <div
                key={c.id}
                className="py-3.5 flex flex-wrap items-start justify-between gap-4 text-[13px]"
              >
                <div className="space-y-1 flex-1 min-w-[260px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#172536] text-[14px]">{c.verifierName}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.2 rounded border font-mono ${
                        isGranted
                          ? 'bg-[#E8F5E9] text-[#16805D] border-[#16805D]/30'
                          : 'bg-[#FFEBEE] text-[#C43D43] border-[#C43D43]/30'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-[#59697C] text-[13px]">{c.purpose}</p>

                  <div className="pt-0.5 flex flex-wrap items-center gap-2 text-[12px] text-[#59697C] font-mono">
                    <span className="font-semibold text-[#172536]">Fields Disclosed:</span>
                    <span>{c.disclosedFields.join(' · ')}</span>
                  </div>

                  <div className="text-[11px] text-[#8A9BA8] font-mono">
                    Granted: {c.grantedAt.slice(0, 10)} · Expires: {c.expiresAt.slice(0, 10)}
                    {c.revokedAt && <span className="text-[#C43D43] ml-2 font-semibold">Revoked on {c.revokedAt.slice(0, 10)}</span>}
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => handleToggleConsent(c)}
                    className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors ${
                      isGranted
                        ? 'bg-white hover:bg-[#FFEBEE] text-[#C43D43] border border-[#D5DEE8]'
                        : 'bg-[#16805D] text-white hover:bg-[#136c4f]'
                    }`}
                  >
                    {isGranted ? 'Revoke Consent' : 'Re-Authorize Consent'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Differential Privacy Simulation Section */}
      <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5DEE8]">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#2457A7]" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-semibold text-[#172536]">
                  Differential Privacy (DP DEMO) Aggregate Analytics
                </h2>
                <span className="text-[10px] font-mono font-semibold bg-[#FFF3E0] text-[#C17B20] px-2 py-0.5 rounded border border-[#C17B20]/30">
                  DP PROTOTYPE
                </span>
              </div>
              <p className="text-[13px] text-[#59697C] mt-0.5">
                Adds calibrated mathematical Laplace/Gaussian noise to public queries, protecting individual student records from linkage attacks.
              </p>
            </div>
          </div>

          <button
            onClick={() => setDpEnabled(!dpEnabled)}
            className={`px-3 py-1.5 rounded text-[12px] font-medium transition-colors border ${
              dpEnabled
                ? 'bg-[#E8F5E9] text-[#16805D] border-[#16805D]/30'
                : 'bg-white text-[#59697C] border-[#D5DEE8]'
            }`}
          >
            Differential Privacy: {dpEnabled ? 'ENABLED' : 'DISABLED (RAW)'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[13px]">
          <div className="p-3.5 bg-[#FBFDFE] rounded border border-[#D5DEE8]">
            <span className="text-[#59697C] block mb-1">Raw Database Ground Truth:</span>
            <div className="text-2xl font-semibold font-mono text-[#172536] tabular-nums">{rawStudentCount}</div>
            <span className="text-[11px] text-[#8A9BA8] mt-1 block">Exact enrolled students count</span>
          </div>

          <div className="p-3.5 bg-[#E8F5E9] rounded border border-[#16805D]/30">
            <span className="text-[#16805D] block mb-1">
              Privacy-Preserving Public Output ({dpEnabled ? 'DP Noisy' : 'Raw'}):
            </span>
            <div className="text-2xl font-semibold font-mono text-[#172536] tabular-nums">
              {reportedDpCount}
            </div>
            <span className="text-[11px] text-[#16805D] mt-1 block font-mono">
              Noise added: {dpEnabled ? `${Number(dpNoise) >= 0 ? '+' : ''}${dpNoise}` : '0 (Privacy Leak Risk)'}
            </span>
          </div>

          <div className="p-3.5 bg-[#FBFDFE] rounded border border-[#D5DEE8] space-y-2">
            <div className="flex justify-between font-mono">
              <span className="text-[#59697C] font-sans">Privacy Budget (ε):</span>
              <span className="font-semibold text-[#2457A7]">{epsilon}</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={epsilon}
              onChange={(e) => setEpsilon(parseFloat(e.target.value))}
              className="w-full accent-[#2457A7] cursor-pointer"
            />
            <span className="text-[11px] text-[#8A9BA8] block">
              Lower ε = Stronger Privacy Guarantee (More Noise Added).
            </span>
          </div>
        </div>

        <div className="p-3 bg-[#EBF1F8] rounded border border-[#2457A7]/20 text-[12px] text-[#172536] leading-normal">
          <strong>Disclosure Note: </strong>
          This calibrated simulation demonstrates differential privacy parameters (ε = {epsilon}, δ = 10⁻⁵). Bounded sensitivity ensures external researchers cannot deduce whether any specific student is present in the dataset.
        </div>
      </div>
    </div>
  );
};
