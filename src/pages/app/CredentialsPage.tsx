/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import { signCredentialPayload } from '../../utils/crypto';
import QRCode from 'qrcode';
import {
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export const CredentialsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { students } = useApp();

  const [selectedStudent, setSelectedStudent] = useState<Student>(students[4] || students[0]);
  const [issuedQrUrl, setIssuedQrUrl] = useState<string>('');
  const [issuedToken, setIssuedToken] = useState<string>('');
  const [issuedNotice, setIssuedNotice] = useState<string | null>(null);

  const handleIssueCredential = (stu: Student) => {
    setSelectedStudent(stu);

    const claims = {
      program: stu.courseName,
      academicSession: stu.academicSession,
      enrolmentStatus: stu.enrolmentStatus === 'ACTIVE' ? 'ENROLLED' : stu.enrolmentStatus,
      aicteApprovedClaim: true,
      institutionApprovalRef: `AICTE-${stu.institutionId.toUpperCase()}-2024`,
      issuer: 'AICTE National Trust Anchor',
      issuedAt: new Date().toISOString(),
    };

    const { jwtToken } = signCredentialPayload(claims);
    setIssuedToken(jwtToken);

    QRCode.toDataURL(jwtToken, { width: 220, margin: 1 }, (err, url) => {
      if (!err && url) {
        setIssuedQrUrl(url);
      }
    });

    setIssuedNotice(`Signed credential successfully generated for ${stu.name}. Zero PII encoded into payload.`);
  };

  return (
    <div className="space-y-5" style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight">
              Verifiable Credential Issuance
            </h1>
            <span className="text-xs font-semibold bg-[#E8F5E9] text-[#16805D] px-2.5 py-0.5 rounded-md border border-[#16805D]/30 font-mono">
              Privacy-Preserving
            </span>
          </div>
          <p className="text-[14px] text-[#59697C] mt-1">
            Issue cryptographically signed QR credentials containing only verified institutional claims. Zero PII is stored or transmitted in the credential payload.
          </p>
        </div>

        <button
          onClick={() => navigate('/verify')}
          className="px-3.5 py-1.5 bg-[#1673D1] hover:bg-[#105CB0] text-white text-[13px] font-medium rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <span>Open Public Verifier</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {issuedNotice && (
        <div className="p-3 bg-[#E8F5E9] border border-[#16805D]/30 rounded-md text-[13px] text-[#16805D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16805D] shrink-0" />
            <span>{issuedNotice}</span>
          </div>
          <button
            onClick={() => navigate('/verify')}
            className="font-semibold underline ml-4 hover:opacity-80 cursor-pointer"
          >
            Test in Public Verifier →
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Eligible Students List */}
        <div className="lg:col-span-7 bg-white border border-[#D5DEE8] rounded-md shadow-xs p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#D5DEE8]">
            <h3 className="text-[14px] font-semibold text-[#172536]">
              Eligible Enrolled Students ({students.length})
            </h3>
            <span className="text-[12px] text-[#59697C]">Select a candidate to generate signed QR</span>
          </div>

          <div className="divide-y divide-[#D5DEE8] max-h-[520px] overflow-y-auto">
            {students.slice(0, 8).map((stu) => {
              const isSelected = selectedStudent?.id === stu.id;
              return (
                <div
                  key={stu.id}
                  onClick={() => handleIssueCredential(stu)}
                  className={`p-3 cursor-pointer transition-colors text-[13px] flex items-center justify-between ${
                    isSelected ? 'bg-[#EBF1F8] border-l-4 border-l-[#1673D1]' : 'hover:bg-[#F9FAFC]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#172536]">{stu.name}</span>
                      <span className="text-[11px] font-mono text-[#59697C]">{stu.maskedApaar}</span>
                    </div>
                    <div className="text-[12px] text-[#59697C] mt-0.5">
                      {stu.courseName} · {stu.institutionName}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="px-2.5 py-1 bg-white hover:bg-[#1673D1] hover:text-white text-[#172536] border border-[#D5DEE8] rounded-md text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    Issue QR
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Generated Credential Preview */}
        <div className="lg:col-span-5 bg-white border border-[#D5DEE8] rounded shadow-xs p-5 flex flex-col justify-between text-center space-y-4">
          <div>
            <div className="pb-3 border-b border-[#D5DEE8] text-left">
              <span className="text-[11px] font-semibold text-[#59697C] uppercase tracking-wide block">
                Signed QR Credential Preview
              </span>
              <h3 className="text-[16px] font-semibold text-[#172536] mt-0.5">
                {selectedStudent ? selectedStudent.name : 'Select Student'}
              </h3>
            </div>

            {issuedQrUrl ? (
              <div className="py-4">
                <div className="p-3 bg-white border border-[#D5DEE8] rounded shadow-xs inline-block">
                  <img src={issuedQrUrl} alt="Credential QR" className="w-44 h-44 mx-auto" />
                </div>
                <div className="mt-3 text-[13px] text-[#172536]">
                  <span className="font-semibold text-[#16805D]">Signed with AICTE Ed25519 Root Key</span>
                  <p className="text-[12px] text-[#59697C] mt-0.5">Encodes Program, Academic Session, and Accreditation Claims.</p>
                </div>
              </div>
            ) : (
              <div className="py-20 text-[13px] text-[#59697C]">
                Click "Issue QR" on any enrolled student to generate their verifiable token.
              </div>
            )}
          </div>

          {issuedToken && (
            <div className="pt-3 border-t border-[#D5DEE8] text-left">
              <span className="text-[11px] text-[#59697C] font-semibold uppercase tracking-wide block mb-1">
                JWS Compact Token String:
              </span>
              <pre className="p-2.5 bg-[#10243A] text-[#A7F3D0] rounded text-[11px] font-mono truncate">
                {issuedToken}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
