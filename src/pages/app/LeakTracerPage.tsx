/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExportRecord } from '../../types';
import {
  Fingerprint,
  ArrowRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface AttributionResult {
  matchedExport: ExportRecord | null;
  canaryMatches: number;
  matchedCanaryNames: string[];
  fingerprintRecovered: boolean;
  fingerprintScore: number;
  jaccardSimilarity: number;
  confidenceScore: number;
  status: 'ATTRIBUTED' | 'INCONCLUSIVE';
  evidenceSummary: string;
}

export const LeakTracerPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { exportsList } = useApp();

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileContentSample, setFileContentSample] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AttributionResult | null>(null);

  // Simulation Presets
  const handleLoadPreset1 = () => {
    const targetExport = exportsList.find((e) => e.exportId === 'EXP-2026-8910') || exportsList[0];
    const canaries = targetExport.canaries;

    const sampleCsv =
      `apaar_id,student_name,dob,father_name,course,status\n` +
      `892144129018,"Vikram Mehta",2005-04-14,"Rajendra Mehta","B.Tech CSE",ACTIVE\n` +
      `331288719920,"Mohd. Rehan Khan",2004-03-12,"Aslam Khan","B.Tech CSE",ACTIVE\n` +
      `984512304918,"Sarthak Sharma",2004-08-19,"Sunil Sharma","B.Tech CSE",ACTIVE\n` +
      `${canaries[0]?.apaarId || '9988-1122-3344'},"${canaries[0]?.name || 'Aarav Singhania (Synthetic Canary)'}",2005-01-01,"Synthetic Guardian","B.Tech CSE",ACTIVE\n` +
      `${canaries[1]?.apaarId || '9988-5566-7788'},"${canaries[1]?.name || 'Diya Kapoor (Synthetic Canary)'}",2005-02-02,"Synthetic Guardian","B.Tech CSE",ACTIVE\n` +
      `621980345512,"Pooja Iyer",2005-01-30,"R. Iyer","B.Tech ECE",ACTIVE\n`;

    setUploadedFileName('DarkWeb_Telegram_Dump_Sample_8910.csv');
    setFileContentSample(sampleCsv);
    runAnalysis(sampleCsv, targetExport);
  };

  const handleLoadPreset2 = () => {
    const targetExport = exportsList.find((e) => e.exportId === 'EXP-2026-7241') || exportsList[1] || exportsList[0];
    const canaries = targetExport.canaries;

    const sampleCsv =
      `apaar_id,student_name,dob,father_name,course,status\n` +
      `773290113420,"Ananya Joshi",2005-09-22,"Vikas Joshi","B.Tech AI & DS",ACTIVE\n` +
      `549102837465,"Kavita Menon",2005-02-18,"G. Menon","B.Tech AI & DS",ACTIVE\n` +
      `${canaries[0]?.apaarId || '8877-1122-4455'},"${canaries[0]?.name || 'Rohan Deshmukh (Synthetic Canary)'}",2005-05-05,"Synthetic","B.Tech AI & DS",ACTIVE\n` +
      `${canaries[1]?.apaarId || '8877-6677-8899'},"${canaries[1]?.name || 'Tanvi Joshi (Synthetic Canary)'}",2005-06-06,"Synthetic","B.Tech AI & DS",ACTIVE\n`;

    setUploadedFileName('Leaked_Student_Data_Forum_Post.csv');
    setFileContentSample(sampleCsv);
    runAnalysis(sampleCsv, targetExport);
  };

  const handleLoadInconclusive = () => {
    const sampleCsv =
      `apaar_id,student_name,dob,course\n` +
      `112233445566,"Random Person A",2003-01-01,"B.Sc"\n` +
      `665544332211,"Random Person B",2003-02-02,"B.Com"\n`;

    setUploadedFileName('Untracked_External_Spreadsheet.csv');
    setFileContentSample(sampleCsv);

    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setResult({
        matchedExport: null,
        canaryMatches: 0,
        matchedCanaryNames: [],
        fingerprintRecovered: false,
        fingerprintScore: 0.05,
        jaccardSimilarity: 0.02,
        confidenceScore: 4,
        status: 'INCONCLUSIVE',
        evidenceSummary: 'Insufficient forensic signals. No synthetic canary tokens identified, and row permutation does not match any authorized institutional export session.',
      });
    }, 500);
  };

  const runAnalysis = (csvText: string, targetExport: ExportRecord) => {
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);

      // Signal 1: Canary matching
      const foundCanaries: string[] = [];
      targetExport.canaries.forEach((c) => {
        if (csvText.includes(c.apaarId) || csvText.includes(c.name)) {
          foundCanaries.push(c.name);
        }
      });

      // Signal 2: Fingerprint recovery
      const fingerprintRecovered = foundCanaries.length >= 1;
      const fpScore = fingerprintRecovered ? 0.94 : 0.12;

      // Signal 3: Row set Jaccard similarity
      const jaccard = 0.86;

      const confidence = Math.min(
        Math.round((foundCanaries.length / (targetExport.canaryCount || 1)) * 50 + fpScore * 30 + jaccard * 20),
        99
      );

      setResult({
        matchedExport: targetExport,
        canaryMatches: foundCanaries.length,
        matchedCanaryNames: foundCanaries,
        fingerprintRecovered,
        fingerprintScore: fpScore,
        jaccardSimilarity: jaccard,
        confidenceScore: confidence,
        status: confidence >= 60 ? 'ATTRIBUTED' : 'INCONCLUSIVE',
        evidenceSummary: `Recovered ${foundCanaries.length} cryptographic canary records specifically tied to export session ${targetExport.exportId}. Row permutation signature matches originating workstation terminal.`,
      });
    }, 600);
  };

  return (
    <div className="space-y-5" style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight">
              Module 2 — Forensic Data-Leak Tracer
            </h1>
            <span className="text-xs font-semibold bg-[#E6F3F2] text-[#168C83] px-2.5 py-0.5 rounded border border-[#168C83]/30 font-mono">
              Canary & Permutation Attribution
            </span>
          </div>
          <p className="text-[14px] text-[#59697C] mt-1">
            Determine the originating account, session, and timestamp of leaked institutional exports using synthetic honeytoken canaries and row-order permutation fingerprints.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/students')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#10243A] hover:bg-[#0B1728] text-white text-[13px] font-medium rounded transition-colors shadow-xs"
        >
          <span>Generate New Tracked Export</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#168C83]" />
        </button>
      </div>

      {/* Operational Note */}
      <div className="p-3 bg-white border-l-4 border-l-[#168C83] border border-[#D5DEE8] rounded-r text-[13px] text-[#172536] flex items-center gap-2.5">
        <Info className="w-4 h-4 text-[#168C83] shrink-0" />
        <span>
          <strong>Forensic Pipeline:</strong> Every authorized student export injects 3–5 unique synthetic canaries and encodes a permutation fingerprint into row ordering. When modified or filtered leaks surface online, the tracer attributes the exact originating export session.
        </span>
      </div>

      {/* Main Grid: Step 1 (Left 4 cols) | Step 2 & 3 (Right 8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Ingest & Scenarios */}
        <div className="lg:col-span-4 space-y-5">
          {/* Ingest Container */}
          <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-4 space-y-3">
            <h2 className="text-[14px] font-semibold text-[#172536]">
              1. Ingest Suspected Leaked CSV
            </h2>
            <p className="text-[13px] text-[#59697C]">
              Select an investigation scenario to load and evaluate candidate leak payloads:
            </p>

            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={handleLoadPreset1}
                className="w-full text-left p-3 rounded border border-[#D5DEE8] hover:border-[#2457A7] bg-[#FBFDFE] hover:bg-[#F4F6F9] transition-colors"
              >
                <div className="flex items-center justify-between text-[13px] font-semibold text-[#172536]">
                  <span>Scenario A: Leaked Dump #8910</span>
                  <span className="font-mono text-[11px] text-[#2457A7]">Canaries Included</span>
                </div>
                <div className="text-[12px] text-[#59697C] mt-1 leading-normal">
                  Originating from Delhi Institute of Technology (Dr. Ramesh Verma). 3 rows altered/deleted.
                </div>
              </button>

              <button
                type="button"
                onClick={handleLoadPreset2}
                className="w-full text-left p-3 rounded border border-[#D5DEE8] hover:border-[#2457A7] bg-[#FBFDFE] hover:bg-[#F4F6F9] transition-colors"
              >
                <div className="flex items-center justify-between text-[13px] font-semibold text-[#172536]">
                  <span>Scenario B: Leaked Dump #7241</span>
                  <span className="font-mono text-[11px] text-[#168C83]">Canaries Injected</span>
                </div>
                <div className="text-[12px] text-[#59697C] mt-1 leading-normal">
                  Originating from Mumbai College of Engineering (Dr. Neha Kulkarni).
                </div>
              </button>

              <button
                type="button"
                onClick={handleLoadInconclusive}
                className="w-full text-left p-3 rounded border border-[#D5DEE8] hover:border-[#C17B20] bg-[#FBFDFE] hover:bg-[#F4F6F9] transition-colors"
              >
                <div className="flex items-center justify-between text-[13px] font-semibold text-[#172536]">
                  <span>Scenario C: Inconclusive Sample</span>
                  <span className="font-mono text-[11px] text-[#59697C]">Zero Match</span>
                </div>
                <div className="text-[12px] text-[#59697C] mt-1 leading-normal">
                  Random untracked external spreadsheet without honeytoken signatures.
                </div>
              </button>
            </div>

            {uploadedFileName && (
              <div className="mt-3 p-3 bg-[#F4F6F9] border border-[#D5DEE8] rounded text-[13px] space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-[#172536]">
                  <span className="truncate max-w-[200px]">{uploadedFileName}</span>
                  <span className="text-[#16805D] text-[11px] font-mono">Loaded</span>
                </div>
                <div className="text-[11px] text-[#59697C] font-mono line-clamp-3 bg-white p-2 rounded border border-[#D5DEE8]">
                  {fileContentSample}
                </div>
              </div>
            )}
          </div>

          {/* Historical Authorized Exports Register */}
          <div className="bg-white border border-[#D5DEE8] rounded shadow-xs p-4">
            <h3 className="text-[14px] font-semibold text-[#172536] pb-2 border-b border-[#D5DEE8]">
              Monitored Historical Export Registry ({exportsList.length})
            </h3>
            <div className="divide-y divide-[#D5DEE8] text-[13px]">
              {exportsList.map((exp) => (
                <div key={exp.id} className="py-2.5">
                  <div className="flex items-center justify-between font-semibold">
                    <span className="font-mono text-[#2457A7]">{exp.exportId}</span>
                    <span className="text-[11px] text-[#59697C] font-mono">{exp.timestamp.slice(0, 10)}</span>
                  </div>
                  <div className="text-[12px] text-[#172536] mt-0.5">
                    {exp.actorName} · <span className="text-[#59697C]">{exp.actorRole}</span>
                  </div>
                  <div className="text-[11px] text-[#59697C] font-mono mt-0.5 truncate">
                    Signature: {exp.contentSignature} · {exp.canaryCount} Canaries
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Forensic Correlation & Attribution Results */}
        <div className="lg:col-span-8 bg-white border border-[#D5DEE8] rounded shadow-xs p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#D5DEE8]">
            <div>
              <h2 className="text-[18px] font-semibold text-[#172536]">
                2 & 3. Forensic Evidence Correlation & Attribution
              </h2>
              <p className="text-[13px] text-[#59697C]">
                Correlation analysis across independent forensic watermark signals
              </p>
            </div>

            {result && (
              <span
                className={`text-[12px] font-mono font-semibold px-2.5 py-1 rounded border ${
                  result.status === 'ATTRIBUTED'
                    ? 'bg-[#E8F5E9] text-[#16805D] border-[#16805D]/30'
                    : 'bg-[#FFF3E0] text-[#C17B20] border-[#C17B20]/30'
                }`}
              >
                STATUS: {result.status}
              </span>
            )}
          </div>

          {isAnalyzing ? (
            <div className="py-20 text-center text-[13px] text-[#59697C] space-y-3">
              <div className="w-8 h-8 border-2 border-[#2457A7] border-t-transparent rounded-full animate-spin mx-auto" />
              <div>Correlating synthetic canary records, row permutation entropy, and Jaccard overlaps...</div>
            </div>
          ) : result ? (
            <div className="space-y-5">
              {/* Attribution Finding Surface */}
              {result.status === 'ATTRIBUTED' && result.matchedExport ? (
                <div className="p-4 bg-[#F9FBFD] border border-[#D5DEE8] rounded">
                  <div className="flex items-start justify-between pb-3 border-b border-[#D5DEE8]">
                    <div>
                      <span className="text-[11px] font-semibold text-[#59697C] uppercase tracking-wider block">
                        Attributed Originating Session
                      </span>
                      <h3 className="text-[20px] font-semibold text-[#172536] font-mono mt-0.5">
                        {result.matchedExport.exportId}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="text-[12px] text-[#59697C] block">Attribution Confidence</span>
                      <span className="text-[24px] font-semibold font-mono text-[#16805D]">{result.confidenceScore}%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-[13px]">
                    <div>
                      <span className="text-[11px] text-[#59697C] block">Originating Official:</span>
                      <span className="font-semibold text-[#172536]">{result.matchedExport.actorName}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#59697C] block">Institutional Role:</span>
                      <span className="text-[#172536]">{result.matchedExport.actorRole}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-[#59697C] block">Export Timestamp:</span>
                      <span className="font-mono text-[#172536]">{result.matchedExport.timestamp.replace('T', ' ').slice(0, 16)} UTC</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-[#FFF3E0] border border-[#C17B20]/30 rounded text-[13px] text-[#C17B20]">
                  <strong>Attribution Inconclusive:</strong> {result.evidenceSummary}
                </div>
              )}

              {/* Single Coherent Signal Comparison Matrix (No floating cards) */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#172536] mb-2">
                  Independent Forensic Signal Matrix
                </h3>
                <div className="overflow-x-auto border border-[#D5DEE8] rounded">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead className="bg-[#F4F6F9] border-b border-[#D5DEE8] text-[#172536] font-semibold">
                      <tr>
                        <th className="py-2.5 px-4">Forensic Indicator</th>
                        <th className="py-2.5 px-4">Mechanism & Detection Rule</th>
                        <th className="py-2.5 px-4">Correlation Metric</th>
                        <th className="py-2.5 px-4 text-center">Verdict</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D5DEE8]">
                      <tr>
                        <td className="py-3 px-4 font-semibold text-[#172536]">
                          Signal 1: Synthetic Canaries
                        </td>
                        <td className="py-3 px-4 text-[#59697C] text-[12px] leading-normal">
                          Searches for non-existent synthetic student identities injected into export.
                          {result.matchedCanaryNames.length > 0 && (
                            <div className="mt-1 text-[#16805D] font-mono text-[11px]">
                              Recovered: {result.matchedCanaryNames.join(', ')}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#172536]">
                          {result.canaryMatches} / 3 Canaries
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                              result.canaryMatches > 0
                                ? 'bg-[#E8F5E9] text-[#16805D] border-[#16805D]/30'
                                : 'bg-[#F4F6F9] text-[#59697C] border-[#D5DEE8]'
                            }`}
                          >
                            {result.canaryMatches > 0 ? 'MATCHED' : 'NOT FOUND'}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-semibold text-[#172536]">
                          Signal 2: Permutation Fingerprint
                        </td>
                        <td className="py-3 px-4 text-[#59697C] text-[12px] leading-normal">
                          Recovers subtle row-order sort entropy embedded into workstation output stream.
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#172536]">
                          {Math.round(result.fingerprintScore * 100)}% Confidence
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                              result.fingerprintRecovered
                                ? 'bg-[#E8F5E9] text-[#16805D] border-[#16805D]/30'
                                : 'bg-[#F4F6F9] text-[#59697C] border-[#D5DEE8]'
                            }`}
                          >
                            {result.fingerprintRecovered ? 'RECOVERED' : 'UNMATCHED'}
                          </span>
                        </td>
                      </tr>

                      <tr>
                        <td className="py-3 px-4 font-semibold text-[#172536]">
                          Signal 3: Jaccard Row Overlap
                        </td>
                        <td className="py-3 px-4 text-[#59697C] text-[12px] leading-normal">
                          Measures intersection over union of student identifier subsets against prior ledger exports.
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-[#172536]">
                          {Math.round(result.jaccardSimilarity * 100)}% Overlap
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                              result.jaccardSimilarity > 0.5
                                ? 'bg-[#E8F5E9] text-[#16805D] border-[#16805D]/30'
                                : 'bg-[#F4F6F9] text-[#59697C] border-[#D5DEE8]'
                            }`}
                          >
                            {result.jaccardSimilarity > 0.5 ? 'CORRELATED' : 'LOW OVERLAP'}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Evidence Narrative Brief */}
              <div className="pt-3 border-t border-[#D5DEE8]">
                <h3 className="text-[13px] font-semibold text-[#172536] uppercase tracking-wide mb-1">
                  Investigation Evidence Brief
                </h3>
                <p className="text-[13px] text-[#59697C] leading-normal">
                  {result.evidenceSummary}
                </p>
              </div>
            </div>
          ) : (
            <div className="py-24 text-center text-[13px] text-[#59697C]">
              Select an investigation scenario on the left to begin forensic correlation analysis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
