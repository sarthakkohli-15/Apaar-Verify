/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../../components/common/Button';
import {
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';

interface TimelinePoint {
  date: string;
  label: string;
  totalEnrolment: number;
  activeInstitutions: number;
  notableEvent: string;
  checkpointHash: string;
  hasSpike: boolean;
}

const HISTORICAL_TIMELINE: TimelinePoint[] = [
  {
    date: '2024-02-15',
    label: 'Feb 2024 · Initial AICTE Pilot Onboarding',
    totalEnrolment: 585,
    activeInstitutions: 2,
    notableEvent: 'Delhi Institute of Technology & NIT Bangalore onboarded.',
    checkpointHash: '8f9a2c1b4e8d3f7a...',
    hasSpike: false,
  },
  {
    date: '2024-06-30',
    label: 'Jun 2024 · Pre-Admission Baseline',
    totalEnrolment: 1295,
    activeInstitutions: 5,
    notableEvent: 'Western & Southern Region autonomous colleges verified.',
    checkpointHash: '3e7b1a9c8f2d5e4a...',
    hasSpike: false,
  },
  {
    date: '2024-08-18',
    label: 'Aug 2024 · UNNATURAL INGESTION SPIKE (Sunday 02:14 AM)',
    totalEnrolment: 3840,
    activeInstitutions: 10,
    notableEvent: 'Shanti Swaroop College Bhopal injected +120 unapproved excess seats in a single batch.',
    checkpointHash: '9a4d8c2e1f7b3a5e...',
    hasSpike: true,
  },
  {
    date: '2026-10-27',
    label: 'Oct 2026 · Current AICTE State',
    totalEnrolment: 4435,
    activeInstitutions: 10,
    notableEvent: 'Present operational state with Impossibility Engine R1-R4 rules active.',
    checkpointHash: '1f83d9ab5be0cd19...',
    hasSpike: false,
  },
];

export const TimeMachinePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(HISTORICAL_TIMELINE.length - 1);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentPoint = HISTORICAL_TIMELINE[currentIndex];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev >= HISTORICAL_TIMELINE.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="space-y-5" style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight">
              Historical Time Machine
            </h1>
            <span className="text-xs font-semibold bg-[#10243A] text-white px-2.5 py-0.5 rounded-md font-mono">
              Temporal Ledger
            </span>
          </div>
          <p className="text-[14px] text-[#59697C] mt-1">
            Reconstruct institutional enrolment, intake quota compliance, and audit status at any exact moment in history using the append-only event stream.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-1.5 bg-[#1673D1] hover:bg-[#105CB0] text-white text-[13px] font-medium rounded-md transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause Replay' : 'Play Timeline Replay'}</span>
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentIndex(0);
            }}
            className="p-1.5 text-[#59697C] hover:bg-[#F4F6F9] rounded-md border border-[#D5DEE8] cursor-pointer"
            title="Reset to genesis snapshot"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Timeline Scrubbing Bar */}
      <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[14px] font-semibold text-[#172536]">
            <Sparkles className="w-4 h-4 text-[#C17B20]" />
            <span>Interactive Demonstration: Scrub Backwards to Pre-Spike Baseline</span>
          </div>
          <span className="text-[12px] font-mono text-[#59697C]">
            Snapshot {currentIndex + 1} of {HISTORICAL_TIMELINE.length}
          </span>
        </div>

        {/* Wide Slider */}
        <div className="space-y-2 pt-1">
          <input
            type="range"
            min={0}
            max={HISTORICAL_TIMELINE.length - 1}
            step={1}
            value={currentIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentIndex(parseInt(e.target.value));
            }}
            className="w-full accent-[#2457A7] cursor-pointer"
          />

          <div className="flex justify-between text-[12px] font-mono text-[#59697C] pt-1">
            {HISTORICAL_TIMELINE.map((p, idx) => (
              <button
                key={p.date}
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentIndex(idx);
                }}
                className={`text-left hover:text-[#2457A7] transition-colors ${
                  idx === currentIndex ? 'font-bold text-[#2457A7]' : ''
                }`}
              >
                <div>{p.date}</div>
                <div className="text-[11px] text-[#8A9BA8] hidden sm:block truncate max-w-[130px] font-sans">
                  {p.label.split('·')[0]}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Historical Reconstruction Details */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Reconstructed Metrics */}
        <div className="md:col-span-5 bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-[#D5DEE8]">
            <span className="text-[11px] font-semibold text-[#59697C] uppercase tracking-wide block">
              Historical Snapshot State
            </span>
            <h2 className="text-[22px] font-semibold text-[#172536] font-mono mt-0.5">
              {currentPoint.date}
            </h2>
            <span className="text-[13px] text-[#2457A7] font-semibold">{currentPoint.label}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-[#FBFDFE] rounded border border-[#D5DEE8]">
              <span className="text-[12px] text-[#59697C] block">Enrolled Students</span>
              <span className="text-[24px] font-semibold font-mono text-[#172536] mt-0.5 block">
                {currentPoint.totalEnrolment.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-[#FBFDFE] rounded border border-[#D5DEE8]">
              <span className="text-[12px] text-[#59697C] block">Active Colleges</span>
              <span className="text-[24px] font-semibold font-mono text-[#172536] mt-0.5 block">
                {currentPoint.activeInstitutions}
              </span>
            </div>
          </div>

          <div className="p-3 bg-[#FBFDFE] rounded border border-[#D5DEE8] text-[12px] font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-[#59697C] font-sans">Merkle Checkpoint:</span>
              <span className="text-[#2457A7] font-semibold">{currentPoint.checkpointHash}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#59697C] font-sans">Cryptographic State:</span>
              <span className="text-[#16805D] font-semibold">VERIFIED RECONSTRUCTED</span>
            </div>
          </div>

          {currentPoint.hasSpike && (
            <div className="p-3 bg-[#FFEBEE] border border-[#C43D43]/30 rounded text-[13px] text-[#C43D43] space-y-1">
              <div className="font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>UNNATURAL INGESTION SPIKE RECORDED</span>
              </div>
              <p className="text-[12px] text-[#59697C] leading-normal">
                120 unapproved student records were ingested in an off-hours batch. Scrub backwards to June 2024 to view the pre-spike baseline!
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Historical Delta Breakdown */}
        <div className="md:col-span-7 bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-4">
          <div className="pb-3 border-b border-[#D5DEE8]">
            <h3 className="text-[16px] font-semibold text-[#172536]">Historical Event Delta</h3>
            <p className="text-[13px] text-[#59697C]">Milestone transitions committed prior to {currentPoint.date}</p>
          </div>

          <div className="p-3 bg-[#FBFDFE] rounded border border-[#D5DEE8] text-[13px] text-[#172536] leading-normal">
            <span className="font-semibold text-[#172536] block mb-0.5">State Milestone Note:</span>
            {currentPoint.notableEvent}
          </div>

          <div className="space-y-2 pt-1">
            <span className="text-[12px] font-semibold text-[#172536] uppercase tracking-wide block">
              Institutional Status at {currentPoint.date}:
            </span>
            <div className="divide-y divide-[#D5DEE8] text-[13px] border border-[#D5DEE8] rounded bg-[#FBFDFE]">
              <div className="p-2.5 flex items-center justify-between">
                <span className="font-medium text-[#172536]">Delhi Institute of Technology</span>
                <span className="font-mono text-[#59697C]">585 / 600 seats (97.5% capacity)</span>
              </div>
              <div className="p-2.5 flex items-center justify-between">
                <span className="font-medium text-[#172536]">NIT Bangalore</span>
                <span className="font-mono text-[#59697C]">710 / 720 seats (98.6% capacity)</span>
              </div>
              {currentIndex >= 2 && (
                <div className="p-2.5 bg-[#FFEBEE]/40 flex items-center justify-between">
                  <span className="font-semibold text-[#C43D43]">Shanti Swaroop College Bhopal</span>
                  <span className="font-mono font-semibold text-[#C43D43]">420 / 300 seats (140.0% BREACH)</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
