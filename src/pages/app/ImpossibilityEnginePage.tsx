/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AnomalyAlert, GraphNode } from '../../types';
import { SecurityBadge } from '../../components/common/SecurityBadge';
import {
  Network,
  Info,
  Send,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

export const ImpossibilityEnginePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { alerts, updateAlertStatus, addAlertInvestigationNote, runAnomalyDetectionEngine } = useApp();

  const [selectedAlert, setSelectedAlert] = useState<AnomalyAlert>(alerts[0]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [closureReason, setClosureReason] = useState('');
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      runAnomalyDetectionEngine();
      setIsScanning(false);
    }, 600);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    addAlertInvestigationNote(selectedAlert.id, noteInput);
    setNoteInput('');
  };

  const handleConfirmClose = (status: 'RESOLVED' | 'FALSE_POSITIVE') => {
    updateAlertStatus(selectedAlert.id, status, closureReason || 'Closed following manual inquiry.');
    setShowCloseModal(false);
    setClosureReason('');
  };

  // SVG Graph Layout Generator
  const renderGraphSvg = () => {
    const { nodes, edges } = selectedAlert.graphData;
    const width = 720;
    const height = 360;

    const coords: Record<string, { x: number; y: number }> = {};
    const total = nodes.length;

    nodes.forEach((node, i) => {
      if (node.type === 'STUDENT') {
        coords[node.id] = { x: width / 2, y: height / 2 };
      } else if (node.type === 'INSTITUTION') {
        const xOffset = i % 2 === 0 ? width * 0.22 : width * 0.78;
        const yOffset = height * 0.32 + (i * 45) % (height * 0.45);
        coords[node.id] = { x: xOffset, y: yOffset };
      } else {
        const angle = (i / total) * 2 * Math.PI;
        coords[node.id] = {
          x: width / 2 + Math.cos(angle) * (width * 0.36),
          y: height / 2 + Math.sin(angle) * (height * 0.32),
        };
      }
    });

    return (
      <div className="relative rounded overflow-hidden border border-[#D5DEE8] bg-[#0E1E31]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-[360px] select-none block"
        >
          <defs>
            <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Edges */}
          {edges.map((edge) => {
            const src = coords[edge.source] || { x: 100, y: 100 };
            const tgt = coords[edge.target] || { x: 500, y: 200 };
            const midX = (src.x + tgt.x) / 2;
            const midY = (src.y + tgt.y) / 2;

            return (
              <g key={edge.id}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={edge.flagged ? '#C43D43' : '#2457A7'}
                  strokeWidth={edge.flagged ? 2.5 : 1.5}
                  strokeDasharray={edge.distanceKm ? '4,4' : undefined}
                  opacity={0.85}
                />
                {/* Edge Label Pill */}
                <rect
                  x={midX - 48}
                  y={midY - 9}
                  width={96}
                  height={18}
                  rx={2}
                  fill="#10243A"
                  stroke={edge.flagged ? '#C43D43' : '#1D3B5C'}
                  strokeWidth={1}
                />
                <text
                  x={midX}
                  y={midY + 3.5}
                  fill={edge.flagged ? '#FCA5A5' : '#CBD5E1'}
                  fontSize={10}
                  fontFamily='Calibri, "Segoe UI", Arial, sans-serif'
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {edge.label}
                </text>
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const pt = coords[node.id] || { x: width / 2, y: height / 2 };
            const isSelected = selectedNode?.id === node.id;
            const isStudent = node.type === 'STUDENT';
            const isInst = node.type === 'INSTITUTION';

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer"
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isStudent ? 24 : isInst ? 28 : 20}
                  fill={
                    node.flagged
                      ? '#C43D43'
                      : isStudent
                      ? '#2457A7'
                      : isInst
                      ? '#10243A'
                      : '#168C83'
                  }
                  stroke={isSelected ? '#FFFFFF' : node.flagged ? '#F87171' : '#60A5FA'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  filter={isSelected ? 'url(#nodeGlow)' : undefined}
                />
                <text
                  x={pt.x}
                  y={pt.y + 4}
                  fill="#FFFFFF"
                  fontSize={isStudent ? 10 : 9}
                  fontWeight="bold"
                  textAnchor="middle"
                  pointerEvents="none"
                  fontFamily='Calibri, "Segoe UI", Arial, sans-serif'
                >
                  {isStudent ? 'STUDENT' : isInst ? 'INSTITUTION' : 'COURSE'}
                </text>
                <text
                  x={pt.x}
                  y={pt.y + (isStudent ? 38 : 42)}
                  fill="#E2E8F0"
                  fontSize={11}
                  fontFamily='Calibri, "Segoe UI", Arial, sans-serif'
                  fontWeight="600"
                  textAnchor="middle"
                  pointerEvents="none"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Entity Mini-Overlay */}
        {selectedNode && (
          <div className="absolute bottom-2 left-2 right-2 p-2.5 bg-[#10243A]/90 backdrop-blur-xs border border-[#1D3B5C] rounded text-[13px] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#8A9BA8] font-mono text-[11px]">SELECTED NODE:</span>
              <span className="font-semibold text-white">{selectedNode.label}</span>
              <span className="text-[10px] bg-[#2457A7] text-white px-1.5 py-0.5 rounded font-mono">
                {selectedNode.type}
              </span>
              {selectedNode.flagged && (
                <span className="text-[10px] bg-[#C43D43] text-white px-1.5 py-0.5 rounded font-mono font-semibold">
                  FLAGGED
                </span>
              )}
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-[12px] text-[#CBD5E1] hover:text-white"
            >
              Clear selection
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5" style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight">
              Module 1 — Impossibility Engine & Evidence Graph
            </h1>
            <span className="text-xs font-semibold bg-[#FFEBEE] text-[#C43D43] px-2.5 py-0.5 rounded border border-[#C43D43]/30 font-mono">
              AICTE Core Anomaly Engine
            </span>
          </div>
          <p className="text-[14px] text-[#59697C] mt-1">
            Deterministic detection of physical impossibilities (Haversine distance &gt;100 km), duplicate identity collisions, intake breaches, and fraud rings.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className="px-3.5 py-1.5 bg-[#2457A7] hover:bg-[#3169B5] text-white text-[13px] font-medium rounded transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Network className="w-4 h-4" />
          <span>{isScanning ? 'Executing Rules R1-R4...' : 'Re-Run Anomaly Detection Engine'}</span>
        </button>
      </div>

      {/* Core Principle Callout */}
      <div className="p-3 bg-white border-l-4 border-l-[#2457A7] border border-[#D5DEE8] rounded-r text-[13px] text-[#172536] flex items-center gap-2.5">
        <Info className="w-4 h-4 text-[#2457A7] shrink-0" />
        <span className="italic">
          <strong>Operating Principle:</strong> Detect suspicious patterns, preserve evidence, restrict unauthorized access, and support human investigation. An anomaly is a reason to investigate, not proof of fraud.
        </span>
      </div>

      {/* Main Layout: Alert Queue (Left 4 cols) | Evidence Graph & Dossier (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Investigation Queue */}
        <div className="lg:col-span-4 bg-white border border-[#D5DEE8] rounded shadow-xs overflow-hidden flex flex-col">
          <div className="p-3.5 border-b border-[#D5DEE8] bg-[#FBFDFE] flex items-center justify-between">
            <h2 className="text-[14px] font-semibold text-[#172536]">
              Investigation Queue
            </h2>
            <span className="text-[11px] font-mono font-semibold bg-[#F4F6F9] text-[#59697C] px-2 py-0.5 rounded border border-[#D5DEE8]">
              {alerts.length} Flagged
            </span>
          </div>

          <div className="divide-y divide-[#D5DEE8] overflow-y-auto max-h-[620px]">
            {alerts.map((a) => {
              const isSelected = selectedAlert?.id === a.id;
              return (
                <div
                  key={a.id}
                  onClick={() => {
                    setSelectedAlert(a);
                    setSelectedNode(null);
                  }}
                  className={`p-3.5 cursor-pointer transition-colors text-[13px] ${
                    isSelected
                      ? 'bg-[#EBF1F8] border-l-4 border-l-[#2457A7]'
                      : 'hover:bg-[#F9FAFC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-semibold text-[#172536] text-[12px]">{a.id}</span>
                    <SecurityBadge
                      level={
                        a.severity >= 90
                          ? 'critical'
                          : a.severity >= 70
                          ? 'warning'
                          : 'info'
                      }
                      size="xs"
                      pulse={a.severity >= 90}
                    >
                      Severity {a.severity}
                    </SecurityBadge>
                  </div>
                  <h3 className="font-semibold text-[#172536] mt-1 line-clamp-1">{a.title}</h3>
                  <div className="text-[12px] text-[#59697C] mt-1.5 flex items-center justify-between">
                    <span>{a.evidence.ruleTitle}</span>
                    <SecurityBadge
                      level={
                        a.status === 'OPEN'
                          ? 'critical'
                          : a.status === 'INVESTIGATING'
                          ? 'warning'
                          : 'secure'
                      }
                      size="xs"
                    >
                      {a.status}
                    </SecurityBadge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dominant Evidence Graph & Contextual Dossier */}
        <div className="lg:col-span-8 space-y-5">
          {/* Evidence Graph Container */}
          <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-[#D5DEE8]">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-semibold text-[#172536]">{selectedAlert.title}</h2>
                  <span className="text-[11px] font-mono bg-[#F4F6F9] text-[#59697C] px-2 py-0.5 rounded border border-[#D5DEE8]">
                    {selectedAlert.ruleId}
                  </span>
                </div>
                <p className="text-[13px] text-[#59697C] mt-0.5">
                  Entity relationship graph. Click any node to inspect parameters or cross-examine geographical constraints.
                </p>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedAlert.status === 'OPEN' && (
                  <button
                    onClick={() => updateAlertStatus(selectedAlert.id, 'INVESTIGATING')}
                    className="px-3 py-1.5 bg-[#C17B20] hover:bg-[#a56717] text-white rounded text-[12px] font-medium transition-colors"
                  >
                    Mark Investigating
                  </button>
                )}
                {selectedAlert.status !== 'RESOLVED' && (
                  <button
                    onClick={() => setShowCloseModal(true)}
                    className="px-3 py-1.5 bg-[#10243A] hover:bg-[#0B1728] text-white rounded text-[12px] font-medium transition-colors"
                  >
                    Close / Resolve Alert
                  </button>
                )}
              </div>
            </div>

            {/* Dominant SVG Graph */}
            {renderGraphSvg()}
          </div>

          {/* Contextual Evidence Panel (Clear Hierarchy Without Tile Boxes) */}
          <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-4">
            <h2 className="text-[17px] font-semibold text-[#172536] pb-2 border-b border-[#D5DEE8]">
              Forensic Evidence Dossier
            </h2>

            {/* 1. What Happened */}
            <div>
              <h3 className="text-[13px] font-semibold text-[#172536] uppercase tracking-wide">
                1. Incident Description
              </h3>
              <p className="text-[14px] text-[#59697C] mt-1 leading-normal">
                {selectedAlert.summary}
              </p>
            </div>

            <hr className="border-[#D5DEE8]" />

            {/* 2. Why Flagged & Supporting Evidence */}
            <div className="space-y-2">
              <h3 className="text-[13px] font-semibold text-[#172536] uppercase tracking-wide">
                2. Forensic Rationale & Deterministic Metrics
              </h3>
              <div className="text-[14px] text-[#59697C] leading-normal space-y-2">
                <p>{selectedAlert.evidence.details}</p>

                <div className="flex flex-wrap gap-4 pt-1 font-mono text-[13px]">
                  {selectedAlert.evidence.distanceKm && (
                    <div className="text-[#C43D43]">
                      Haversine Physical Distance: <span className="font-bold">{selectedAlert.evidence.distanceKm} km</span> (Exceeds physical 100km single-day threshold)
                    </div>
                  )}
                  {selectedAlert.evidence.similarityScore && (
                    <div className="text-[#C17B20]">
                      Normalized Identity Match: <span className="font-bold">{Math.round(selectedAlert.evidence.similarityScore * 100)}%</span> (Fuzzy Jaro-Winkler phonetic similarity)
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-[#D5DEE8]" />

            {/* 3. Recommended Investigator Action */}
            <div>
              <h3 className="text-[13px] font-semibold text-[#172536] uppercase tracking-wide">
                3. Recommended Investigator Action
              </h3>
              <ul className="mt-1.5 list-disc list-inside space-y-1 text-[13px] text-[#59697C]">
                {selectedAlert.evidence.investigatorGuidance.map((guidance, idx) => (
                  <li key={idx} className="leading-normal">{guidance}</li>
                ))}
              </ul>
            </div>

            <hr className="border-[#D5DEE8]" />

            {/* 4. Case Log & Notes */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[13px] font-semibold text-[#172536] uppercase tracking-wide">
                  4. Investigator Notes & Audit Timeline ({selectedAlert.investigationNotes.length})
                </h3>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedAlert.investigationNotes.map((note) => (
                  <div key={note.id} className="p-2.5 bg-[#F4F6F9] rounded border border-[#D5DEE8] text-[13px]">
                    <div className="flex items-center justify-between text-[11px] text-[#59697C] font-mono mb-0.5">
                      <span className="font-semibold text-[#172536]">{note.author}</span>
                      <span>{note.timestamp.replace('T', ' ').slice(0, 16)} UTC</span>
                    </div>
                    <p className="text-[#172536] leading-normal">{note.text}</p>
                  </div>
                ))}

                {selectedAlert.investigationNotes.length === 0 && (
                  <div className="py-3 text-center text-[13px] text-[#8A9BA8]">
                    No investigator notes recorded yet.
                  </div>
                )}
              </div>

              <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="Record investigation finding, inquiry ref, or physical verification note..."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-[13px] rounded border border-[#D5DEE8] bg-white text-[#172536] focus:border-[#2457A7] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-[#2457A7] hover:bg-[#3169B5] text-white text-[13px] font-medium rounded flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Log Note</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Close Alert Reason Modal */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full p-6 shadow-xl border border-[#D5DEE8]">
            <h3 className="text-[18px] font-semibold text-[#172536] mb-1">
              Close Investigation for {selectedAlert.id}
            </h3>
            <p className="text-[13px] text-[#59697C] mb-4">
              AICTE Compliance Policy requires a mandatory recorded justification before dismissing or concluding any flagged anomaly.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#172536] mb-1">
                  Mandatory Closure Justification
                </label>
                <textarea
                  rows={3}
                  required
                  value={closureReason}
                  onChange={(e) => setClosureReason(e.target.value)}
                  placeholder="e.g. Migration certificate verified; candidate withdrew from earlier institute on 2024-07-20."
                  className="w-full p-2.5 text-[13px] rounded border border-[#D5DEE8] text-[#172536] focus:border-[#2457A7] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D5DEE8]">
                <button
                  type="button"
                  onClick={() => setShowCloseModal(false)}
                  className="px-3 py-1.5 text-[13px] text-[#59697C] hover:bg-[#F4F6F9] rounded border border-[#D5DEE8]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmClose('FALSE_POSITIVE')}
                  className="px-3 py-1.5 bg-white text-[#172536] border border-[#D5DEE8] hover:bg-[#F4F6F9] text-[13px] font-medium rounded"
                >
                  Dismiss as False Positive
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmClose('RESOLVED')}
                  className="px-4 py-1.5 bg-[#10243A] text-white text-[13px] font-medium rounded hover:bg-[#0B1728]"
                >
                  Mark Case Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
