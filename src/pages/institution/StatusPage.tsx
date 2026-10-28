/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Institution } from '../../types';
import { ApaarLogo } from '../../components/common/ApaarLogo';
import { Footer } from '../../components/layout/Footer';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Building2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const StatusPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { institutions } = useApp();
  const [searchQuery, setSearchQuery] = useState('1-495867123'); // Default to a pending one
  const [foundInst, setFoundInst] = useState<Institution | null>(institutions.find(i => i.aicteIdentifier === '1-495867123') || institutions[0]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const match = institutions.find(
      i =>
        i.aicteIdentifier.toLowerCase().includes(query) ||
        i.officialName.toLowerCase().includes(query) ||
        i.officialEmail.toLowerCase().includes(query)
    );
    setFoundInst(match || null);
  };

  const statusSteps = ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'ACTIVE'];

  return (
    <div
      className="min-h-screen bg-[#F4F8FC] text-[#17324F] flex flex-col justify-between font-sans"
      style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
    >
      <header className="py-3 px-6 lg:px-12 border-b border-[#DCE7F2] bg-white flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div onClick={() => navigate('/')} className="cursor-pointer">
          <ApaarLogo variant="dark" size="md" withSubtitle={true} />
        </div>
        <div className="flex items-center gap-4 text-[13.5px]">
          <button onClick={() => navigate('/institution/register')} className="text-[#40566E] hover:text-[#1673D1] font-medium transition-colors cursor-pointer">
            New Institution Registration
          </button>
          <button onClick={() => navigate('/login')} className="text-[#1673D1] font-semibold hover:underline cursor-pointer">
            Portal Sign In →
          </button>
        </div>
      </header>

      <div className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-8">
        <div className="bg-white border border-[#DCE3EB] rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-[#10243A]">Institution Application Status Tracker</h1>
            <p className="text-xs text-slate-500 mt-1">
              Search by AICTE Permanent ID, Institution Name, or Registered Institutional Email.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 mb-8">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter AICTE Identifier (e.g. 1-495867123) or College Name"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#DCE3EB] focus:ring-1 focus:ring-[#2457A7] focus:border-[#2457A7] text-slate-900"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#10243A] hover:bg-[#0B1728] text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {foundInst ? (
            <div className="border border-[#DCE3EB] rounded-lg p-5 bg-[#F5F7FA]">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#DCE3EB]">
                <div>
                  <h2 className="text-base font-bold text-slate-900">{foundInst.officialName}</h2>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 font-mono">
                    <span>AICTE ID: {foundInst.aicteIdentifier}</span>
                    <span>·</span>
                    <span>{foundInst.city}, {foundInst.state}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-[#DCE3EB]">
                  {foundInst.registrationStatus === 'ACTIVE' || foundInst.registrationStatus === 'APPROVED' ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : foundInst.registrationStatus === 'REJECTED' ? (
                    <XCircle className="w-3.5 h-3.5 text-red-600" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                  )}
                  <span className="font-mono">{foundInst.registrationStatus}</span>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="py-6">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
                  Application Lifecycle Progress
                </div>
                <div className="grid grid-cols-4 gap-2 text-center relative">
                  {statusSteps.map((step, idx) => {
                    const currentIdx = foundInst.registrationStatus === 'REJECTED' ? 1 : statusSteps.indexOf(foundInst.registrationStatus);
                    const isPassed = currentIdx >= idx;
                    const isCurrent = currentIdx === idx;

                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                            isCurrent
                              ? 'bg-[#2457A7] text-white ring-4 ring-[#2457A7]/20'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isPassed && !isCurrent ? '✓' : idx + 1}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-700 mt-2">{step.replace('_', ' ')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Review Notes from AICTE */}
              {foundInst.reviewNote && (
                <div className="mt-2 p-3 bg-white rounded border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-800 block mb-0.5">AICTE Scrutiny Note:</span>
                  <p className="text-slate-600 leading-relaxed">{foundInst.reviewNote}</p>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-5 pt-4 border-t border-[#DCE3EB] flex justify-end gap-2">
                {foundInst.registrationStatus === 'ACTIVE' && (
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 bg-[#2457A7] text-white rounded text-xs font-semibold hover:bg-[#1d478a] transition-colors"
                  >
                    Proceed to College Admin Sign In
                  </button>
                )}
                <button
                  onClick={() => navigate('/app/institutions')}
                  className="px-4 py-2 bg-slate-800 text-white rounded text-xs font-semibold hover:bg-slate-700 transition-colors"
                >
                  Inspect in AICTE Approval Queue
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No institution found matching query "{searchQuery}".
            </div>
          )}
        </div>
      </div>

      {/* Official Government Footer */}
      <Footer navigate={navigate} />
    </div>
  );
};
