/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Users,
  Search,
  Filter,
  Download,
  UploadCloud,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';

export const StudentsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { currentUser, students, createStudentExport } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterValidation, setFilterValidation] = useState('ALL');
  const [revealApaar, setRevealApaar] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const scopedStudents =
    currentUser.role === 'COLLEGE_ADMIN' && currentUser.institutionId
      ? students.filter(s => s.institutionId === currentUser.institutionId)
      : students;

  const filteredStudents = scopedStudents.filter(stu => {
    if (filterValidation !== 'ALL' && stu.validationStatus !== filterValidation) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        stu.name.toLowerCase().includes(q) ||
        stu.apaarId.includes(q) ||
        stu.maskedApaar.toLowerCase().includes(q) ||
        stu.institutionName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExport = () => {
    const exp = createStudentExport(
      `${currentUser.role} Student Dataset Export (${filteredStudents.length} rows)`,
      filteredStudents.length
    );

    const header = 'apaar_id,student_name,institution,course,dob,admission_date,status\n';
    const rows = filteredStudents.map(
      s => `${s.apaarId},"${s.name}","${s.institutionName}","${s.courseName}",${s.dob},${s.admitDate},${s.enrolmentStatus}`
    );
    const canaryRows = exp.canaries.map(
      c => `${c.apaarId},"${c.name}","${currentUser.institutionName || 'AICTE Central'}","B.Tech CSE",${c.dob},2024-08-01,ACTIVE`
    );

    const fullCsv = header + [...rows, ...canaryRows].join('\n');
    const blob = new Blob([fullCsv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `APAAR_STUDENTS_${exp.exportId}.csv`;
    a.click();

    setExportNotice(
      `Export ${exp.exportId} generated with 3 embedded canary records and fingerprint (${exp.contentSignature.slice(0, 14)}...). Ready for Leak Tracer testing.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#D5DEE8]">
        <div>
          <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight leading-tight">
            Student Records
          </h1>
          <p className="text-[14px] text-[#59697C] mt-0.5">
            Structured enrolment registry with masked APAAR identifiers and forensic leak tracing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/app/uploads')}
            className="px-3.5 py-2 bg-white border border-[#D5DEE8] hover:bg-[#F4F6F9] text-[#172536] text-[13.5px] font-medium rounded transition-colors flex items-center gap-1.5"
          >
            <UploadCloud className="w-4 h-4 text-[#2457A7]" />
            <span>Upload CSV</span>
          </button>

          <button
            onClick={handleExport}
            className="px-3.5 py-2 bg-[#2457A7] hover:bg-[#3169B5] text-white text-[13.5px] font-medium rounded transition-colors flex items-center gap-1.5 shadow-xs"
            title="Exports with canary tokens for Leak Tracer evaluation"
          >
            <Download className="w-4 h-4" />
            <span>Export with Canaries</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-[13px] text-[#16805D] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{exportNotice}</span>
          </div>
          <button
            onClick={() => navigate('/app/leak-tracer')}
            className="font-semibold underline ml-4 hover:opacity-80"
          >
            Open Leak Tracer
          </button>
        </div>
      )}

      {/* Main Full-Width Table Surface */}
      <div className="bg-white border border-[#D5DEE8] rounded p-5 space-y-4">
        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5DEE8]">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#59697C] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student name, APAAR ID, or institution..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-[13.5px] rounded border border-[#D5DEE8] text-[#172536] focus:border-[#2457A7] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterValidation}
              onChange={(e) => setFilterValidation(e.target.value)}
              className="text-[13px] rounded border border-[#D5DEE8] px-2.5 py-1.5 bg-white text-[#172536]"
            >
              <option value="ALL">All Validations</option>
              <option value="VALID">Valid Only</option>
              <option value="FLAGGED">Flagged (Anomalies)</option>
            </select>

            <button
              onClick={() => setRevealApaar(!revealApaar)}
              className="flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded border border-[#D5DEE8] hover:bg-[#F4F6F9] text-[#172536] transition-colors"
            >
              {revealApaar ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5 text-[#59697C]" />}
              <span>{revealApaar ? 'Mask Identifiers' : 'Reveal Identifiers'}</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px]">
            <thead>
              <tr className="border-b border-[#D5DEE8] text-[#59697C] text-[13px]">
                <th className="pb-2 font-normal">APAAR ID</th>
                <th className="pb-2 font-normal">Student Name</th>
                <th className="pb-2 font-normal">Institution</th>
                <th className="pb-2 font-normal">Program</th>
                <th className="pb-2 font-normal">Admission Date</th>
                <th className="pb-2 font-normal text-center">Mode</th>
                <th className="pb-2 font-normal text-center">Validation</th>
                <th className="pb-2 font-normal text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredStudents.map((stu) => (
                <tr
                  key={stu.id}
                  onClick={() => setSelectedStudent(stu)}
                  className="hover:bg-[#F4F6F9] cursor-pointer transition-colors"
                >
                  <td className="py-2.5 font-mono text-[#172536]">
                    {revealApaar ? (
                      <span className="text-[#2457A7]">{stu.apaarId}</span>
                    ) : (
                      <span>{stu.maskedApaar}</span>
                    )}
                  </td>
                  <td className="py-2.5 font-medium text-[#172536]">{stu.name}</td>
                  <td className="py-2.5 text-[#59697C] max-w-[200px] truncate" title={stu.institutionName}>
                    {stu.institutionName}
                  </td>
                  <td className="py-2.5 text-[#59697C]">{stu.courseName}</td>
                  <td className="py-2.5 text-[#59697C] font-mono">{stu.admitDate}</td>
                  <td className="py-2.5 text-center text-[#59697C] text-[12.5px]">
                    {stu.studyMode === 'FULL_TIME_OFFLINE' ? 'Offline' : 'Online'}
                  </td>
                  <td className="py-2.5 text-center">
                    <span
                      className={`text-[12px] font-medium ${
                        stu.validationStatus === 'VALID' ? 'text-[#16805D]' : 'text-[#C43D43]'
                      }`}
                    >
                      {stu.validationStatus}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-[12.5px] text-[#59697C]">
                    {stu.enrolmentStatus}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 text-[12.5px] text-[#59697C] flex items-center justify-between border-t border-[#D5DEE8]">
          <span>Showing {filteredStudents.length} of {scopedStudents.length} enrolled student records</span>
          <span>APAAR masking active (Click row to inspect details)</span>
        </div>
      </div>

      {/* Selected Student Detail Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-lg w-full p-6 border border-[#D5DEE8] shadow-lg space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-[#D5DEE8]">
              <div>
                <h3 className="text-[18px] font-semibold text-[#172536]">{selectedStudent.name}</h3>
                <div className="text-[13px] text-[#59697C] font-mono mt-0.5">
                  APAAR: {revealApaar ? selectedStudent.apaarId : selectedStudent.maskedApaar}
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-[#59697C] hover:text-[#172536] text-[13px]"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[13.5px]">
              <div>
                <span className="text-[#59697C] text-[12.5px] block">Institution:</span>
                <span className="font-medium text-[#172536]">{selectedStudent.institutionName}</span>
              </div>
              <div>
                <span className="text-[#59697C] text-[12.5px] block">Program:</span>
                <span className="font-medium text-[#172536]">{selectedStudent.courseName}</span>
              </div>
              <div>
                <span className="text-[#59697C] text-[12.5px] block">Date of Birth:</span>
                <span className="font-mono text-[#172536]">{selectedStudent.dob}</span>
              </div>
              <div>
                <span className="text-[#59697C] text-[12.5px] block">Father / Guardian:</span>
                <span className="font-medium text-[#172536]">{selectedStudent.fatherName}</span>
              </div>
              <div>
                <span className="text-[#59697C] text-[12.5px] block">Admission Date:</span>
                <span className="font-mono text-[#172536]">{selectedStudent.admitDate}</span>
              </div>
              <div>
                <span className="text-[#59697C] text-[12.5px] block">Academic Session:</span>
                <span className="font-mono text-[#172536]">{selectedStudent.academicSession}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#D5DEE8] flex justify-end">
              <button
                onClick={() => setSelectedStudent(null)}
                className="px-4 py-1.5 bg-[#2457A7] hover:bg-[#3169B5] text-white text-[13px] font-medium rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
