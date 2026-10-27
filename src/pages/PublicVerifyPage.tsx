/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  signCredentialPayload,
  verifyCredentialSignature,
} from '../utils/crypto';
import { ApaarLogo } from '../components/common/ApaarLogo';
import { Footer } from '../components/layout/Footer';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const PublicVerifyPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const initialValidClaims = {
    program: 'B.Tech Computer Science & Engineering',
    academicSession: '2024-2028',
    enrolmentStatus: 'ENROLLED',
    aicteApprovedClaim: true,
    institutionApprovalRef: 'AICTE-DELHI-2024-9912',
    issuer: 'AICTE National Trust Anchor',
    issuedAt: '2026-10-20T10:00:00Z',
  };

  const [claims, setClaims] = useState(initialValidClaims);
  const [token, setToken] = useState<string>('');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    claims?: Record<string, any>;
    error?: string;
  } | null>(null);

  const generateSignedCredential = (claimsToSign: Record<string, any>) => {
    const { jwtToken } = signCredentialPayload(claimsToSign);
    setToken(jwtToken);
    QRCode.toDataURL(jwtToken, { width: 220, margin: 1 }, (err, url) => {
      if (!err && url) {
        setQrCodeDataUrl(url);
      }
    });

    const res = verifyCredentialSignature(jwtToken);
    setVerificationResult(res);
  };

  useEffect(() => {
    generateSignedCredential(initialValidClaims);
  }, []);

  const handleVerifyCurrentToken = () => {
    const res = verifyCredentialSignature(token);
    setVerificationResult(res);
  };

  const handleTamperToken = () => {
    try {
      const parts = token.split('.');
      if (parts.length === 4) {
        const decoded = JSON.parse(decodeURIComponent(escape(atob(parts[2]))));
        decoded.enrolmentStatus = 'GRADUATED_WITH_HONORS (TAMPERED)';
        decoded.aicteApprovedClaim = false;

        const tamperedBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(decoded))));
        const tamperedToken = `apaar.v1.${tamperedBase64}.${parts[3]}`;

        setToken(tamperedToken);

        QRCode.toDataURL(tamperedToken, { width: 220, margin: 1 }, (err, url) => {
          if (!err && url) setQrCodeDataUrl(url);
        });

        const res = verifyCredentialSignature(tamperedToken);
        setVerificationResult(res);
      }
    } catch (e: any) {
      setVerificationResult({ valid: false, error: e.message });
    }
  };

  const handleResetValid = () => {
    setClaims(initialValidClaims);
    generateSignedCredential(initialValidClaims);
  };

  return (
    <div
      className="min-h-screen bg-[#F4F6F9] text-[#172536] flex flex-col justify-between"
      style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Top Header */}
      <header className="py-3 px-6 lg:px-12 border-b border-[#D5DEE8] bg-white flex items-center justify-between">
        <div onClick={() => navigate('/')} className="cursor-pointer">
          <ApaarLogo variant="dark" size="md" withSubtitle={true} />
        </div>
        <div className="flex items-center gap-4 text-[13px]">
          <button onClick={() => navigate('/login')} className="text-[#2457A7] font-semibold hover:underline">
            AICTE Portal Login →
          </button>
        </div>
      </header>

      {/* Main Body Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 space-y-5">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5E9] border border-[#16805D]/30 text-[#16805D] text-[12px] font-semibold rounded">
            <Lock className="w-3.5 h-3.5" />
            <span>Privacy-Preserving Public Verifier · Offline Cryptographic Public-Key Check</span>
          </div>
          <h1 className="text-[28px] font-semibold text-[#172536] tracking-tight">
            Verify AICTE Student Credential
          </h1>
          <p className="text-[14px] text-[#59697C] max-w-lg mx-auto">
            Inspect digitally signed credentials issued to students. Verifies AICTE public-key signatures offline with zero PII exposure (no name, no DOB, no full APAAR ID).
          </p>
        </div>

        {/* Interactive Tamper Simulation Bar */}
        <div className="p-4 bg-white border border-[#D5DEE8] rounded shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[14px] font-semibold text-[#172536]">
              <Sparkles className="w-4 h-4 text-[#C17B20]" />
              <span>Interactive Verification Demo</span>
            </div>
            <p className="text-[12px] text-[#59697C] mt-0.5">
              Demonstrate that any unauthorized modification to signed claims causes an immediate cryptographic signature failure.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTamperToken}
              className="px-3.5 py-1.5 bg-[#C43D43] hover:bg-[#b0353a] text-white rounded text-[13px] font-medium transition-colors"
            >
              Simulate Claim Tampering
            </button>
            <button
              onClick={handleResetValid}
              className="px-3.5 py-1.5 bg-white hover:bg-[#F4F6F9] text-[#172536] border border-[#D5DEE8] rounded text-[13px] font-medium transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#59697C]" />
              <span>Reset Valid</span>
            </button>
          </div>
        </div>

        {/* Split Grid: Left QR & Token | Right Verification Dossier */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Left Column: QR Code & Token Payload */}
          <div className="md:col-span-5 bg-white border border-[#D5DEE8] rounded shadow-xs p-5 flex flex-col items-center justify-between text-center space-y-4">
            <div>
              <span className="text-[12px] font-semibold text-[#59697C] uppercase tracking-wide block mb-3">
                Verifiable QR Credential
              </span>

              {qrCodeDataUrl ? (
                <div className="p-2.5 bg-white border border-[#D5DEE8] rounded shadow-xs inline-block">
                  <img src={qrCodeDataUrl} alt="Signed Credential QR" className="w-44 h-44 mx-auto" />
                </div>
              ) : (
                <div className="w-44 h-44 bg-[#F4F6F9] rounded flex items-center justify-center text-[13px] text-[#8A9BA8]">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="w-full text-left space-y-1.5">
              <span className="text-[11px] text-[#59697C] font-semibold uppercase tracking-wide block">
                Signed Token Payload (JWS Format):
              </span>
              <textarea
                rows={3}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full p-2 text-[10px] font-mono rounded bg-[#10243A] text-[#A7F3D0] border border-[#D5DEE8] focus:outline-none"
              />
              <button
                onClick={handleVerifyCurrentToken}
                className="w-full mt-1.5 py-1.5 bg-[#2457A7] text-white text-[13px] font-medium rounded hover:bg-[#3169B5] transition-colors"
              >
                Re-Verify Token Signature
              </button>
            </div>
          </div>

          {/* Right Column: Verification Findings & Claims */}
          <div className="md:col-span-7 bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-4">
            <div>
              <span className="text-[12px] font-semibold text-[#59697C] uppercase tracking-wide block mb-2">
                Public-Key Cryptographic Verdict
              </span>

              {verificationResult?.valid ? (
                <div className="p-3.5 bg-[#E8F5E9] border border-[#16805D]/30 rounded text-[#172536] space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-[#16805D]" />
                    <span className="text-[15px] font-semibold text-[#16805D]">DIGITAL SIGNATURE VALID & UNTOUCHED</span>
                  </div>
                  <p className="text-[13px] text-[#59697C] leading-normal">
                    Cryptographic signature matches the AICTE National Trust Anchor public key (Ed25519 root). All claims are authentic and unmodified.
                  </p>
                </div>
              ) : (
                <div className="p-3.5 bg-[#FFEBEE] border border-[#C43D43]/30 rounded text-[#172536] space-y-1">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-[#C43D43]" />
                    <span className="text-[15px] font-semibold text-[#C43D43]">INVALID SIGNATURE — TAMPER DETECTED</span>
                  </div>
                  <p className="text-[13px] text-[#59697C] leading-normal">
                    {verificationResult?.error || 'Signature verification failed. The claims in this credential payload have been altered or forged.'}
                  </p>
                </div>
              )}
            </div>

            {/* Disclosed Claims Table (Unboxed Presentation) */}
            <div className="space-y-2">
              <h3 className="text-[13px] font-semibold text-[#172536] uppercase tracking-wide">
                Disclosed Claims in Credential
              </h3>

              <div className="divide-y divide-[#D5DEE8] text-[13px] border border-[#D5DEE8] rounded bg-[#FBFDFE]">
                <div className="flex justify-between py-2 px-3">
                  <span className="text-[#59697C]">Program of Study:</span>
                  <span className="font-semibold text-[#172536]">{verificationResult?.claims?.program || claims.program}</span>
                </div>
                <div className="flex justify-between py-2 px-3">
                  <span className="text-[#59697C]">Academic Session:</span>
                  <span className="font-semibold text-[#172536]">{verificationResult?.claims?.academicSession || claims.academicSession}</span>
                </div>
                <div className="flex justify-between py-2 px-3">
                  <span className="text-[#59697C]">Enrolment Status:</span>
                  <span className={`font-semibold ${verificationResult?.valid ? 'text-[#16805D]' : 'text-[#C43D43]'}`}>
                    {verificationResult?.claims?.enrolmentStatus || claims.enrolmentStatus}
                  </span>
                </div>
                <div className="flex justify-between py-2 px-3">
                  <span className="text-[#59697C]">AICTE Approval Claim:</span>
                  <span className="font-semibold text-[#16805D]">
                    {String(verificationResult?.claims?.aicteApprovedClaim ?? claims.aicteApprovedClaim).toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between py-2 px-3">
                  <span className="text-[#59697C]">Approval Reference:</span>
                  <span className="text-[#172536] font-mono">{verificationResult?.claims?.institutionApprovalRef || claims.institutionApprovalRef}</span>
                </div>
              </div>

              {/* Zero-PII Guarantee Note */}
              <div className="p-3 bg-[#EBF1F8] border border-[#2457A7]/20 rounded text-[12px] text-[#172536] leading-normal mt-3">
                <strong>Zero-PII Guarantee: </strong>
                In accordance with AICTE privacy regulations, this verifiable QR credential contains no student name, no date of birth, and no 12-digit APAAR ID. It provides cryptographic proof of enrollment and accreditation without leaking personal data.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Government Footer */}
      <Footer navigate={navigate} />
    </div>
  );
};
