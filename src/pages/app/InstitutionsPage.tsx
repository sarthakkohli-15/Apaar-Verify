/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Institution, Course } from '../../types';
import {
  Building2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Globe,
  Plus,
  ChevronRight,
} from 'lucide-react';

export const InstitutionsPage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { currentUser, institutions, courses, reviewInstitution } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedInst, setSelectedInst] = useState<Institution | null>(institutions[0]);

  // Review modal state
  const [reviewModalInst, setReviewModalInst] = useState<Institution | null>(null);
  const [reviewDecision, setReviewDecision] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewNote, setReviewNote] = useState('');

  const filteredInstitutions = institutions.filter(inst => {
    if (currentUser.role === 'COLLEGE_ADMIN' && currentUser.institutionId && inst.id !== currentUser.institutionId) {
      return false;
    }
    if (selectedCategory !== 'ALL' && inst.category !== selectedCategory) return false;
    if (selectedStatus !== 'ALL' && inst.registrationStatus !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inst.officialName.toLowerCase().includes(q) ||
        inst.aicteIdentifier.toLowerCase().includes(q) ||
        inst.city.toLowerCase().includes(q) ||
        inst.state.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingApprovals = institutions.filter(
    i => i.registrationStatus === 'SUBMITTED' || i.registrationStatus === 'UNDER_REVIEW'
  );

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalInst) return;
    reviewInstitution(reviewModalInst.id, reviewDecision, reviewNote || 'Approved following AICTE scrutiny.');
    setReviewModalInst(null);
    setReviewNote('');
  };

  const selectedInstCourses = courses.filter(c => c.institutionId === selectedInst?.id);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#D5DEE8]">
        <div>
          <h1 className="text-[26px] font-semibold text-[#172536] tracking-tight leading-tight">
            Institutions & Course Management
          </h1>
          <p className="text-[14px] text-[#59697C] mt-0.5">
            Directory of onboarded technical institutions, approved seat quotas, and accreditation review.
          </p>
        </div>

        <button
          onClick={() => navigate('/institution/register')}
          className="px-4 py-2 bg-[#10243A] hover:bg-[#0B1728] text-white text-[14px] font-medium rounded transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Register Institution</span>
        </button>
      </div>

      {/* Pending Approvals Strip (AICTE Admin View) */}
      {currentUser.role === 'AICTE_ADMIN' && pendingApprovals.length > 0 && (
        <div className="bg-white border border-[#C17B20] rounded p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C17B20]" />
              <h2 className="text-[15px] font-semibold text-[#172536]">
                Pending Institution Approvals ({pendingApprovals.length})
              </h2>
            </div>
            <span className="text-[12.5px] text-[#59697C]">
              Accounts remain restricted from uploading student records until authorized
            </span>
          </div>

          <div className="divide-y divide-[#E2E8F0]">
            {pendingApprovals.map((inst) => (
              <div key={inst.id} className="py-2.5 flex items-center justify-between text-[13.5px]">
                <div>
                  <span className="font-semibold text-[#172536]">{inst.officialName}</span>
                  <span className="text-[#59697C] ml-2 font-mono text-[12.5px]">(AICTE ID: {inst.aicteIdentifier} · {inst.city}, {inst.state})</span>
                  <div className="text-[12px] text-[#59697C] mt-0.5">
                    Sanctioned Intake: {inst.approvedIntake} seats · Admin: {inst.adminName}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setReviewModalInst(inst);
                    setReviewDecision('APPROVED');
                    setReviewNote(`AICTE clearance verified. Account activated with College Admin credentials for ${inst.adminName}.`);
                  }}
                  className="px-3 py-1 bg-[#2457A7] hover:bg-[#3169B5] text-white rounded text-[13px] font-medium transition-colors"
                >
                  Review & Approve
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Layout: Searchable Table + Institution Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7/12): Searchable Institutions Table */}
        <div className="lg:col-span-7 bg-white border border-[#D5DEE8] rounded p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#D5DEE8]">
            <h2 className="text-[18px] font-semibold text-[#172536]">Institutional Directory</h2>
            <div className="flex items-center gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-[13px] rounded border border-[#D5DEE8] px-2 py-1 bg-white text-[#172536]"
              >
                <option value="ALL">All Categories</option>
                <option value="STATE_GOVERNMENT">State Govt</option>
                <option value="CENTRAL_UNIVERSITY">Central Univ</option>
                <option value="PRIVATE_AUTONOMOUS">Autonomous</option>
                <option value="AFFILIATED">Affiliated</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="text-[13px] rounded border border-[#D5DEE8] px-2 py-1 bg-white text-[#172536]"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#59697C] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by institution name, AICTE ID, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-[13.5px] rounded border border-[#D5DEE8] text-[#172536] focus:border-[#2457A7] focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13.5px]">
              <thead>
                <tr className="border-b border-[#D5DEE8] text-[#59697C] text-[13px]">
                  <th className="pb-2 font-normal">Institution Name</th>
                  <th className="pb-2 font-normal">Location</th>
                  <th className="pb-2 font-normal text-center">Intake</th>
                  <th className="pb-2 font-normal text-center">Status</th>
                  <th className="pb-2 font-normal text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredInstitutions.map((inst) => {
                  const isSelected = selectedInst?.id === inst.id;
                  return (
                    <tr
                      key={inst.id}
                      onClick={() => setSelectedInst(inst)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#EAF0F7]' : 'hover:bg-[#F4F6F9]'
                      }`}
                    >
                      <td className="py-2.5 font-medium text-[#172536] max-w-[220px] truncate" title={inst.officialName}>
                        {inst.officialName}
                        <span className="block text-[11.5px] text-[#59697C] font-mono">{inst.aicteIdentifier}</span>
                      </td>
                      <td className="py-2.5 text-[#59697C]">{inst.city}, {inst.state}</td>
                      <td className="py-2.5 text-center font-mono text-[13px]">
                        {inst.currentEnrolment} / {inst.approvedIntake}
                      </td>
                      <td className="py-2.5 text-center">
                        <span
                          className={`text-[12px] font-medium ${
                            inst.registrationStatus === 'ACTIVE'
                              ? 'text-[#16805D]'
                              : 'text-[#C17B20]'
                          }`}
                        >
                          {inst.registrationStatus}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="text-[13px] text-[#2457A7] font-medium">Select</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right (5/12): Institution Detail Surface */}
        <div className="lg:col-span-5 bg-white border border-[#D5DEE8] rounded p-5 space-y-4">
          {selectedInst ? (
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#D5DEE8]">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-[18px] font-semibold text-[#172536]">{selectedInst.officialName}</h3>
                    <div className="text-[12.5px] text-[#59697C] font-mono mt-0.5">
                      AICTE ID: {selectedInst.aicteIdentifier} · {selectedInst.category.replace('_', ' ')}
                    </div>
                  </div>
                  <span
                    className={`text-[12px] font-semibold px-2 py-0.5 rounded ${
                      selectedInst.registrationStatus === 'ACTIVE'
                        ? 'bg-emerald-50 text-[#16805D]'
                        : 'bg-amber-50 text-[#C17B20]'
                    }`}
                  >
                    {selectedInst.registrationStatus}
                  </span>
                </div>

                <div className="text-[13px] text-[#59697C] mt-2 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#59697C]" />
                    <span>{selectedInst.city}, {selectedInst.state} ({selectedInst.latitude.toFixed(4)}°N, {selectedInst.longitude.toFixed(4)}°E)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#59697C]" />
                    <span>{selectedInst.officialEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-[#59697C]" />
                    <span>{selectedInst.website}</span>
                  </div>
                </div>
              </div>

              {/* Sanctioned Programs Table */}
              <div>
                <h4 className="text-[15px] font-semibold text-[#172536] mb-2">Approved Academic Programs</h4>
                <div className="overflow-x-auto border border-[#D5DEE8] rounded">
                  <table className="w-full text-left text-[13px]">
                    <thead className="bg-[#F4F6F9] border-b border-[#D5DEE8] text-[#59697C]">
                      <tr>
                        <th className="py-2 px-2.5 font-normal">Program</th>
                        <th className="py-2 px-2.5 font-normal">Level</th>
                        <th className="py-2 px-2.5 font-normal text-right">Quota</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {selectedInstCourses.map((crs) => (
                        <tr key={crs.id}>
                          <td className="py-2 px-2.5 font-medium text-[#172536]">{crs.courseName}</td>
                          <td className="py-2 px-2.5 text-[#59697C]">{crs.programLevel} ({crs.mode})</td>
                          <td className="py-2 px-2.5 text-right font-mono font-medium">{crs.enrolledCount}/{crs.approvedIntake}</td>
                        </tr>
                      ))}
                      {selectedInstCourses.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-[#59697C]">
                            Standard programs ({selectedInst.programsCount} sanctioned disciplines).
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="text-[12px] text-[#59697C] pt-2 border-t border-[#D5DEE8]">
                Administrator in charge: <span className="font-medium text-[#172536]">{selectedInst.adminName}</span> ({selectedInst.adminDesignation})
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-[13.5px] text-[#59697C]">
              Select an institution from the list to view its accreditation and programs.
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModalInst && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded max-w-md w-full p-6 border border-[#D5DEE8] shadow-lg space-y-4">
            <h3 className="text-[18px] font-semibold text-[#172536]">
              Review Institution Accreditation
            </h3>
            <p className="text-[13px] text-[#59697C]">
              Review submission for <span className="font-semibold text-[#172536]">{reviewModalInst.officialName}</span>.
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex gap-4 text-[13.5px]">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="decision"
                    checked={reviewDecision === 'APPROVED'}
                    onChange={() => setReviewDecision('APPROVED')}
                  />
                  <span>Approve & Activate</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="decision"
                    checked={reviewDecision === 'REJECTED'}
                    onChange={() => setReviewDecision('REJECTED')}
                  />
                  <span>Reject</span>
                </label>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#172536] mb-1">Scrutiny Note</label>
                <textarea
                  rows={3}
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="w-full p-2 text-[13px] rounded border border-[#D5DEE8] text-[#172536] focus:border-[#2457A7] focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D5DEE8]">
                <button
                  type="button"
                  onClick={() => setReviewModalInst(null)}
                  className="px-3 py-1.5 text-[13px] text-[#59697C] hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#2457A7] hover:bg-[#3169B5] text-white text-[13px] font-medium rounded"
                >
                  Confirm Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
