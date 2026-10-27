/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Download,
  CheckCircle2,
} from 'lucide-react';

export const AnalyticsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { institutions, alerts, securityIncidents, createStudentExport } = useApp();

  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const totalSeats = institutions.reduce((acc, i) => acc + i.approvedIntake, 0);
  const totalEnrolled = institutions.reduce((acc, i) => acc + i.currentEnrolment, 0);
  const averageUtilization = Math.round((totalEnrolled / (totalSeats || 1)) * 100);

  const states = Array.from(new Set(institutions.map((i) => i.state)));

  const handleDownloadReport = () => {
    const exp = createStudentExport('National Compliance & Intake Audit Summary Report');
    setDownloadNotice(`Compliance analytics exported under signature ${exp.contentSignature.slice(0, 16)}... with embedded canary tokens.`);
  };

  return (
    <div className="space-y-5" style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
        <div>
          <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight">
            Central Enrolment Analytics & Institutional Compliance
          </h1>
          <p className="text-[14px] text-[#59697C] mt-1">
            Aggregated intelligence on national technical intake quotas, regional seat utilization, anomaly trends, and validation health.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="px-3.5 py-1.5 bg-[#10243A] hover:bg-[#0B1728] text-white text-[13px] font-medium rounded transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5 text-[#168C83]" />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-[#E8F5E9] border border-[#16805D]/30 rounded text-[13px] text-[#16805D] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#16805D] shrink-0" />
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* 4-KPI Shared Surface Strip (Anti-Boxification) */}
      <div className="bg-white border border-[#D5DEE8] rounded shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#D5DEE8]">
          <div className="p-4">
            <span className="text-[12px] text-[#59697C] font-semibold uppercase tracking-wide block mb-1">
              National Intake Utilization
            </span>
            <div className="text-[26px] font-semibold font-mono text-[#2457A7]">{averageUtilization}%</div>
            <span className="text-[12px] text-[#59697C] mt-0.5 block">{totalEnrolled} / {totalSeats} approved seats</span>
          </div>

          <div className="p-4">
            <span className="text-[12px] text-[#59697C] font-semibold uppercase tracking-wide block mb-1">
              Validation Pass Rate
            </span>
            <div className="text-[26px] font-semibold font-mono text-[#16805D]">98.4%</div>
            <span className="text-[12px] text-[#59697C] mt-0.5 block">1.6% quarantined to correction queue</span>
          </div>

          <div className="p-4">
            <span className="text-[12px] text-[#59697C] font-semibold uppercase tracking-wide block mb-1">
              Physical Impossibility Alerts
            </span>
            <div className="text-[26px] font-semibold font-mono text-[#C43D43]">{alerts.length}</div>
            <span className="text-[12px] text-[#59697C] mt-0.5 block">Flagged by Haversine &gt;100km engine</span>
          </div>

          <div className="p-4">
            <span className="text-[12px] text-[#59697C] font-semibold uppercase tracking-wide block mb-1">
              Security Incidents Mitigated
            </span>
            <div className="text-[26px] font-semibold font-mono text-[#172536]">{securityIncidents.length}</div>
            <span className="text-[12px] text-[#59697C] mt-0.5 block">Rate throttles & session freezes</span>
          </div>
        </div>
      </div>

      {/* Regional Quota vs. Enrolment Utilization Breakdown */}
      <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5DEE8]">
          <div>
            <h2 className="text-[16px] font-semibold text-[#172536]">State-Wise Approved Quota vs. Enrolment Density</h2>
            <p className="text-[13px] text-[#59697C]">Distribution across major Indian technical education hubs</p>
          </div>
          <span className="text-[12px] font-mono text-[#59697C]">{states.length} Active Regions</span>
        </div>

        <div className="space-y-4">
          {states.map((state) => {
            const stateInsts = institutions.filter((i) => i.state === state);
            const stateSeats = stateInsts.reduce((a, b) => a + b.approvedIntake, 0);
            const stateEnrolled = stateInsts.reduce((a, b) => a + b.currentEnrolment, 0);
            const pct = Math.round((stateEnrolled / (stateSeats || 1)) * 100);

            return (
              <div key={state} className="space-y-1.5 text-[13px]">
                <div className="flex justify-between font-semibold">
                  <span className="text-[#172536]">{state} ({stateInsts.length} Colleges)</span>
                  <span className="font-mono text-[#59697C]">{stateEnrolled} / {stateSeats} seats ({pct}%)</span>
                </div>
                <div className="w-full h-2 bg-[#F4F6F9] rounded-full overflow-hidden flex border border-[#D5DEE8]">
                  <div
                    style={{ width: `${Math.min(pct, 100)}%` }}
                    className={`h-full ${pct > 105 ? 'bg-[#C43D43]' : pct >= 95 ? 'bg-[#2457A7]' : 'bg-[#168C83]'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
