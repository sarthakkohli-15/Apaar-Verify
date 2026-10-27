/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Institution } from '../../types';
import { ApaarLogo } from '../../components/common/ApaarLogo';
import { Footer } from '../../components/layout/Footer';
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldCheck,
  ArrowRight,
  Info,
} from 'lucide-react';

interface RegisterPageProps {
  navigate: (path: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ navigate }) => {
  const { submitInstitutionRegistration, institutions } = useApp();

  const [formData, setFormData] = useState({
    officialName: '',
    aicteIdentifier: '',
    category: 'PRIVATE_AUTONOMOUS' as Institution['category'],
    state: 'Maharashtra',
    city: 'Pune',
    latitude: 18.5204,
    longitude: 73.8567,
    officialEmail: '',
    website: '',
    adminName: '',
    adminDesignation: 'Registrar',
    phone: '',
    programsCount: 6,
    approvedIntake: 360,
    acceptedTerms: false,
    authorizedDeclaration: false,
  });

  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.acceptedTerms || !formData.authorizedDeclaration) {
      setError('You must accept the data handling terms and complete the legal authorization declaration.');
      return;
    }

    if (!formData.aicteIdentifier.trim()) {
      setError('AICTE Permanent Identifier is required.');
      return;
    }

    // Check for duplicate AICTE ID
    const exists = institutions.some(
      i => i.aicteIdentifier.trim().toLowerCase() === formData.aicteIdentifier.trim().toLowerCase()
    );
    if (exists) {
      setError(`An institution with AICTE Identifier "${formData.aicteIdentifier}" is already registered.`);
      return;
    }

    const newInst = submitInstitutionRegistration({
      officialName: formData.officialName,
      aicteIdentifier: formData.aicteIdentifier,
      category: formData.category,
      state: formData.state,
      city: formData.city,
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      officialEmail: formData.officialEmail,
      website: formData.website,
      adminName: formData.adminName,
      adminDesignation: formData.adminDesignation,
      phone: formData.phone,
      programsCount: Number(formData.programsCount),
      approvedIntake: Number(formData.approvedIntake),
    });

    setSubmittedRef(`REG-2026-${newInst.id.toUpperCase()}`);
  };

  return (
    <div
      className="min-h-screen bg-[#F4F6F9] text-[#172536] flex flex-col justify-between font-sans"
      style={{ fontFamily: 'Calibri, "Segoe UI", Arial, sans-serif' }}
    >
      {/* Header */}
      <header className="py-3 px-6 lg:px-12 border-b border-[#D5DEE8] bg-white flex items-center justify-between">
        <div
          onClick={() => navigate('/')}
          className="cursor-pointer"
        >
          <ApaarLogo variant="dark" size="md" withSubtitle={true} />
        </div>
        <div className="flex items-center gap-4 text-[13px]">
          <button onClick={() => navigate('/institution/registration-status')} className="text-[#59697C] hover:text-[#2457A7]">
            Check Application Status
          </button>
          <button onClick={() => navigate('/login')} className="text-[#2457A7] font-semibold hover:underline">
            Portal Sign In →
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8">
        {submittedRef ? (
          <div className="bg-white border border-[#DCE3EB] rounded-xl p-8 shadow-xs text-center">
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Registration Application Submitted</h1>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
              Your application has been placed in the AICTE Scrutiny & Approval queue. An AICTE Regional Officer will verify institutional accreditation before activating your College Admin account.
            </p>

            <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-lg max-w-md mx-auto text-left">
              <div className="text-[11px] text-slate-500">Application Reference ID:</div>
              <div className="text-base font-mono font-bold text-[#2457A7] mt-0.5">{submittedRef}</div>
              <div className="mt-2 text-[11px] text-slate-600 flex items-center justify-between">
                <span>Current Status:</span>
                <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  SUBMITTED · UNDER REVIEW
                </span>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <button
                onClick={() => navigate('/app/institutions')}
                className="px-5 py-2.5 bg-[#10243A] text-white rounded-lg text-xs font-semibold hover:bg-[#0B1728] transition-colors"
              >
                Inspect AICTE Review Queue (Judge Demo)
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-5 py-2.5 bg-white border border-[#DCE3EB] text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                Return to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-[#DCE3EB] rounded-xl p-6 sm:p-8 shadow-xs">
            <div className="mb-6 pb-4 border-b border-[#DCE3EB]">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#2457A7]/10 text-[#2457A7] rounded text-xs font-semibold mb-2">
                <Building2 className="w-3.5 h-3.5" />
                <span>AICTE Institution Onboarding Workflow</span>
              </div>
              <h1 className="text-2xl font-bold text-[#10243A] tracking-tight">
                Register AICTE-Approved Institution
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Colleges and polytechnics must register their permanent AICTE identifier to gain access to student APAAR data management.
              </p>
            </div>

            {error && (
              <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Institution Identity */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  01. Institutional Identity & Accreditation
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Institution Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune Institute of Computer Technology"
                      value={formData.officialName}
                      onChange={(e) => setFormData({ ...formData, officialName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] focus:ring-1 focus:ring-[#2457A7] focus:border-[#2457A7] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      AICTE Permanent Identifier <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 1-998822114"
                      value={formData.aicteIdentifier}
                      onChange={(e) => setFormData({ ...formData, aicteIdentifier: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] focus:ring-1 focus:ring-[#2457A7] focus:border-[#2457A7] text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Institution Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] focus:ring-1 focus:ring-[#2457A7] focus:border-[#2457A7] text-slate-900 bg-white"
                    >
                      <option value="CENTRAL_UNIVERSITY">Central University</option>
                      <option value="STATE_GOVERNMENT">State Government Funded</option>
                      <option value="PRIVATE_AUTONOMOUS">Private Autonomous Institution</option>
                      <option value="AFFILIATED">State University Affiliated College</option>
                      <option value="DEEMED">Deemed to be University</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Geographic Coordinates & Location */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  02. Campus Location & GIS Geolocation
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Latitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] text-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Campus Longitude</label>
                    <input
                      type="number"
                      step="0.0001"
                      required
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] text-slate-900 font-mono"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
                  <Info className="w-3 h-3 text-[#2457A7]" />
                  <span>Campus coordinates are required for the AICTE Impossibility Engine (Haversine cross-city distance validation).</span>
                </p>
              </div>

              {/* Authorized Admin Contact */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  03. Authorized Institutional Signatory
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Admin Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Dr. S. K. Patel"
                      value={formData.adminName}
                      onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                    <input
                      type="text"
                      required
                      placeholder="Registrar / Principal"
                      value={formData.adminDesignation}
                      onChange={(e) => setFormData({ ...formData, adminDesignation: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Official College Email</label>
                    <input
                      type="email"
                      required
                      placeholder="registrar@institute.edu.in"
                      value={formData.officialEmail}
                      onChange={(e) => setFormData({ ...formData, officialEmail: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Sanctioned Program Intakes */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  04. Approved Program Capacities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Number of AICTE Approved Programs
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={50}
                      value={formData.programsCount}
                      onChange={(e) => setFormData({ ...formData, programsCount: parseInt(e.target.value) || 1 })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Total AICTE Approved Intake (Seats)
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={5000}
                      value={formData.approvedIntake}
                      onChange={(e) => setFormData({ ...formData, approvedIntake: parseInt(e.target.value) || 10 })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#DCE3EB] text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Declarations */}
              <div className="pt-4 border-t border-[#DCE3EB] space-y-3">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.acceptedTerms}
                    onChange={(e) => setFormData({ ...formData, acceptedTerms: e.target.checked })}
                    className="mt-0.5 rounded text-[#2457A7] focus:ring-[#2457A7]"
                  />
                  <span>
                    I agree to the APAAR-VERIFY Platform Data Handling, PII Masking, and Cryptographic Audit Policies under AICTE regulations.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.authorizedDeclaration}
                    onChange={(e) => setFormData({ ...formData, authorizedDeclaration: e.target.checked })}
                    className="mt-0.5 rounded text-[#2457A7] focus:ring-[#2457A7]"
                  />
                  <span>
                    I solemnly declare that I am legally authorized to submit institutional enrollment data on behalf of this institution.
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#10243A] hover:bg-[#0B1728] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
                >
                  <span>Submit Application for AICTE Approval</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E06D10]" />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Official Government Footer */}
      <Footer navigate={navigate} />
    </div>
  );
};
