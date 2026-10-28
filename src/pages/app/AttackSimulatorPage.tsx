/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext';
import { SecurityBadge } from '../../components/common/SecurityBadge';
import { Button } from '../../components/common/Button';
import {
  RotateCcw,
  Play,
  ShieldAlert,
  Info,
} from 'lucide-react';

export const AttackSimulatorPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const {
    securitySessions,
    attackSimulationStep,
    runAttackSimulationStep,
    resetAttackSimulation,
  } = useApp();

  const session = securitySessions.find((s) => s.id === 'sess-insider-test') || securitySessions[0];

  const attackStages = [
    {
      step: 1,
      name: 'Stage 1: Off-Hours Privileged Login',
      details: 'Privileged AICTE login recorded at 03:22 AM IST via unusual IP proxy.',
      riskIncrease: '+20 Risk Points (Score: 38)',
      response: 'Tier 1: Warning Logged in Audit Chain',
      badge: 'WARNING',
      badgeColor: 'bg-[#EBF1F8] text-[#2457A7] border-[#2457A7]/30',
    },
    {
      step: 2,
      name: 'Stage 2: Sequential APAAR Scanning',
      details: 'Automated script enumerating 45 sequential student records across unassigned state boundaries.',
      riskIncrease: '+20 Risk Points (Score: 58)',
      response: 'Tier 2: Step-Up MFA Challenge Enforced',
      badge: 'CHALLENGED',
      badgeColor: 'bg-[#FFF3E0] text-[#C17B20] border-[#C17B20]/30',
    },
    {
      step: 3,
      name: 'Stage 3: High-Volume Bulk Extraction',
      details: 'Attempted rapid download of 350 student records in under 40 seconds.',
      riskIncrease: '+20 Risk Points (Score: 78)',
      response: 'Tier 3: Rate Limiting (2 req/min) Applied',
      badge: 'THROTTLED',
      badgeColor: 'bg-[#FFF3E0] text-[#C17B20] border-[#C17B20]/30',
    },
    {
      step: 4,
      name: 'Stage 4: Out-of-Scope IDOR Parameter Tampering',
      details: 'Direct object query attempting unauthorized read on rival institution student database.',
      riskIncrease: '+18 Risk Points (Score: 96)',
      response: 'Tier 4: Session Freeze & Token Revocation',
      badge: 'FROZEN & BLOCKED',
      badgeColor: 'bg-[#FFEBEE] text-[#C43D43] border-[#C43D43]/30',
    },
  ];

  return (
    <div className="space-y-5" style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
      {/* Simulation Banner */}
      <div className="p-3 bg-[#FFEBEE] border border-[#C43D43]/30 rounded-[4px] text-[13px] text-[#C43D43] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#C43D43] shrink-0" />
          <span className="font-semibold">
            RED TEAM SIMULATION ENVIRONMENT: No live institutional or government databases are being contacted or impacted.
          </span>
        </div>
        <span className="font-mono text-[11px] bg-white text-[#C43D43] px-2 py-0.5 rounded-[4px] border border-[#C43D43]/30 font-semibold">
          ISOLATED SANDBOX
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight">
              Red Team Insider Attack Simulator
            </h1>
            <span className="text-xs font-semibold bg-[#C43D43] text-white px-2.5 py-0.5 rounded-[4px] font-mono">
              SIH Core Demo 3
            </span>
          </div>
          <p className="text-[14px] text-[#59697C] mt-1">
            Simulate a compromised administrative account harvesting bulk student records and evaluate the automated risk ladder escalation in real time.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={resetAttackSimulation}
            variant="secondary"
            size="sm"
            icon={<RotateCcw className="w-3.5 h-3.5 text-[#59697C]" />}
          >
            Reset Simulation
          </Button>

          <Button
            onClick={runAttackSimulationStep}
            disabled={attackSimulationStep >= 4}
            variant="destructive"
            size="md"
            icon={<Play className="w-3.5 h-3.5" />}
          >
            {attackSimulationStep === 0
              ? 'Start Attack Simulation (Stage 1)'
              : attackSimulationStep < 4
              ? `Execute Stage ${attackSimulationStep + 1} Attack`
              : 'Sequence Complete (Session Frozen)'}
          </Button>
        </div>
      </div>

      {/* Main Split: Left Risk Gauge (5 cols) | Right Sequence (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Risk Gauge & Target Telemetry */}
        <div className="lg:col-span-5 bg-white border border-[#D5DEE8] rounded shadow-xs p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#D5DEE8]">
              <span className="text-[13px] font-semibold text-[#172536]">
                Target Session Risk Gauge
              </span>
              <SecurityBadge
                level={
                  session.status === 'FROZEN'
                    ? 'critical'
                    : session.status === 'THROTTLED'
                    ? 'warning'
                    : 'neutral'
                }
                size="xs"
                pulse={session.status === 'FROZEN'}
              >
                SESSION {session.status}
              </SecurityBadge>
            </div>

            {/* Score Display */}
            <div className="py-6 text-center">
              <div className="text-5xl font-semibold font-mono tracking-tight text-[#172536] tabular-nums">
                {session.riskScore}
                <span className="text-xl text-[#8A9BA8] font-normal"> / 100</span>
              </div>
              <div className="mt-2 text-[12px] font-semibold text-[#59697C] uppercase tracking-wide">
                Composite Threat Score
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-[#F4F6F9] rounded-full overflow-hidden mt-4 border border-[#D5DEE8]">
                <div
                  style={{ width: `${session.riskScore}%` }}
                  className={`h-full transition-all duration-500 ${
                    session.riskScore >= 90
                      ? 'bg-[#C43D43]'
                      : session.riskScore >= 70
                      ? 'bg-[#C17B20]'
                      : session.riskScore >= 50
                      ? 'bg-[#C17B20]'
                      : 'bg-[#2457A7]'
                  }`}
                />
              </div>
            </div>

            {/* Telemetry Data */}
            <div className="p-3 bg-[#FBFDFE] rounded border border-[#D5DEE8] text-[13px] space-y-1.5 font-mono">
              <div className="flex justify-between">
                <span className="text-[#59697C] font-sans">Compromised Account:</span>
                <span className="font-semibold text-[#172536]">{session.userEmail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#59697C] font-sans">Source IP:</span>
                <span className="text-[#172536]">{session.ipAddress}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#59697C] font-sans">Total Requests:</span>
                <span className="text-[#172536]">{session.requestCount} queries</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#59697C] font-sans">Unauthorized Exports:</span>
                <span className="text-[#172536]">{session.exportCount} initiated</span>
              </div>
            </div>
          </div>

          {session.status === 'FROZEN' && (
            <div className="p-3 bg-[#FFEBEE] border border-[#C43D43]/30 rounded text-[13px] text-[#C43D43] font-semibold text-center">
              SERVER ENFORCEMENT: JWT Token Revoked. All subsequent API queries from this session are hard-denied (HTTP 403 Forbidden).
            </div>
          )}
        </div>

        {/* Right Column: 4-Stage Attack Progression */}
        <div className="lg:col-span-7 bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-[#D5DEE8]">
            <h2 className="text-[16px] font-semibold text-[#172536]">Deterministic Attack Progression & Defense Reaction</h2>
            <p className="text-[13px] text-[#59697C]">Click the execute button above to advance each progressive vector</p>
          </div>

          <div className="space-y-3">
            {attackStages.map((stage) => {
              const isTriggered = attackSimulationStep >= stage.step;
              const isCurrent = attackSimulationStep === stage.step;

              return (
                <div
                  key={stage.step}
                  className={`p-3.5 rounded border transition-colors text-[13px] ${
                    isCurrent
                      ? 'border-[#C43D43] bg-[#FFEBEE]/40'
                      : isTriggered
                      ? 'border-[#D5DEE8] bg-[#FBFDFE]'
                      : 'border-[#D5DEE8]/60 bg-white opacity-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded flex items-center justify-center font-bold text-[12px] font-mono ${
                          isTriggered ? 'bg-[#C43D43] text-white' : 'bg-[#F4F6F9] text-[#59697C] border border-[#D5DEE8]'
                        }`}
                      >
                        {isTriggered ? '✓' : stage.step}
                      </div>
                      <span className="font-semibold text-[#172536]">{stage.name}</span>
                    </div>

                    <SecurityBadge
                      level={
                        stage.step === 4
                          ? 'critical'
                          : stage.step >= 2
                          ? 'warning'
                          : 'info'
                      }
                      size="xs"
                    >
                      {stage.badge}
                    </SecurityBadge>
                  </div>

                  <p className="text-[#59697C] mt-1.5 text-[13px] leading-normal pl-8">
                    {stage.details}
                  </p>

                  {isTriggered && (
                    <div className="mt-2 pt-2 border-t border-[#D5DEE8] pl-8 flex flex-wrap items-center justify-between text-[12px]">
                      <span className="text-[#C43D43] font-mono font-semibold">{stage.riskIncrease}</span>
                      <span className="font-semibold text-[#172536]">{stage.response}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
