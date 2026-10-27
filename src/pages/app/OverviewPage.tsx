/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SecurityBadge } from '../../components/common/SecurityBadge';
import {
  Building2,
  Users,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  Filter,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

export const OverviewPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const {
    currentUser,
    institutions,
    students,
    alerts,
    securityIncidents,
    corrections,
    auditEvents,
    runAnomalyDetectionEngine,
  } = useApp();

  const [filterState, setFilterState] = useState<string>('ALL');
  const [isScanning, setIsScanning] = useState(false);

  const scopedInstitutions =
    currentUser.role === 'COLLEGE_ADMIN' && currentUser.institutionId
      ? institutions.filter(i => i.id === currentUser.institutionId)
      : institutions;

  const scopedStudents =
    currentUser.role === 'COLLEGE_ADMIN' && currentUser.institutionId
      ? students.filter(s => s.institutionId === currentUser.institutionId)
      : students;

  const totalApproved = scopedInstitutions.reduce((acc, i) => acc + i.approvedIntake, 0);
  const totalEnrolled = scopedInstitutions.reduce((acc, i) => acc + i.currentEnrolment, 0);
  const openAlerts = alerts.filter(a => a.status === 'OPEN' || a.status === 'INVESTIGATING');
  const pendingCorrections = corrections.filter(c => c.status === 'PENDING').length;
  const criticalIncidents = securityIncidents.filter(i => i.severity === 'CRITICAL' || i.severity === 'HIGH').length;

  const uniqueStates = Array.from(new Set(institutions.map(i => i.state)));

  const chartInstitutions = scopedInstitutions.filter(inst => {
    if (filterState !== 'ALL' && inst.state !== filterState) return false;
    return true;
  });

  const handleRunAnalysis = () => {
    setIsScanning(true);
    setTimeout(() => {
      runAnomalyDetectionEngine();
      setIsScanning(false);
      navigate('/app/analysis');
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#D5DEE8]">
        <div>
          <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight leading-tight">
            Central Enrolment & Integrity Overview
          </h1>
          <p className="text-[14px] text-[#59697C] mt-0.5">
            Monitor enrolment, institutional compliance, anomalies, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAnalysis}
            disabled={isScanning}
            className="px-4 py-2 bg-[#2457A7] hover:bg-[#3169B5] text-white text-[14px] font-medium rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>{isScanning ? 'Running Analysis...' : 'Run Analysis'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Section: Shared horizontal strip with subtle vertical dividers (No individual floating cards) */}
      <div className="bg-white border border-[#D5DEE8] rounded divide-y sm:divide-y-0 sm:divide-x divide-[#D5DEE8] grid grid-cols-1 sm:grid-cols-4">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5">
          <div className="text-[12.5px] text-[#59697C] font-normal">Approved Institutions</div>
          <div className="text-[28px] font-semibold text-[#172536] font-mono mt-1 tabular-nums">
            {scopedInstitutions.filter(i => i.registrationStatus === 'ACTIVE').length}
          </div>
          <div className="text-[12px] text-[#59697C] mt-1">
            Across {uniqueStates.length} states & territories
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5">
          <div className="text-[12.5px] text-[#59697C] font-normal">Student Records</div>
          <div className="text-[28px] font-semibold text-[#172536] font-mono mt-1 tabular-nums">
            {totalEnrolled.toLocaleString()}
          </div>
          <div className="text-[12px] text-[#16805D] font-medium mt-1">
            {Math.round((totalEnrolled / (totalApproved || 1)) * 100)}% of approved intake ({totalApproved.toLocaleString()})
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5">
          <div className="text-[12.5px] text-[#59697C] font-normal">Records Requiring Review</div>
          <div className="text-[28px] font-semibold text-[#C17B20] font-mono mt-1 tabular-nums">
            {openAlerts.length + pendingCorrections}
          </div>
          <div className="text-[12px] text-[#59697C] mt-1">
            {openAlerts.length} anomaly alerts · {pendingCorrections} corrections
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5">
          <div className="text-[12.5px] text-[#59697C] font-normal">Critical Security Incidents</div>
          <div className="text-[28px] font-semibold text-[#C43D43] font-mono mt-1 tabular-nums">
            {criticalIncidents}
          </div>
          <div className="text-[12px] text-[#59697C] mt-1">
            Active session throttling & freezes
          </div>
        </div>
      </div>

      {/* Main Content Area: Dominant Left Chart + Supporting Right Investigation Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Dominant Chart (7/12) */}
        <div className="lg:col-span-7 bg-white border border-[#D5DEE8] rounded p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5DEE8]">
            <div>
              <h2 className="text-[18px] font-semibold text-[#172536]">
                Approved Intake versus Current Enrolment
              </h2>
              <p className="text-[13px] text-[#59697C] mt-0.5">
                Seat utilization and intake quota limits across participating institutions
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-[13px] text-[#59697C]">
              <Filter className="w-3.5 h-3.5" />
              <span>State:</span>
              <select
                value={filterState}
                onChange={(e) => setFilterState(e.target.value)}
                className="text-[13px] rounded border border-[#D5DEE8] px-2 py-1 bg-white text-[#172536]"
              >
                <option value="ALL">All States</option>
                {uniqueStates.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Bar Chart Representation */}
          <div className="space-y-3.5 pt-1">
            {chartInstitutions.slice(0, 6).map((inst) => {
              const pct = Math.round((inst.currentEnrolment / inst.approvedIntake) * 100);
              const isBreach = pct > 105;

              return (
                <div key={inst.id} className="space-y-1">
                  <div className="flex items-center justify-between text-[13.5px]">
                    <div className="truncate max-w-[280px] sm:max-w-md">
                      <span className="font-medium text-[#172536]">{inst.officialName}</span>
                      <span className="text-[#59697C] ml-2 text-[12.5px]">({inst.city}, {inst.state})</span>
                    </div>
                    <div className="font-mono text-[13px] flex items-center gap-2">
                      <span className="text-[#59697C]">{inst.currentEnrolment} / {inst.approvedIntake}</span>
                      <span
                        className={`text-[12px] font-semibold ${
                          isBreach ? 'text-[#C43D43]' : pct >= 95 ? 'text-[#2457A7]' : 'text-[#16805D]'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-[#F4F6F9] rounded overflow-hidden flex border border-[#E2E8F0]">
                    <div
                      style={{ width: `${Math.min(pct, 100)}%` }}
                      className={`h-full ${
                        isBreach ? 'bg-[#C43D43]' : pct >= 95 ? 'bg-[#2457A7]' : 'bg-[#168C83]'
                      }`}
                    />
                    {isBreach && (
                      <div
                        style={{ width: `${Math.min(pct - 100, 40)}%` }}
                        className="h-full bg-[#8B1A1E]"
                        title="Intake Limit Violation"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-[12px] text-[#59697C] flex items-center gap-4 border-t border-[#D5DEE8]">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#168C83]" /> Normal Enrolment (&lt;95%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#2457A7]" /> Near Capacity (95-100%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#C43D43]" /> Quota Breach (&gt;100%)
            </span>
          </div>
        </div>

        {/* Right: Supporting Investigation Queue (5/12) */}
        <div className="lg:col-span-5 bg-white border border-[#D5DEE8] rounded p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#D5DEE8]">
              <div>
                <h2 className="text-[18px] font-semibold text-[#172536]">Investigation Summary</h2>
                <p className="text-[13px] text-[#59697C] mt-0.5">Active anomalies under compliance scrutiny</p>
              </div>
              <button
                onClick={() => navigate('/app/analysis')}
                className="text-[13px] text-[#2457A7] hover:text-[#3169B5] font-medium"
              >
                View all
              </button>
            </div>

            <div className="space-y-2.5 pt-3">
              {alerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => navigate('/app/analysis')}
                  className="p-2.5 rounded border border-[#D5DEE8] hover:bg-[#F4F6F9] cursor-pointer transition-colors text-[13px]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#172536] truncate">{alert.title}</span>
                    <SecurityBadge
                      level={
                        alert.severity >= 90
                          ? 'critical'
                          : alert.severity >= 70
                          ? 'warning'
                          : 'info'
                      }
                      size="xs"
                      pulse={alert.severity >= 90}
                    >
                      Score {alert.severity}
                    </SecurityBadge>
                  </div>
                  <div className="text-[12px] text-[#59697C] mt-1.5 flex items-center justify-between">
                    <span className="truncate max-w-[200px]">{alert.affectedInstitutions.join(', ')}</span>
                    <SecurityBadge
                      level={
                        alert.status === 'OPEN'
                          ? 'critical'
                          : alert.status === 'INVESTIGATING'
                          ? 'warning'
                          : 'secure'
                      }
                      size="xs"
                    >
                      {alert.status}
                    </SecurityBadge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#D5DEE8] text-[12px] text-[#59697C] italic">
            "Detect suspicious patterns, preserve evidence, restrict unauthorized access, and support human investigation. An anomaly is a reason to investigate, not proof of fraud."
          </div>
        </div>
      </div>

      {/* Full-Width Recent Alerts Table */}
      <div className="bg-white border border-[#D5DEE8] rounded p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#D5DEE8]">
          <div>
            <h2 className="text-[18px] font-semibold text-[#172536]">Recent Integrity Alerts</h2>
            <p className="text-[13px] text-[#59697C]">System-flagged irregularities across institutional submissions</p>
          </div>
          <button
            onClick={() => navigate('/app/analysis')}
            className="text-[13px] text-[#2457A7] hover:text-[#3169B5] font-medium"
          >
            Open Impossibility Engine
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-[#D5DEE8] text-[#59697C] font-semibold text-[13px]">
                <th className="pb-2 font-normal">Alert ID</th>
                <th className="pb-2 font-normal">Anomaly Rule</th>
                <th className="pb-2 font-normal">Institutions Affected</th>
                <th className="pb-2 font-normal text-center">Score</th>
                <th className="pb-2 font-normal">Status</th>
                <th className="pb-2 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {alerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-[#F4F6F9]">
                  <td className="py-2.5 font-mono text-[#172536]">{alert.id}</td>
                  <td className="py-2.5 text-[#172536] font-medium max-w-[260px] truncate" title={alert.title}>
                    {alert.title}
                  </td>
                  <td className="py-2.5 text-[#59697C] max-w-[220px] truncate" title={alert.affectedInstitutions.join(', ')}>
                    {alert.affectedInstitutions.join(', ')}
                  </td>
                  <td className="py-2.5 text-center font-mono font-medium">
                    <SecurityBadge
                      level={
                        alert.severity >= 90
                          ? 'critical'
                          : alert.severity >= 70
                          ? 'warning'
                          : 'info'
                      }
                      size="xs"
                      pulse={alert.severity >= 90}
                    >
                      {alert.severity}
                    </SecurityBadge>
                  </td>
                  <td className="py-2.5">
                    <SecurityBadge
                      level={
                        alert.status === 'OPEN'
                          ? 'critical'
                          : alert.status === 'INVESTIGATING'
                          ? 'warning'
                          : 'secure'
                      }
                      size="xs"
                    >
                      {alert.status}
                    </SecurityBadge>
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => navigate('/app/analysis')}
                      className="text-[13px] text-[#2457A7] hover:text-[#3169B5] font-medium"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Concise Recent Activity Timeline */}
      <div className="bg-white border border-[#D5DEE8] rounded p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#D5DEE8]">
          <div>
            <h2 className="text-[18px] font-semibold text-[#172536]">Recent Activity Timeline</h2>
            <p className="text-[13px] text-[#59697C]">Chronological audit ledger of administrative and system operations</p>
          </div>
          <button
            onClick={() => navigate('/app/audit')}
            className="text-[13px] text-[#2457A7] hover:text-[#3169B5] font-medium"
          >
            Audit Log
          </button>
        </div>

        <div className="space-y-2.5 pt-1">
          {auditEvents.slice(-4).reverse().map((ev) => (
            <div key={ev.id} className="flex items-baseline justify-between text-[13.5px] border-b border-slate-100 pb-2 last:border-0 last:pb-0">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2457A7]" />
                <span className="font-medium text-[#172536]">{ev.action}</span>
                <span className="text-[#59697C] text-[12.5px]">({ev.actorRole})</span>
              </div>
              <div className="text-[12px] text-[#59697C] font-mono">
                {ev.timestamp.replace('T', ' ').slice(0, 16)} UTC
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
