/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CorrectionItem } from '../../types';
import {
  Search,
  Edit2,
  XCircle,
  Check,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';

export const CorrectionsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { corrections, resolveCorrection } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [editModalItem, setEditModalItem] = useState<CorrectionItem | null>(null);
  const [customValue, setCustomValue] = useState('');

  const filteredCorrections = corrections.filter((c) => {
    if (filterStatus !== 'ALL' && c.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.studentName.toLowerCase().includes(q) ||
        c.fieldName.toLowerCase().includes(q) ||
        c.errorCode.toLowerCase().includes(q) ||
        c.recordRef.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = corrections.filter((c) => c.status === 'PENDING').length;

  const handleApplyFix = (item: CorrectionItem) => {
    resolveCorrection(item.id, 'CORRECTED', item.suggestedValue);
  };

  const handleReject = (item: CorrectionItem) => {
    resolveCorrection(item.id, 'REJECTED');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalItem) return;
    resolveCorrection(editModalItem.id, 'CORRECTED', customValue);
    setEditModalItem(null);
    setCustomValue('');
  };

  return (
    <div className="space-y-5" style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D5DEE8]">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight">
              Ingestion Correction Queue
            </h1>
            {pendingCount > 0 && (
              <span className="text-xs font-semibold bg-[#FFF3E0] text-[#C17B20] px-2.5 py-0.5 rounded border border-[#C17B20]/30 font-mono">
                {pendingCount} Pending Resolution
              </span>
            )}
          </div>
          <p className="text-[14px] text-[#59697C] mt-1">
            Quarantined records diverted during batch CSV validation. Review, remediate, and re-commit invalid identifiers and potential formula injections.
          </p>
        </div>

        <button
          onClick={() => navigate('/app/uploads')}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-[#F4F6F9] text-[#172536] border border-[#D5DEE8] text-[13px] font-medium rounded transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#59697C]" />
          <span>Back to Upload Wizard</span>
        </button>
      </div>

      {/* Main Surface: Filter Toolbar + Full-Width Table */}
      <div className="bg-white border border-[#D5DEE8] rounded shadow-xs overflow-hidden">
        {/* Integrated Filter Bar */}
        <div className="p-3.5 border-b border-[#D5DEE8] flex flex-wrap items-center justify-between gap-3 bg-[#FBFDFE]">
          <div className="relative flex-1 min-w-[260px] max-w-md">
            <Search className="w-4 h-4 text-[#59697C] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter by candidate name, field, error code, or record ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-[13px] rounded border border-[#D5DEE8] bg-white text-[#172536] placeholder-[#8A9BA8] focus:border-[#2457A7] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#59697C]">Status Filter:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-[13px] rounded border border-[#D5DEE8] px-2.5 py-1.5 bg-white text-[#172536] focus:border-[#2457A7] focus:outline-none"
            >
              <option value="ALL">All Statuses ({corrections.length})</option>
              <option value="PENDING">Pending Only ({pendingCount})</option>
              <option value="CORRECTED">Corrected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Full-Width Queue Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead className="bg-[#F4F6F9] border-b border-[#D5DEE8] text-[#172536] font-semibold">
              <tr>
                <th className="py-2.5 px-4">Row / Ref</th>
                <th className="py-2.5 px-4">Candidate Name</th>
                <th className="py-2.5 px-4">Field Name</th>
                <th className="py-2.5 px-4">Current Value</th>
                <th className="py-2.5 px-4">Validation Error / Rule</th>
                <th className="py-2.5 px-4">Suggested Correction</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Remediation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D5DEE8]">
              {filteredCorrections.map((item) => (
                <tr key={item.id} className="hover:bg-[#F9FAFC] transition-colors">
                  <td className="py-3 px-4 font-mono text-[#172536]">
                    Row {item.rowNumber} <span className="text-[11px] text-[#59697C]">({item.recordRef})</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#172536]">{item.studentName}</td>
                  <td className="py-3 px-4 font-mono text-[#59697C]">{item.fieldName}</td>
                  <td className="py-3 px-4 font-mono text-[#C43D43] max-w-[140px] truncate" title={item.currentValue}>
                    {item.currentValue || <span className="italic text-[#8A9BA8]">(empty)</span>}
                  </td>
                  <td className="py-3 px-4 max-w-[240px]">
                    <div className="text-[12px] font-semibold text-[#172536]">{item.errorCode}</div>
                    <div className="text-[12px] text-[#59697C] leading-normal mt-0.5">{item.errorMessage}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#16805D] font-semibold">{item.suggestedValue}</td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        item.status === 'CORRECTED'
                          ? 'bg-[#E8F5E9] text-[#16805D] border-[#16805D]/30'
                          : item.status === 'REJECTED'
                          ? 'bg-[#FFEBEE] text-[#C43D43] border-[#C43D43]/30'
                          : 'bg-[#FFF3E0] text-[#C17B20] border-[#C17B20]/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleApplyFix(item)}
                          className="px-2.5 py-1 bg-[#2457A7] hover:bg-[#3169B5] text-white rounded text-[12px] font-medium transition-colors"
                          title="Apply suggested fix"
                        >
                          Apply Fix
                        </button>
                        <button
                          onClick={() => {
                            setEditModalItem(item);
                            setCustomValue(item.suggestedValue);
                          }}
                          className="p-1 text-[#59697C] hover:text-[#2457A7] hover:bg-[#F4F6F9] rounded border border-transparent hover:border-[#D5DEE8]"
                          title="Edit custom value"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleReject(item)}
                          className="p-1 text-[#59697C] hover:text-[#C43D43] hover:bg-[#FFEBEE] rounded border border-transparent hover:border-[#C43D43]/20"
                          title="Reject row permanently"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[12px] text-[#8A9BA8]">Resolved</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredCorrections.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[13px] text-[#59697C]">
                    No items found matching the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Custom Edit Modal */}
      {editModalItem && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full p-6 shadow-xl border border-[#D5DEE8]">
            <h3 className="text-[18px] font-semibold text-[#172536] mb-1">
              Edit Value for {editModalItem.studentName}
            </h3>
            <p className="text-[13px] text-[#59697C] mb-4">
              Modifying field <span className="font-mono font-semibold text-[#172536]">{editModalItem.fieldName}</span> in quarantined row.
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#172536] mb-1">
                  Corrected Value
                </label>
                <input
                  type="text"
                  required
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  className="w-full p-2 text-[13px] rounded border border-[#D5DEE8] font-mono text-[#172536] focus:border-[#2457A7] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D5DEE8]">
                <button
                  type="button"
                  onClick={() => setEditModalItem(null)}
                  className="px-3 py-1.5 text-[13px] text-[#59697C] hover:bg-[#F4F6F9] rounded border border-[#D5DEE8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2457A7] text-white text-[13px] font-medium rounded hover:bg-[#3169B5]"
                >
                  Save & Validate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
