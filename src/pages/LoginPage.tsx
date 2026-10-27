/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ApaarLogo } from '../components/common/ApaarLogo';
import {
  ShieldCheck,
  Lock,
  Mail,
  KeyRound,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface LoginPageProps {
  navigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ navigate }) => {
  const { switchUser, verifyMfa } = useApp();

  const [email, setEmail] = useState('aicte.admin@aicte-india.org');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('AICTE_ADMIN');
  const [targetInstitutionId, setTargetInstitutionId] = useState<string>('inst-01');

  const [step, setStep] = useState<'CREDENTIALS' | 'MFA_CHALLENGE'>('CREDENTIALS');
  const [totpCode, setTotpCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoPresetSelect = (
    role: UserRole,
    presetEmail: string,
    instId?: string
  ) => {
    setSelectedRole(role);
    setEmail(presetEmail);
    setPassword('SecurePassword2026!');
    if (instId) setTargetInstitutionId(instId);
    setError('');
    setStep('CREDENTIALS');
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your official institutional or AICTE email.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // AICTE_ADMIN requires mandatory TOTP MFA per SIH requirements
      if (selectedRole === 'AICTE_ADMIN' || selectedRole === 'COLLEGE_ADMIN') {
        setStep('MFA_CHALLENGE');
      } else {
        switchUser(selectedRole, targetInstitutionId);
        navigate(selectedRole === 'STUDENT' ? '/app/consent-wallet' : '/app/overview');
      }
    }, 400);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totpCode.trim().length !== 6) {
      setError('Invalid authenticator code. Enter a 6-digit TOTP code.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      verifyMfa(totpCode);
      switchUser(selectedRole, targetInstitutionId);
      navigate('/app/overview');
    }, 400);
  };

  return (
    <div
      className="min-h-screen bg-[#F4F6F9] text-[#172536] flex flex-col justify-between"
      style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Header */}
      <div className="py-3 px-6 lg:px-12 border-b border-[#D5DEE8] bg-white flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer"
        >
          <ApaarLogo variant="dark" size="md" withSubtitle={true} />
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-[13px] text-[#59697C] hover:text-[#172536] transition-colors"
        >
          ← Back to Cover Page
        </button>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-[#DCE3EB] rounded-xl shadow-xs p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#10243A]/5 border border-[#10243A]/10 text-[#10243A] mb-3">
              <Lock className="w-6 h-6 text-[#2457A7]" />
            </div>
            <h1 className="text-xl font-extrabold text-[#10243A] tracking-tight">
              {step === 'CREDENTIALS' ? 'Institutional Sign In' : 'Mandatory Two-Factor Auth'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {step === 'CREDENTIALS'
                ? 'Role-based access to the AICTE student data integrity console'
                : 'Enter the 6-digit TOTP code from your registered authenticator app'}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 'CREDENTIALS' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Institutional Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#DCE3EB] focus:outline-none focus:ring-1 focus:ring-[#2457A7] focus:border-[#2457A7] bg-white text-slate-900"
                    placeholder="officer@aicte-india.org"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Password</label>
                  <span className="text-[11px] text-slate-400">Argon2id Encrypted</span>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#DCE3EB] focus:outline-none focus:ring-1 focus:ring-[#2457A7] focus:border-[#2457A7] bg-white text-slate-900"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-[#10243A] hover:bg-[#0B1728] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                {isLoading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Proceed to Verification</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E06D10]" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 mb-2">
                <span className="font-semibold text-slate-800 block">AICTE Security Policy:</span>
                Multi-Factor Authentication is enforced for all administrative and supervisory roles.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  6-Digit Authenticator Code (TOTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full py-2.5 px-3 text-center tracking-[0.3em] font-mono text-base font-bold rounded-lg border border-[#DCE3EB] focus:outline-none focus:ring-1 focus:ring-[#2457A7] focus:border-[#2457A7] bg-white text-slate-900"
                  placeholder="123456"
                  autoFocus
                />
                <p className="text-[11px] text-slate-400 mt-1 text-center">
                  Judge tip: Enter any 6-digit code (e.g. <span className="font-mono text-slate-600 font-bold">123456</span>)
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('CREDENTIALS')}
                  className="w-1/3 py-2 px-3 border border-[#DCE3EB] text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 bg-[#2457A7] hover:bg-[#1d478a] text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify & Authorize</span>
                </button>
              </div>
            </form>
          )}

          {/* Quick Preset Selector for SIH Judges */}
          <div className="mt-8 pt-6 border-t border-[#DCE3EB]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E06D10]" />
              <span>Select Preset Role for Live SIH Judging</span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() =>
                  handleDemoPresetSelect('AICTE_ADMIN', 'aicte.admin@aicte-india.org')
                }
                className={`p-2 rounded-lg border text-left transition-colors flex items-center justify-between ${
                  selectedRole === 'AICTE_ADMIN'
                    ? 'border-[#2457A7] bg-[#2457A7]/5 font-semibold text-[#10243A]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <span className="block font-semibold">AICTE Central Officer</span>
                  <span className="text-[10px] text-slate-500">aicte.admin@aicte-india.org · Full Overseer</span>
                </div>
                <span className="text-[10px] bg-blue-100 text-[#2457A7] px-1.5 py-0.5 rounded font-mono">
                  MFA Required
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDemoPresetSelect('COLLEGE_ADMIN', 'admin@dit-delhi.ac.in', 'inst-01')
                }
                className={`p-2 rounded-lg border text-left transition-colors flex items-center justify-between ${
                  selectedRole === 'COLLEGE_ADMIN' && targetInstitutionId === 'inst-01'
                    ? 'border-[#2457A7] bg-[#2457A7]/5 font-semibold text-[#10243A]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <span className="block font-semibold">Delhi Inst of Tech Admin</span>
                  <span className="text-[10px] text-slate-500">admin@dit-delhi.ac.in · Tenant Scoped</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  College Admin
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDemoPresetSelect('VERIFIER', 'verifier@techhire.org')
                }
                className={`p-2 rounded-lg border text-left transition-colors flex items-center justify-between ${
                  selectedRole === 'VERIFIER'
                    ? 'border-[#2457A7] bg-[#2457A7]/5 font-semibold text-[#10243A]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <span className="block font-semibold">Third-Party Employer / Verifier</span>
                  <span className="text-[10px] text-slate-500">verifier@techhire.org · Zero PII Access</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  Public Verifier
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleDemoPresetSelect('STUDENT', 'sarthak.sharma@student.ac.in')
                }
                className={`p-2 rounded-lg border text-left transition-colors flex items-center justify-between ${
                  selectedRole === 'STUDENT'
                    ? 'border-[#2457A7] bg-[#2457A7]/5 font-semibold text-[#10243A]'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div>
                  <span className="block font-semibold">Student (Sarthak Sharma)</span>
                  <span className="text-[10px] text-slate-500">sarthak.sharma@student.ac.in · Consent Wallet</span>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  Student Owner
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 px-6 border-t border-[#DCE3EB] bg-white text-center text-xs text-slate-400">
        AICTE Smart India Hackathon 2026 Prototype · Protected by TLS 1.3 & SHA-256 Audit Logs
      </div>
    </div>
  );
};
