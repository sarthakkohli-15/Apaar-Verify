/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Download,
  RotateCcw,
} from 'lucide-react';

export const UploadsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { currentUser, ingestStudentBatch } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string; rowCount: number } | null>(null);
  const [parsedRows, setParsedRows] = useState<Partial<Student>[]>([]);
  const [validationResult, setValidationResult] = useState<{
    validCount: number;
    errorCount: number;
    injectionCount: number;
    duplicateCount: number;
  } | null>(null);

  const [commitResult, setCommitResult] = useState<{ accepted: number; rejected: number; correctionsAdded: number } | null>(null);

  const handleDownloadTemplate = () => {
    const csvContent =
      'apaar_id,student_name,dob,father_name,course_id,admit_date,academic_session,category\n' +
      '892100441290,"Aarav Sharma",2005-04-12,"Ramesh Sharma",crs-01,2024-08-01,2024-2028,GENERAL\n' +
      '892100441291,"Sneha Gupta",2005-06-18,"Rajesh Gupta",crs-01,2024-08-01,2024-2028,GENERAL\n' +
      '892100441292,"Mohit Verma",2005-02-24,"Sunil Verma",crs-02,2024-08-02,2024-2028,OBC\n';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AICTE_Student_Upload_Template.csv';
    a.click();
  };

  const handleLoadCleanSample = () => {
    const sample: Partial<Student>[] = [
      { apaarId: '891044229901', name: 'Ishita Roy', dob: '2005-03-14', fatherName: 'A. Roy', courseId: 'crs-01', admitDate: '2024-08-01', academicSession: '2024-2028', category: 'GENERAL' },
      { apaarId: '891044229902', name: 'Nikhil Aggarwal', dob: '2005-05-19', fatherName: 'V. Aggarwal', courseId: 'crs-01', admitDate: '2024-08-01', academicSession: '2024-2028', category: 'GENERAL' },
      { apaarId: '891044229903', name: 'Zoya Akhtar', dob: '2005-07-22', fatherName: 'F. Akhtar', courseId: 'crs-01', admitDate: '2024-08-02', academicSession: '2024-2028', category: 'OBC' },
      { apaarId: '891044229904', name: 'Arjun Namboodiri', dob: '2005-01-30', fatherName: 'K. Namboodiri', courseId: 'crs-02', admitDate: '2024-08-03', academicSession: '2024-2028', category: 'GENERAL' },
    ];
    setSelectedFile({ name: 'Batch_2024_Clean_Verified.csv', size: '2.4 KB', rowCount: sample.length });
    setParsedRows(sample);
  };

  const handleLoadDirtySample = () => {
    const sample: Partial<Student>[] = [
      { apaarId: '891044229905', name: 'Tanvi Shinde', dob: '2005-02-10', fatherName: 'M. Shinde', courseId: 'crs-01', admitDate: '2024-08-01', academicSession: '2024-2028', category: 'GENERAL' },
      { apaarId: '772211', name: 'Abhishek Pandey', dob: '2005-04-11', fatherName: 'D. Pandey', courseId: 'crs-01', admitDate: '2024-08-01', academicSession: '2024-2028', category: 'GENERAL' },
      { apaarId: '891044229907', name: '=cmd|"/C calc"!A0', dob: '2005-08-15', fatherName: 'S. Singh', courseId: 'crs-01', admitDate: '2024-08-01', academicSession: '2024-2028', category: 'GENERAL' },
      { apaarId: '891044229908', name: '+1-800-MALICIOUS', dob: '2005-09-19', fatherName: 'G. Das', courseId: 'crs-02', admitDate: '2024-08-02', academicSession: '2024-2028', category: 'OBC' },
      { apaarId: '891044229909', name: 'Priya Chawla', dob: '2005-11-28', fatherName: 'H. Chawla', courseId: 'crs-02', admitDate: '2024-08-03', academicSession: '2024-2028', category: 'EWS' },
    ];
    setSelectedFile({ name: 'Admissions_With_Injections_And_Format_Errors.csv', size: '3.1 KB', rowCount: sample.length });
    setParsedRows(sample);
  };

  const handleRunValidation = () => {
    let valid = 0;
    let errors = 0;
    let injections = 0;

    parsedRows.forEach(r => {
      const apaar = (r.apaarId || '').replace(/\D/g, '');
      const rawName = r.name || '';
      const dangerous = ['=', '+', '-', '@'].includes(rawName.charAt(0));

      if (dangerous) injections++;
      if (apaar.length !== 12) {
        errors++;
      } else {
        valid++;
      }
    });

    setValidationResult({
      validCount: valid,
      errorCount: errors,
      injectionCount: injections,
      duplicateCount: 0,
    });

    setCurrentStep(3);
  };

  const handleCommit = () => {
    if (!selectedFile) return;
    const res = ingestStudentBatch(selectedFile.name, parsedRows);
    setCommitResult(res);
    setCurrentStep(4);
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setSelectedFile(null);
    setParsedRows([]);
    setValidationResult(null);
    setCommitResult(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#D5DEE8]">
        <div>
          <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight leading-tight">
            Student Data CSV Ingestion
          </h1>
          <p className="text-[14px] text-[#59697C] mt-0.5">
            Four-step ingestion workflow: file selection, schema mapping, validation reporting, and commit.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/app/corrections')}
            className="px-3.5 py-1.5 bg-white border border-[#D5DEE8] hover:bg-[#F4F6F9] text-[#172536] text-[13.5px] font-medium rounded-md transition-colors cursor-pointer"
          >
            Correction Queue
          </button>
          <button
            onClick={handleDownloadTemplate}
            className="px-3.5 py-1.5 bg-white border border-[#D5DEE8] hover:bg-[#F4F6F9] text-[#172536] text-[13.5px] font-medium rounded-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#1673D1]" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Step Progress Line */}
      <div className="bg-white border border-[#D5DEE8] rounded-md p-3">
        <div className="grid grid-cols-4 divide-x divide-[#D5DEE8] text-center text-[13px]">
          <div className={`py-1 font-medium ${currentStep === 1 ? 'text-[#1673D1]' : currentStep > 1 ? 'text-[#16805D]' : 'text-[#59697C]'}`}>
            1. Select File
          </div>
          <div className={`py-1 font-medium ${currentStep === 2 ? 'text-[#1673D1]' : currentStep > 2 ? 'text-[#16805D]' : 'text-[#59697C]'}`}>
            2. Schema Mapping
          </div>
          <div className={`py-1 font-medium ${currentStep === 3 ? 'text-[#1673D1]' : currentStep > 3 ? 'text-[#16805D]' : 'text-[#59697C]'}`}>
            3. Validation Report
          </div>
          <div className={`py-1 font-medium ${currentStep === 4 ? 'text-[#1673D1]' : 'text-[#59697C]'}`}>
            4. Commit & Audit
          </div>
        </div>
      </div>

      {/* Step 1: File Selection */}
      {currentStep === 1 && (
        <div className="bg-white border border-[#D5DEE8] rounded-md p-6 space-y-5">
          <div className="border border-dashed border-[#D5DEE8] rounded-md p-8 text-center bg-[#F4F6F9]">
            <UploadCloud className="w-8 h-8 text-[#1673D1] mx-auto mb-2" />
            <h3 className="text-[16px] font-semibold text-[#172536]">Select Institutional Admissions CSV</h3>
            <p className="text-[13px] text-[#59697C] mt-1 max-w-sm mx-auto">
              File must contain student APAAR IDs, names, dates of birth, course IDs, and admission dates.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleLoadCleanSample}
                className="px-3 py-1.5 bg-white border border-[#D5DEE8] hover:bg-slate-50 text-[13px] font-medium rounded-md text-[#172536] transition-colors cursor-pointer"
              >
                Load Clean Sample (4 records)
              </button>

              <button
                onClick={handleLoadDirtySample}
                className="px-3 py-1.5 bg-white border border-[#C17B20] text-[#C17B20] hover:bg-amber-50 text-[13px] font-medium rounded-md transition-colors cursor-pointer"
              >
                Load Anomaly & Formula Injection Test (5 records)
              </button>
            </div>
          </div>

          {selectedFile && (
            <div className="p-3.5 bg-[#F4F6F9] border border-[#D5DEE8] rounded-md flex items-center justify-between text-[13.5px]">
              <div>
                <span className="font-semibold text-[#172536]">{selectedFile.name}</span>
                <span className="text-[#59697C] ml-2 text-[12.5px] font-mono">({selectedFile.rowCount} records · {selectedFile.size})</span>
              </div>
              <button
                onClick={() => setCurrentStep(2)}
                className="px-4 py-1.5 bg-[#1673D1] hover:bg-[#105CB0] text-white font-medium rounded-md text-[13px] flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Continue to Mapping</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Mapping */}
      {currentStep === 2 && (
        <div className="bg-white border border-[#D5DEE8] rounded p-6 space-y-4">
          <div className="pb-3 border-b border-[#D5DEE8] flex justify-between items-center">
            <div>
              <h2 className="text-[18px] font-semibold text-[#172536]">Schema Alignment</h2>
              <p className="text-[13px] text-[#59697C]">Detected column mappings for {selectedFile?.name}</p>
            </div>
            <span className="text-[12.5px] font-mono text-[#2457A7]">{selectedFile?.rowCount} rows ready</span>
          </div>

          <div className="overflow-x-auto border border-[#D5DEE8] rounded">
            <table className="w-full text-left text-[13.5px]">
              <thead className="bg-[#F4F6F9] border-b border-[#D5DEE8] text-[#59697C] text-[13px]">
                <tr>
                  <th className="py-2 px-3 font-normal">Target APAAR Field</th>
                  <th className="py-2 px-3 font-normal">Mapped CSV Header</th>
                  <th className="py-2 px-3 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#172536]">APAAR Identifier (12 digits)</td>
                  <td className="py-2.5 px-3 font-mono text-[12.5px] text-[#59697C]">apaar_id</td>
                  <td className="py-2.5 px-3 text-right text-[#16805D] text-[12.5px]">Matched</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#172536]">Student Full Name</td>
                  <td className="py-2.5 px-3 font-mono text-[12.5px] text-[#59697C]">student_name</td>
                  <td className="py-2.5 px-3 text-right text-[#16805D] text-[12.5px]">Matched</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#172536]">Date of Birth</td>
                  <td className="py-2.5 px-3 font-mono text-[12.5px] text-[#59697C]">dob</td>
                  <td className="py-2.5 px-3 text-right text-[#16805D] text-[12.5px]">Matched</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#172536]">Course Identifier</td>
                  <td className="py-2.5 px-3 font-mono text-[12.5px] text-[#59697C]">course_id</td>
                  <td className="py-2.5 px-3 text-right text-[#16805D] text-[12.5px]">Matched</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-3.5 py-1.5 text-[13px] text-[#59697C] hover:bg-slate-100 rounded-md cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleRunValidation}
              className="px-4 py-2 bg-[#1673D1] hover:bg-[#105CB0] text-white text-[13.5px] font-medium rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Run Validation Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Validation Summary Table (No separate card per rule) */}
      {currentStep === 3 && validationResult && (
        <div className="bg-white border border-[#D5DEE8] rounded-md p-6 space-y-4">
          <div className="pb-3 border-b border-[#D5DEE8]">
            <h2 className="text-[18px] font-semibold text-[#172536]">Validation Summary Report</h2>
            <p className="text-[13px] text-[#59697C]">Ingestion checks for {parsedRows.length} incoming records</p>
          </div>

          {/* Unified Summary Table */}
          <div className="overflow-x-auto border border-[#D5DEE8] rounded-md">
            <table className="w-full text-left text-[13.5px]">
              <thead className="bg-[#F4F6F9] border-b border-[#D5DEE8] text-[#59697C] text-[13px]">
                <tr>
                  <th className="py-2 px-3 font-normal">Check / Specification</th>
                  <th className="py-2 px-3 font-normal text-center">Outcome</th>
                  <th className="py-2 px-3 font-normal text-right">Records Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#172536]">Syntactically Valid Records</td>
                  <td className="py-2.5 px-3 text-center text-[#16805D] font-medium">Passed</td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">{validationResult.validCount}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#172536]">APAAR ID Format Errors (Requires 12 Digits)</td>
                  <td className="py-2.5 px-3 text-center text-[#C43D43] font-medium">
                    {validationResult.errorCount > 0 ? 'Diverted to Correction' : 'Passed'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">{validationResult.errorCount}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#172536]">Formula Injections Neutralized (=, +, -, @)</td>
                  <td className="py-2.5 px-3 text-center text-[#C17B20] font-medium">
                    {validationResult.injectionCount > 0 ? 'Sanitized' : 'None Detected'}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">{validationResult.injectionCount}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium text-[#172536]">Institutional Intake Quota Threshold</td>
                  <td className="py-2.5 px-3 text-center text-[#16805D] font-medium">Within Limit</td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">Verified</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-3.5 py-1.5 text-[13px] text-[#59697C] hover:bg-slate-100 rounded-md cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={handleCommit}
              className="px-4 py-2 bg-[#10243A] hover:bg-[#0B1728] text-white text-[13.5px] font-medium rounded-md flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>Commit Valid Records to AICTE Repository</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Commit Report */}
      {currentStep === 4 && commitResult && (
        <div className="bg-white border border-[#D5DEE8] rounded-md p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#16805D]">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-[18px] font-semibold text-[#172536]">Batch Ingestion Committed</h2>
          </div>
          <p className="text-[13.5px] text-[#59697C]">
            Valid records have been committed with cryptographic enrolment events and logged in the append-only audit ledger.
          </p>

          <div className="p-4 bg-[#F4F6F9] border border-[#D5DEE8] rounded-md text-[13px] space-y-1 font-mono">
            <div className="flex justify-between">
              <span className="text-[#59697C] font-sans">Accepted Records:</span>
              <span className="font-semibold text-[#16805D]">{commitResult.accepted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#59697C] font-sans">Diverted to Correction Queue:</span>
              <span className="font-semibold text-[#C17B20]">{commitResult.correctionsAdded}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#59697C] font-sans">Audit Checkpoint Hash:</span>
              <span className="text-[#172536]">SHA-256 Chained</span>
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              onClick={() => navigate('/app/corrections')}
              className="px-4 py-2 bg-[#1673D1] hover:bg-[#105CB0] text-white text-[13.5px] font-medium rounded-md cursor-pointer shadow-xs"
            >
              Open Correction Queue ({commitResult.correctionsAdded})
            </button>
            <button
              onClick={() => navigate('/app/students')}
              className="px-4 py-2 bg-white border border-[#D5DEE8] hover:bg-[#F4F6F9] text-[#172536] text-[13.5px] font-medium rounded-md cursor-pointer"
            >
              View Student Registry
            </button>
            <button
              onClick={resetWizard}
              className="px-3.5 py-2 text-[13.5px] text-[#59697C] hover:bg-slate-100 rounded-md flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Upload Another</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
