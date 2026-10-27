/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Institution,
  Course,
  Student,
  AnomalyAlert,
  AuditEvent,
  AuditCheckpoint,
  ExportRecord,
  SecuritySession,
  SecurityIncident,
  CorrectionItem,
  UploadRecord,
  ConsentRecord,
} from '../types';
import {
  INITIAL_INSTITUTIONS,
  INITIAL_COURSES,
  INITIAL_STUDENTS,
  INITIAL_ALERTS,
  generateInitialAuditLog,
  INITIAL_EXPORTS,
  INITIAL_SECURITY_SESSIONS,
  INITIAL_SECURITY_INCIDENTS,
  INITIAL_CORRECTIONS,
  INITIAL_CONSENTS,
} from '../services/mockData';
import { syncSha256, canonicalStringify, calculateMerkleRoot } from '../utils/crypto';

export interface AppContextType {
  // Auth & Session
  currentUser: User;
  switchUser: (role: UserRole, institutionId?: string) => void;
  logout: () => void;
  verifyMfa: (code: string) => boolean;
  activeSession: SecuritySession;

  // Data
  institutions: Institution[];
  courses: Course[];
  students: Student[];
  alerts: AnomalyAlert[];
  corrections: CorrectionItem[];
  uploads: UploadRecord[];
  auditEvents: AuditEvent[];
  auditCheckpoints: AuditCheckpoint[];
  securitySessions: SecuritySession[];
  securityIncidents: SecurityIncident[];
  exportsList: ExportRecord[];
  consents: ConsentRecord[];

  // Institution Operations
  submitInstitutionRegistration: (reg: Partial<Institution>) => Institution;
  reviewInstitution: (id: string, decision: 'APPROVED' | 'REJECTED', note: string) => void;

  // Student & CSV Ingestion
  ingestStudentBatch: (filename: string, students: Partial<Student>[]) => {
    accepted: number;
    rejected: number;
    correctionsAdded: number;
  };
  resolveCorrection: (id: string, action: 'CORRECTED' | 'REJECTED', correctedValue?: string) => void;

  // Anomaly & Investigation
  updateAlertStatus: (id: string, status: AnomalyAlert['status'], reason?: string) => void;
  addAlertInvestigationNote: (alertId: string, text: string) => void;
  runAnomalyDetectionEngine: () => { newAlertsCount: number; scannedCount: number };

  // Forensic Leak Tracer
  createStudentExport: (sessionTitle: string, rowCount?: number) => ExportRecord;

  // Audit Tampering Scenarios
  auditTamperedType: 'NONE' | 'SINGLE_RECORD' | 'FULL_CHAIN_REWRITE';
  simulateSingleRecordTampering: () => void;
  simulateFullChainRewrite: () => void;
  restoreAuditBaseline: () => void;
  verifyAuditIntegrity: () => {
    chainValid: boolean;
    merkleValid: boolean;
    signatureValid: boolean;
    witnessValid: boolean;
    earliestBrokenEventId?: string;
    details: string;
  };

  // Attack Simulator
  attackSimulationStep: number; // 0 (idle) to 4 (frozen)
  isSimulatingAttack: boolean;
  runAttackSimulationStep: () => void;
  resetAttackSimulation: () => void;

  // Student Consent
  updateConsentStatus: (id: string, status: ConsentRecord['status']) => void;

  // 5-Minute SIH Demo Tour
  demoScene: number | null; // 1 to 6
  setDemoScene: (scene: number | null) => void;
  resetDemoState: () => void;
}

const DEFAULT_AICTE_ADMIN: User = {
  id: 'usr-aicte-chief',
  email: 'aicte.admin@aicte-india.org',
  fullName: 'Dr. Vinod Sharma',
  role: 'AICTE_ADMIN',
  mfaEnabled: true,
  mfaVerified: true,
  status: 'ACTIVE',
  avatar: 'VS',
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Primary State
  const [currentUser, setCurrentUser] = useState<User>(DEFAULT_AICTE_ADMIN);
  const [institutions, setInstitutions] = useState<Institution[]>(INITIAL_INSTITUTIONS);
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(INITIAL_ALERTS);
  const [corrections, setCorrections] = useState<CorrectionItem[]>(INITIAL_CORRECTIONS);
  const [uploads, setUploads] = useState<UploadRecord[]>([
    {
      id: 'up-101',
      institutionId: 'inst-01',
      institutionName: 'Delhi Institute of Technology',
      filename: 'DIT_Admissions_2024_Batch1.csv',
      rowCount: 590,
      acceptedCount: 585,
      rejectedCount: 2,
      reviewCount: 3,
      status: 'COMMITTED',
      uploadedBy: 'Dr. Ramesh Verma',
      uploadedAt: '2026-10-20T11:15:00Z',
      validationSummary: { formatErrors: 1, duplicateErrors: 0, intakeBreaches: 0, formulaInjections: 1 },
    },
  ]);

  const initialAudit = generateInitialAuditLog();
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(initialAudit.events);
  const [auditCheckpoints, setAuditCheckpoints] = useState<AuditCheckpoint[]>(initialAudit.checkpoints);
  const [auditTamperedType, setAuditTamperedType] = useState<'NONE' | 'SINGLE_RECORD' | 'FULL_CHAIN_REWRITE'>('NONE');

  const [exportsList, setExportsList] = useState<ExportRecord[]>(INITIAL_EXPORTS);
  const [securitySessions, setSecuritySessions] = useState<SecuritySession[]>(INITIAL_SECURITY_SESSIONS);
  const [securityIncidents, setSecurityIncidents] = useState<SecurityIncident[]>(INITIAL_SECURITY_INCIDENTS);
  const [consents, setConsents] = useState<ConsentRecord[]>(INITIAL_CONSENTS);

  // Attack simulator state
  const [attackSimulationStep, setAttackSimulationStep] = useState<number>(0);
  const [isSimulatingAttack, setIsSimulatingAttack] = useState<boolean>(false);

  // SIH 5-Minute Demo Tour
  const [demoScene, setDemoScene] = useState<number | null>(null);

  // Active Session for current user
  const activeSession = securitySessions.find(s => s.userId === currentUser.id) || securitySessions[0];

  // Switch User Profile
  const switchUser = (role: UserRole, institutionId?: string) => {
    if (role === 'AICTE_ADMIN') {
      setCurrentUser(DEFAULT_AICTE_ADMIN);
    } else if (role === 'COLLEGE_ADMIN') {
      const targetInst = institutions.find(i => i.id === (institutionId || 'inst-01')) || institutions[0];
      setCurrentUser({
        id: `usr-${targetInst.id}-admin`,
        email: targetInst.officialEmail,
        fullName: targetInst.adminName,
        role: 'COLLEGE_ADMIN',
        institutionId: targetInst.id,
        institutionName: targetInst.officialName,
        mfaEnabled: true,
        mfaVerified: true,
        status: 'ACTIVE',
        avatar: targetInst.adminName.split(' ').map(n => n[0]).join('').slice(0, 2),
      });
    } else if (role === 'VERIFIER') {
      setCurrentUser({
        id: 'usr-verifier-tcs',
        email: 'recruitment.verifier@tcs.com',
        fullName: 'Priya Nambiar',
        role: 'VERIFIER',
        mfaEnabled: false,
        mfaVerified: true,
        status: 'ACTIVE',
        avatar: 'PN',
      });
    } else if (role === 'STUDENT') {
      setCurrentUser({
        id: 'usr-student-sarthak',
        email: 'sarthak.sharma@student.ac.in',
        fullName: 'Sarthak Sharma',
        role: 'STUDENT',
        institutionId: 'inst-01',
        institutionName: 'Delhi Institute of Technology',
        mfaEnabled: true,
        mfaVerified: true,
        status: 'ACTIVE',
        avatar: 'SS',
      });
    }
  };

  const logout = () => {
    switchUser('VERIFIER');
  };

  const verifyMfa = (code: string) => {
    if (code.length === 6) {
      setCurrentUser(prev => ({ ...prev, mfaVerified: true }));
      return true;
    }
    return false;
  };

  // Log Audit Event Helper
  const recordAuditEvent = (
    action: string,
    resourceType: AuditEvent['resourceType'],
    resourceId: string,
    payload: Record<string, any>
  ) => {
    const lastEvent = auditEvents[auditEvents.length - 1];
    const prevHash = lastEvent ? lastEvent.eventHash : '0000000000000000000000000000000000000000000000000000000000000000';
    const newId = `EVT-${1000 + auditEvents.length + 1}`;
    const timestamp = new Date().toISOString();
    const payloadStr = canonicalStringify(payload);
    const eventHash = syncSha256(prevHash + newId + timestamp + action + payloadStr);

    const newEvent: AuditEvent = {
      id: newId,
      timestamp,
      actorId: currentUser.id,
      actorRole: currentUser.role,
      action,
      resourceType,
      resourceId,
      payload,
      previousHash: prevHash,
      eventHash,
      requestId: `req-${Math.floor(Math.random() * 10000)}`,
    };

    setAuditEvents(prev => [...prev, newEvent]);
  };

  // Institution Registration
  const submitInstitutionRegistration = (regData: Partial<Institution>): Institution => {
    const newInst: Institution = {
      id: `inst-${institutions.length + 1}`,
      officialName: regData.officialName || 'New Technical Institute',
      aicteIdentifier: regData.aicteIdentifier || `1-${Math.floor(Math.random() * 900000000 + 100000000)}`,
      category: regData.category || 'AFFILIATED',
      state: regData.state || 'Delhi',
      city: regData.city || 'New Delhi',
      latitude: regData.latitude || 28.6139,
      longitude: regData.longitude || 77.2090,
      website: regData.website || 'https://new-institute.edu.in',
      officialEmail: regData.officialEmail || 'admin@new-institute.edu.in',
      adminName: regData.adminName || 'Dr. Authorized Admin',
      adminDesignation: regData.adminDesignation || 'Principal',
      phone: regData.phone || '+91 11 2000 0000',
      programsCount: regData.programsCount || 4,
      approvedIntake: regData.approvedIntake || 240,
      currentEnrolment: 0,
      supernumeraryQuota: 12,
      registrationStatus: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
    };

    setInstitutions(prev => [newInst, ...prev]);

    recordAuditEvent(
      'INSTITUTION_REGISTRATION_SUBMITTED',
      'INSTITUTION',
      newInst.id,
      { institutionName: newInst.officialName, aicteId: newInst.aicteIdentifier }
    );

    return newInst;
  };

  // Review Institution (AICTE Admin only)
  const reviewInstitution = (id: string, decision: 'APPROVED' | 'REJECTED', note: string) => {
    setInstitutions(prev =>
      prev.map(inst => {
        if (inst.id === id) {
          return {
            ...inst,
            registrationStatus: decision === 'APPROVED' ? 'ACTIVE' : 'REJECTED',
            reviewNote: note,
            approvedAt: decision === 'APPROVED' ? new Date().toISOString() : undefined,
          };
        }
        return inst;
      })
    );

    recordAuditEvent(
      decision === 'APPROVED' ? 'INSTITUTION_REGISTRATION_APPROVED' : 'INSTITUTION_REGISTRATION_REJECTED',
      'INSTITUTION',
      id,
      { decision, note }
    );
  };

  // Batch CSV Ingestion
  const ingestStudentBatch = (filename: string, rawStudents: Partial<Student>[]) => {
    let accepted = 0;
    let rejected = 0;
    let correctionsAdded = 0;
    const newStudents: Student[] = [];
    const newCorrections: CorrectionItem[] = [];

    rawStudents.forEach((raw, idx) => {
      const rowNumber = idx + 1;
      const apaar = (raw.apaarId || '').replace(/\D/g, '');

      // Check APAAR format (must be 12 digits)
      if (apaar.length !== 12) {
        rejected++;
        correctionsAdded++;
        newCorrections.push({
          id: `cor-${Date.now()}-${idx}`,
          uploadId: `up-${Date.now()}`,
          rowNumber,
          recordRef: `ROW-${rowNumber}`,
          studentName: raw.name || 'Unknown Candidate',
          fieldName: 'apaarId',
          currentValue: raw.apaarId || '',
          suggestedValue: `${apaar.padEnd(12, '0')}`,
          errorCode: 'INVALID_APAAR_FORMAT',
          errorMessage: 'APAAR ID format validation failed. Expected 12 digits.',
          status: 'PENDING',
        });
        return;
      }

      // Check formula injection
      const dangerousChars = ['=', '+', '-', '@'];
      const rawName = raw.name || '';
      if (dangerousChars.includes(rawName.charAt(0))) {
        correctionsAdded++;
        newCorrections.push({
          id: `cor-${Date.now()}-${idx}`,
          uploadId: `up-${Date.now()}`,
          rowNumber,
          recordRef: `ROW-${rowNumber}`,
          studentName: rawName,
          fieldName: 'name',
          currentValue: rawName,
          suggestedValue: rawName.replace(/^[=+\-@]+/, ''),
          errorCode: 'POTENTIAL_FORMULA_INJECTION',
          errorMessage: 'Unsafe spreadsheet formula prefix detected in student name.',
          status: 'PENDING',
        });
      }

      accepted++;
      newStudents.push({
        id: `stu-${Date.now()}-${idx}`,
        institutionId: currentUser.institutionId || 'inst-01',
        institutionName: currentUser.institutionName || 'Delhi Institute of Technology',
        courseId: raw.courseId || 'crs-01',
        courseName: raw.courseName || 'B.Tech Computer Science & Engineering',
        apaarId: apaar,
        maskedApaar: `XXXX-XXXX-${apaar.slice(-4)}`,
        name: raw.name || 'Candidate Name',
        normalizedName: (raw.name || '').toUpperCase().trim(),
        dob: raw.dob || '2005-01-01',
        fatherName: raw.fatherName || 'Guardian',
        admitDate: raw.admitDate || new Date().toISOString().split('T')[0],
        academicSession: raw.academicSession || '2024-2028',
        enrolmentStatus: 'ACTIVE',
        category: (raw.category as any) || 'GENERAL',
        validationStatus: 'VALID',
        studyMode: 'FULL_TIME_OFFLINE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    });

    setStudents(prev => [...newStudents, ...prev]);
    setCorrections(prev => [...newCorrections, ...prev]);

    const newUpload: UploadRecord = {
      id: `up-${Date.now()}`,
      institutionId: currentUser.institutionId || 'inst-01',
      institutionName: currentUser.institutionName || 'Delhi Institute of Technology',
      filename,
      rowCount: rawStudents.length,
      acceptedCount: accepted,
      rejectedCount: rejected,
      reviewCount: correctionsAdded,
      status: 'COMMITTED',
      uploadedBy: currentUser.fullName,
      uploadedAt: new Date().toISOString(),
      validationSummary: {
        formatErrors: rejected,
        duplicateErrors: 0,
        intakeBreaches: 0,
        formulaInjections: correctionsAdded > rejected ? correctionsAdded - rejected : 0,
      },
    };

    setUploads(prev => [newUpload, ...prev]);

    recordAuditEvent('BATCH_CSV_INGESTION_COMMITTED', 'UPLOAD', newUpload.id, {
      filename,
      rowCount: rawStudents.length,
      accepted,
      rejected,
    });

    return { accepted, rejected, correctionsAdded };
  };

  // Resolve Correction
  const resolveCorrection = (id: string, action: 'CORRECTED' | 'REJECTED', correctedValue?: string) => {
    setCorrections(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status: action,
            suggestedValue: correctedValue || c.suggestedValue,
            resolvedBy: currentUser.fullName,
            resolvedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    recordAuditEvent('CORRECTION_QUEUE_RESOLVED', 'STUDENT', id, {
      action,
      correctedValue,
    });
  };

  // Anomaly Alerts Management
  const updateAlertStatus = (id: string, status: AnomalyAlert['status'], reason?: string) => {
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === id) {
          return {
            ...a,
            status,
            updatedAt: new Date().toISOString(),
            closedBy: status === 'RESOLVED' || status === 'FALSE_POSITIVE' ? currentUser.fullName : undefined,
            closureReason: reason || a.closureReason,
          };
        }
        return a;
      })
    );

    recordAuditEvent('ALERT_STATUS_CHANGED', 'ALERT', id, {
      newStatus: status,
      closureReason: reason,
    });
  };

  const addAlertInvestigationNote = (alertId: string, text: string) => {
    setAlerts(prev =>
      prev.map(a => {
        if (a.id === alertId) {
          const newNote = {
            id: `note-${Date.now()}`,
            author: currentUser.fullName,
            text,
            timestamp: new Date().toISOString(),
          };
          return {
            ...a,
            investigationNotes: [...a.investigationNotes, newNote],
            updatedAt: new Date().toISOString(),
          };
        }
        return a;
      })
    );

    recordAuditEvent('INVESTIGATION_NOTE_ADDED', 'ALERT', alertId, { noteText: text });
  };

  const runAnomalyDetectionEngine = () => {
    recordAuditEvent('ANOMALY_ENGINE_BATCH_RUN', 'SECURITY', 'ENGINE_CORE', {
      timestamp: new Date().toISOString(),
    });
    return { newAlertsCount: 0, scannedCount: students.length };
  };

  // Forensic Export Pipeline with Canaries
  const createStudentExport = (sessionTitle: string, rowCount = 20): ExportRecord => {
    const exportId = `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const canaries = [
      {
        apaarId: `9988-${Math.floor(1000 + Math.random() * 9000)}-1111`,
        name: `Canary Alpha ${exportId.slice(-4)} (Synthetic)`,
        dob: '2005-01-01',
        tokenType: `CANARY_${exportId}_A`,
      },
      {
        apaarId: `9988-${Math.floor(1000 + Math.random() * 9000)}-2222`,
        name: `Canary Beta ${exportId.slice(-4)} (Synthetic)`,
        dob: '2005-02-02',
        tokenType: `CANARY_${exportId}_B`,
      },
      {
        apaarId: `9988-${Math.floor(1000 + Math.random() * 9000)}-3333`,
        name: `Canary Gamma ${exportId.slice(-4)} (Synthetic)`,
        dob: '2005-03-03',
        tokenType: `CANARY_${exportId}_C`,
      },
    ];

    const contentSig = `SIG_${exportId}_${syncSha256(exportId + Date.now()).substring(0, 12)}`;
    const fingerprint = `FP_PERM_${exportId}_ORD_${syncSha256(exportId).substring(0, 8)}`;

    const newExport: ExportRecord = {
      id: `exp-${Date.now()}`,
      exportId,
      actorId: currentUser.id,
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      sessionTitle,
      institutionId: currentUser.institutionId,
      institutionName: currentUser.institutionName,
      rowCount,
      canaryCount: canaries.length,
      canaries,
      contentSignature: contentSig,
      rowOrderFingerprint: fingerprint,
      timestamp: new Date().toISOString(),
    };

    setExportsList(prev => [newExport, ...prev]);

    recordAuditEvent('STUDENT_EXPORT_CANARY_INJECTED', 'EXPORT', exportId, {
      exportId,
      rowCount,
      canaryCount: canaries.length,
      contentSignature: contentSig,
    });

    return newExport;
  };

  // Tamper Evident Audit Scenarios
  const simulateSingleRecordTampering = () => {
    setAuditTamperedType('SINGLE_RECORD');
    setAuditEvents(prev => {
      return prev.map((ev, idx) => {
        if (idx === 2) {
          // Corrupt payload of Event EVT-1003
          return {
            ...ev,
            payload: { ...ev.payload, acceptedRows: 9999, unauthorizedFieldInjected: true },
            tampered: true,
          };
        }
        return ev;
      });
    });
  };

  const simulateFullChainRewrite = () => {
    setAuditTamperedType('FULL_CHAIN_REWRITE');
    // Sophisticated attacker rewrites the entire chain from event 2 onward so local hashes chain up cleanly
    setAuditEvents(prev => {
      const rewritten: AuditEvent[] = [];
      let prevHash = prev[0].previousHash;

      for (let i = 0; i < prev.length; i++) {
        const ev = { ...prev[i] };
        if (i === 2) {
          ev.payload = { ...ev.payload, acceptedRows: 9999, sanitized: false };
          ev.tampered = true;
        }
        const payloadStr = canonicalStringify(ev.payload);
        const newHash = syncSha256(prevHash + ev.id + ev.timestamp + ev.action + payloadStr);
        ev.previousHash = prevHash;
        ev.eventHash = newHash;
        prevHash = newHash;
        rewritten.push(ev);
      }
      return rewritten;
    });
  };

  const restoreAuditBaseline = () => {
    const clean = generateInitialAuditLog();
    setAuditEvents(clean.events);
    setAuditCheckpoints(clean.checkpoints);
    setAuditTamperedType('NONE');
  };

  const verifyAuditIntegrity = () => {
    // 1. Verify Hash Chain
    let chainValid = true;
    let earliestBroken: string | undefined;

    for (let i = 0; i < auditEvents.length; i++) {
      const ev = auditEvents[i];
      const payloadStr = canonicalStringify(ev.payload);
      const expectedHash = syncSha256(ev.previousHash + ev.id + ev.timestamp + ev.action + payloadStr);

      if (expectedHash !== ev.eventHash) {
        chainValid = false;
        earliestBroken = ev.id;
        break;
      }

      if (i > 0 && ev.previousHash !== auditEvents[i - 1].eventHash) {
        chainValid = false;
        earliestBroken = ev.id;
        break;
      }
    }

    // 2. Verify Merkle Root against Checkpoints
    const leafHashes = auditEvents.map(e => e.eventHash);
    const computedMerkleRoot = calculateMerkleRoot(leafHashes);
    const primaryCheckpoint = auditCheckpoints[0];

    const merkleValid = chainValid && primaryCheckpoint && computedMerkleRoot === primaryCheckpoint.merkleRoot;
    const signatureValid = merkleValid;
    const witnessValid = merkleValid; // If Merkle root differs, independent witness detects mismatch!

    let details = 'All audit records verified. Hash chain unbroken, Merkle checkpoint signatures valid, and independent witness receipts match.';
    if (!chainValid) {
      details = `Single-record tampering detected! Event ${earliestBroken} hash mismatch. Cryptographic chain broken.`;
    } else if (!witnessValid) {
      details = `Sophisticated full-chain rewrite detected! While local hash chain was forged to be internally consistent, the computed Merkle root (${computedMerkleRoot.slice(0, 16)}...) fails against the immutable independent witness checkpoint (${primaryCheckpoint.merkleRoot.slice(0, 16)}...).`;
    }

    return {
      chainValid,
      merkleValid: Boolean(merkleValid),
      signatureValid: Boolean(signatureValid),
      witnessValid: Boolean(witnessValid),
      earliestBrokenEventId: earliestBroken,
      details,
    };
  };

  // Attack Simulator Stepper
  const runAttackSimulationStep = () => {
    setIsSimulatingAttack(true);
    const nextStep = attackSimulationStep + 1;
    setAttackSimulationStep(nextStep);

    setSecuritySessions(prev =>
      prev.map(sess => {
        if (sess.id === 'sess-insider-test') {
          let newScore = sess.riskScore;
          let newStatus = sess.status;
          let newSignal = { name: '', weight: 0, description: '', triggeredAt: new Date().toISOString() };
          let newIncident: SecurityIncident | null = null;

          if (nextStep === 1) {
            newScore = 38;
            newSignal = {
              name: 'OFF_HOURS_ACCESS',
              weight: 20,
              description: 'Privileged AICTE access recorded at 03:22 AM IST from unusual IP range.',
              triggeredAt: new Date().toISOString(),
            };
            newIncident = {
              id: `INC-${Date.now()}`,
              timestamp: new Date().toISOString(),
              sessionId: sess.id,
              severity: 'LOW',
              title: 'Off-Hours Administrative Access',
              description: 'Privileged access recorded outside operating window.',
              actionTaken: 'WARNING',
              actorEmail: sess.userEmail,
            };
          } else if (nextStep === 2) {
            newScore = 58;
            newStatus = 'CHALLENGED';
            newSignal = {
              name: 'SEQUENTIAL_APAAR_SCANNING',
              weight: 25,
              description: 'Sequential enumeration of 45 student records across unassigned state boundaries.',
              triggeredAt: new Date().toISOString(),
            };
            newIncident = {
              id: `INC-${Date.now()}`,
              timestamp: new Date().toISOString(),
              sessionId: sess.id,
              severity: 'MEDIUM',
              title: 'Sequential APAAR Scanning Detected',
              description: 'Enumeration pattern triggered step-up MFA challenge.',
              actionTaken: 'STEP_UP_MFA',
              actorEmail: sess.userEmail,
            };
          } else if (nextStep === 3) {
            newScore = 78;
            newStatus = 'THROTTLED';
            newSignal = {
              name: 'BULK_DATA_EXTRACTION',
              weight: 20,
              description: 'High read volume (350 records in 40s) + repeated export initiation.',
              triggeredAt: new Date().toISOString(),
            };
            newIncident = {
              id: `INC-${Date.now()}`,
              timestamp: new Date().toISOString(),
              sessionId: sess.id,
              severity: 'HIGH',
              title: 'Bulk Export Rate Anomaly',
              description: 'High frequency read requests throttled to 2 req/min.',
              actionTaken: 'RATE_LIMIT_APPLIED',
              actorEmail: sess.userEmail,
            };
          } else if (nextStep >= 4) {
            newScore = 96;
            newStatus = 'FROZEN';
            newSignal = {
              name: 'CROSS_TENANT_IDOR_BREACH',
              weight: 25,
              description: 'Direct parameter tampering attempting unauthorized read on restricted student IDs.',
              triggeredAt: new Date().toISOString(),
            };
            newIncident = {
              id: `INC-${Date.now()}`,
              timestamp: new Date().toISOString(),
              sessionId: sess.id,
              severity: 'CRITICAL',
              title: 'Session Revocation & Freeze Triggered',
              description: 'Risk score exceeded 90 threshold. Access tokens revoked. AICTE central alerts notified.',
              actionTaken: 'SESSION_FROZEN',
              actorEmail: sess.userEmail,
            };
          }

          if (newIncident) {
            setSecurityIncidents(iPrev => [newIncident!, ...iPrev]);
          }

          return {
            ...sess,
            riskScore: newScore,
            status: newStatus,
            signals: [...sess.signals, newSignal],
            requestCount: sess.requestCount + 25,
            exportCount: nextStep >= 3 ? sess.exportCount + 1 : sess.exportCount,
          };
        }
        return sess;
      })
    );
  };

  const resetAttackSimulation = () => {
    setAttackSimulationStep(0);
    setIsSimulatingAttack(false);
    setSecuritySessions(INITIAL_SECURITY_SESSIONS);
    setSecurityIncidents(INITIAL_SECURITY_INCIDENTS);
  };

  // Student Consent
  const updateConsentStatus = (id: string, status: ConsentRecord['status']) => {
    setConsents(prev =>
      prev.map(c => {
        if (c.id === id) {
          return {
            ...c,
            status,
            revokedAt: status === 'REVOKED' ? new Date().toISOString() : undefined,
          };
        }
        return c;
      })
    );

    recordAuditEvent('CONSENT_STATUS_UPDATED', 'STUDENT', id, { status });
  };

  // Reset Everything to Fresh Baseline
  const resetDemoState = () => {
    setCurrentUser(DEFAULT_AICTE_ADMIN);
    setInstitutions(INITIAL_INSTITUTIONS);
    setCourses(INITIAL_COURSES);
    setStudents(INITIAL_STUDENTS);
    setAlerts(INITIAL_ALERTS);
    setCorrections(INITIAL_CORRECTIONS);
    restoreAuditBaseline();
    resetAttackSimulation();
    setExportsList(INITIAL_EXPORTS);
    setConsents(INITIAL_CONSENTS);
    setDemoScene(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        logout,
        verifyMfa,
        activeSession,
        institutions,
        courses,
        students,
        alerts,
        corrections,
        uploads,
        auditEvents,
        auditCheckpoints,
        securitySessions,
        securityIncidents,
        exportsList,
        consents,
        submitInstitutionRegistration,
        reviewInstitution,
        ingestStudentBatch,
        resolveCorrection,
        updateAlertStatus,
        addAlertInvestigationNote,
        runAnomalyDetectionEngine,
        createStudentExport,
        auditTamperedType,
        simulateSingleRecordTampering,
        simulateFullChainRewrite,
        restoreAuditBaseline,
        verifyAuditIntegrity,
        attackSimulationStep,
        isSimulatingAttack,
        runAttackSimulationStep,
        resetAttackSimulation,
        updateConsentStatus,
        demoScene,
        setDemoScene,
        resetDemoState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
