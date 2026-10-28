/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditEvent, AuditCheckpoint } from '../../types';
import { Button } from '../../components/common/Button';
import {
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';

export const AuditPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const {
    auditEvents,
    auditCheckpoints,
    auditTamperedType,
    simulateSingleRecordTampering,
    simulateFullChainRewrite,
    restoreAuditBaseline,
    verifyAuditIntegrity,
  } = useApp();

  const [verificationResult, setVerificationResult] = useState<{
    chainValid: boolean;
    merkleValid: boolean;
    signatureValid: boolean;
    witnessValid: boolean;
    earliestBrokenEventId?: string;
    details: string;
  } | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(auditEvents[0]);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      const res = verifyAuditIntegrity();
      setVerificationResult(res);
    }, 400);
  };

  const checkpoint = auditCheckpoints[0];

  return (
    <div className="space-y-5" style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight">
              Tamper-Evident Audit Verification Ledger
            </h1>
            <span className="text-xs font-semibold bg-[#10243A] text-white px-2.5 py-0.5 rounded-[4px] font-mono">
              Audit Integrity
            </span>
          </div>
          <p className="text-[14px] text-[#59697C] mt-1">
            Append-only cryptographic event history, signed Merkle root checkpoints, and independent decentralized witness receipts.
          </p>
        </div>

        <Button
          onClick={handleRunVerification}
          loading={isVerifying}
          variant="success"
          size="md"
          icon={<ShieldCheck className="w-4 h-4" />}
        >
          {isVerifying ? 'Hashing Ledger...' : 'Verify Cryptographic Integrity'}
        </Button>
      </div>

      {/* Two-Stage Tampering Demo Control Section */}
      <div className="bg-white border border-[#D5DEE8] rounded-[4px] shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5DEE8]">
          <div>
            <h2 className="text-[15px] font-semibold text-[#172536] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C17B20]" />
              <span>Two-Stage Tampering Simulation & Witness Proof</span>
            </h2>
            <p className="text-[13px] text-[#59697C] mt-0.5">
              Simulate naive single-record tampering vs. sophisticated full-chain rewrite to demonstrate why local hash chains alone are insufficient without independent witness checkpoints.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {auditTamperedType !== 'NONE' && (
              <span className="text-[12px] font-semibold px-2.5 py-1 rounded-[4px] bg-[#FFEBEE] text-[#C43D43] border border-[#C43D43]/30 font-mono">
                SIMULATION ACTIVE: {auditTamperedType}
              </span>
            )}
            <Button
              onClick={restoreAuditBaseline}
              variant="secondary"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5 text-[#59697C]" />}
            >
              Restore Baseline Ledger
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Scenario A */}
          <div className="p-3.5 rounded-[4px] border border-[#D5DEE8] bg-[#FBFDFE] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[13px] text-[#172536]">Scenario A: Single-Record DB Edit</span>
                <span className="text-[11px] bg-[#FFEBEE] text-[#C43D43] px-2 py-0.5 rounded-[4px] border border-[#C43D43]/20 font-mono">
                  Naive Modification
                </span>
              </div>
              <p className="text-[13px] text-[#59697C] mt-1.5 leading-normal">
                Modifies payload of Event EVT-1003 directly in the database. The local SHA-256 hash chain immediately breaks at that exact block.
              </p>
            </div>
            <div className="mt-3">
              <Button
                onClick={simulateSingleRecordTampering}
                variant="destructive"
                size="sm"
                fullWidth
              >
                Simulate Single-Record Tampering
              </Button>
            </div>
          </div>

          {/* Scenario B */}
          <div className="p-3.5 rounded-[4px] border border-[#D5DEE8] bg-[#FBFDFE] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[13px] text-[#172536]">Scenario B: Sophisticated Full-Chain Rewrite</span>
                <span className="text-[11px] bg-[#FFF3E0] text-[#C17B20] px-2 py-0.5 rounded-[4px] border border-[#C17B20]/20 font-mono">
                  Chain Forgery
                </span>
              </div>
              <p className="text-[13px] text-[#59697C] mt-1.5 leading-normal">
                Attacker recalculates all subsequent local hashes to make the chain appear valid. Local checks pass, but comparison against external witness receipts exposes the forgery.
              </p>
            </div>
            <div className="mt-3">
              <Button
                onClick={simulateFullChainRewrite}
                variant="dark"
                size="sm"
                fullWidth
              >
                Simulate Full-Chain Rewrite
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Results Panel (if verified) */}
      {verificationResult && (
        <div
          className={`p-4 rounded border ${
            verificationResult.witnessValid
              ? 'bg-[#E8F5E9] border-[#16805D]/30 text-[#172536]'
              : 'bg-[#FFEBEE] border-[#C43D43]/30 text-[#172536]'
          }`}
        >
          <div className="flex items-start gap-3">
            {verificationResult.witnessValid ? (
              <CheckCircle2 className="w-5 h-5 text-[#16805D] shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-[#C43D43] shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <h3 className="text-[16px] font-semibold text-[#172536]">
                {verificationResult.witnessValid
                  ? 'Cryptographic Audit Integrity: 100% VERIFIED'
                  : 'AUDIT INTEGRITY COMPROMISED — FORGERY DETECTED'}
              </h3>
              <p className="text-[13px] text-[#59697C] mt-0.5 leading-normal">{verificationResult.details}</p>

              {/* 4 Multi-Layer Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#D5DEE8] text-[12px] font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-white border border-[#D5DEE8]">
                  <span className="text-[#59697C]">Hash Chain:</span>
                  <span className={`font-semibold ${verificationResult.chainValid ? 'text-[#16805D]' : 'text-[#C43D43]'}`}>
                    {verificationResult.chainValid ? 'VALID' : 'BROKEN'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white border border-[#D5DEE8]">
                  <span className="text-[#59697C]">Merkle Root:</span>
                  <span className={`font-semibold ${verificationResult.merkleValid ? 'text-[#16805D]' : 'text-[#C43D43]'}`}>
                    {verificationResult.merkleValid ? 'VALID' : 'MISMATCH'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white border border-[#D5DEE8]">
                  <span className="text-[#59697C]">Ed25519 Sig:</span>
                  <span className={`font-semibold ${verificationResult.signatureValid ? 'text-[#16805D]' : 'text-[#C43D43]'}`}>
                    {verificationResult.signatureValid ? 'VALID' : 'INVALID'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-white border border-[#D5DEE8]">
                  <span className="text-[#59697C]">Witness Receipt:</span>
                  <span className={`font-semibold ${verificationResult.witnessValid ? 'text-[#16805D]' : 'text-[#C43D43]'}`}>
                    {verificationResult.witnessValid ? 'CONSISTENT' : 'TAMPERED'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Merkle Checkpoint & Independent National Witnesses */}
      <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D5DEE8]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#172536]">Signed Merkle Checkpoint & Decentralized Witness Receipts</h2>
            <p className="text-[13px] text-[#59697C]">Anchored outside institutional infrastructure to prevent internal administrative tampering</p>
          </div>
          <span className="text-[12px] font-mono font-semibold bg-[#E6F3F2] text-[#168C83] px-2.5 py-1 rounded border border-[#168C83]/30">
            {checkpoint?.id || 'CHK-ROOT-ACTIVE'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[13px] font-mono">
          <div className="p-3 bg-[#FBFDFE] rounded border border-[#D5DEE8]">
            <span className="text-[11px] text-[#59697C] block font-sans">Coverage Period:</span>
            <span className="font-semibold text-[#172536]">{checkpoint?.timeRange}</span>
          </div>

          <div className="p-3 bg-[#FBFDFE] rounded border border-[#D5DEE8]">
            <span className="text-[11px] text-[#59697C] block font-sans">Merkle Root Hash:</span>
            <span className="font-semibold text-[#2457A7] truncate block" title={checkpoint?.merkleRoot}>
              {checkpoint?.merkleRoot.slice(0, 24)}...
            </span>
          </div>

          <div className="p-3 bg-[#FBFDFE] rounded border border-[#D5DEE8]">
            <span className="text-[11px] text-[#59697C] block font-sans">Signer Key ID:</span>
            <span className="font-semibold text-[#172536]">{checkpoint?.publicKeyId}</span>
          </div>
        </div>

        {/* Independent Witness Receipts */}
        <div className="space-y-2 pt-1">
          <span className="text-[12px] font-semibold text-[#172536] uppercase tracking-wide block">
            Independent Witness Acknowledgments:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
            {checkpoint?.witnessReceipts.map((w, idx) => (
              <div key={idx} className="p-2.5 rounded bg-[#FBFDFE] border border-[#D5DEE8] flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[#172536]">{w.witnessName}</div>
                  <div className="text-[11px] text-[#59697C] font-mono mt-0.5">
                    Receipt Sig: {w.signature.slice(0, 18)}...
                  </div>
                </div>
                <span className="text-[11px] font-mono text-[#16805D] bg-[#E8F5E9] px-2 py-0.5 rounded border border-[#16805D]/30 font-semibold">
                  WITNESSED
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Ledger Split: Left Stream (7 cols) | Right Canonical Inspector (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Col: Append-Only Event Hash Chain */}
        <div className="lg:col-span-7 bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D5DEE8]">
            <h3 className="text-[14px] font-semibold text-[#172536]">
              Cryptographic Event Stream ({auditEvents.length})
            </h3>
            <span className="text-[11px] text-[#59697C] font-mono">hash = SHA256(prev_hash || payload)</span>
          </div>

          <div className="divide-y divide-[#D5DEE8] max-h-[500px] overflow-y-auto">
            {auditEvents.map((ev) => {
              const isSelected = selectedEvent?.id === ev.id;
              const isCorrupted = ev.tampered;

              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-3 cursor-pointer transition-colors text-[13px] ${
                    isCorrupted
                      ? 'bg-[#FFEBEE] border-l-4 border-l-[#C43D43]'
                      : isSelected
                      ? 'bg-[#EBF1F8] border-l-4 border-l-[#2457A7]'
                      : 'hover:bg-[#F9FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-[#172536] text-[12px]">{ev.id}</span>
                      <span className="font-medium text-[#172536]">{ev.action}</span>
                    </div>
                    {isCorrupted && (
                      <span className="text-[10px] bg-[#C43D43] text-white font-mono px-1.5 py-0.2 rounded font-semibold">
                        CORRUPTED
                      </span>
                    )}
                  </div>

                  <div className="mt-1 font-mono text-[11px] text-[#59697C] space-y-0.5">
                    <div className="truncate">Prev: {ev.previousHash.slice(0, 24)}...</div>
                    <div className="truncate text-[#2457A7]">Hash: {ev.eventHash.slice(0, 24)}...</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Canonical Payload Inspector */}
        <div className="lg:col-span-5 bg-white border border-[#D5DEE8] rounded shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#D5DEE8]">
              <h3 className="text-[14px] font-semibold text-[#172536]">
                Canonical Event Payload Inspector
              </h3>
              <p className="text-[11px] text-[#59697C] font-mono mt-0.5">
                {selectedEvent?.id} · {selectedEvent?.timestamp.replace('T', ' ').slice(0, 19)} UTC
              </p>
            </div>

            {selectedEvent ? (
              <div className="mt-4 space-y-3 text-[13px]">
                <div>
                  <span className="text-[11px] text-[#59697C] block font-semibold">Actor & Role:</span>
                  <span className="font-mono font-semibold text-[#172536]">
                    {selectedEvent.actorRole} ({selectedEvent.actorId})
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#59697C] block font-semibold">Resource Affected:</span>
                  <span className="font-mono text-[#172536]">
                    {selectedEvent.resourceType} · {selectedEvent.resourceId}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-[#59697C] block font-semibold mb-1">
                    Canonical Payload (Alphabetically Key-Sorted):
                  </span>
                  <pre className="p-3 bg-[#10243A] text-[#A7F3D0] rounded text-[11px] font-mono overflow-x-auto max-h-56">
                    {JSON.stringify(selectedEvent.payload, null, 2)}
                  </pre>
                </div>

                <div className="p-2.5 bg-[#FBFDFE] rounded border border-[#D5DEE8] text-[11px] font-mono space-y-1">
                  <div className="text-[#59697C]">Previous Block Hash:</div>
                  <div className="text-[#172536] truncate">{selectedEvent.previousHash}</div>
                  <div className="mt-1 text-[#59697C]">Computed SHA-256 Digest:</div>
                  <div className="text-[#2457A7] truncate font-semibold">{selectedEvent.eventHash}</div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-[13px] text-[#59697C]">
                Select an event from the stream to inspect its cryptographic payload.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
