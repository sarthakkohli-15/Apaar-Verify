/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'AICTE_ADMIN' | 'COLLEGE_ADMIN' | 'VERIFIER' | 'STUDENT';

export type RegistrationStatus = 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVE';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  institutionId?: string;
  institutionName?: string;
  mfaEnabled: boolean;
  mfaVerified?: boolean;
  status: 'ACTIVE' | 'SUSPENDED' | 'FROZEN';
  avatar?: string;
}

export interface Institution {
  id: string;
  officialName: string;
  aicteIdentifier: string;
  category: 'CENTRAL_UNIVERSITY' | 'STATE_GOVERNMENT' | 'PRIVATE_AUTONOMOUS' | 'DEEMED' | 'AFFILIATED';
  state: string;
  city: string;
  latitude: number;
  longitude: number;
  website: string;
  officialEmail: string;
  adminName: string;
  adminDesignation: string;
  phone: string;
  programsCount: number;
  approvedIntake: number;
  currentEnrolment: number;
  supernumeraryQuota: number; // NRI / OCI / FN / EWS
  registrationStatus: RegistrationStatus;
  reviewNote?: string;
  submittedAt: string;
  approvedAt?: string;
}

export interface Course {
  id: string;
  institutionId: string;
  institutionName: string;
  courseName: string;
  programLevel: 'UG' | 'PG' | 'DIPLOMA' | 'DOCTORAL';
  academicSession: string;
  approvedIntake: number;
  enrolledCount: number;
  supernumeraryQuota: number;
  mode: 'FULL_TIME_OFFLINE' | 'PART_TIME' | 'ONLINE_DISTANCE';
  city: string;
  latitude: number;
  longitude: number;
}

export interface Student {
  id: string;
  institutionId: string;
  institutionName: string;
  courseId: string;
  courseName: string;
  apaarId: string; // 12-digit APAAR ID
  maskedApaar: string; // e.g. "XXXX-XXXX-4819"
  name: string;
  normalizedName: string;
  dob: string;
  fatherName: string;
  admitDate: string;
  academicSession: string;
  enrolmentStatus: 'ACTIVE' | 'PROVISIONAL' | 'COMPLETED' | 'TRANSFERRED' | 'WITHDRAWN';
  category: 'GENERAL' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'NRI' | 'OCI_FN';
  validationStatus: 'VALID' | 'REVIEW_REQUIRED' | 'FLAGGED';
  studyMode: 'FULL_TIME_OFFLINE' | 'PART_TIME' | 'ONLINE_DISTANCE';
  createdAt: string;
  updatedAt: string;
}

export interface EnrolmentEvent {
  id: string;
  studentId: string;
  institutionId: string;
  eventType: 'ENROLMENT_CREATED' | 'ENROLMENT_UPDATED' | 'STATUS_CHANGED' | 'CORRECTION_APPLIED';
  eventPayload: Record<string, any>;
  actorId: string;
  actorRole: UserRole;
  timestamp: string;
  previousHash: string;
  eventHash: string;
}

export interface UploadRecord {
  id: string;
  institutionId: string;
  institutionName: string;
  filename: string;
  rowCount: number;
  acceptedCount: number;
  rejectedCount: number;
  reviewCount: number;
  status: 'PROCESSING' | 'VALIDATED' | 'COMMITTED' | 'FAILED';
  uploadedBy: string;
  uploadedAt: string;
  validationSummary: {
    formatErrors: number;
    duplicateErrors: number;
    intakeBreaches: number;
    formulaInjections: number;
  };
}

export interface CorrectionItem {
  id: string;
  uploadId: string;
  rowNumber: number;
  recordRef: string;
  studentName: string;
  fieldName: string;
  currentValue: string;
  suggestedValue: string;
  errorCode: 'INVALID_APAAR_FORMAT' | 'INTAKE_CAPACITY_EXCEEDED' | 'DUPLICATE_IN_BATCH' | 'DATE_ANOMALY' | 'POTENTIAL_FORMULA_INJECTION';
  errorMessage: string;
  status: 'PENDING' | 'CORRECTED' | 'REJECTED' | 'REVIEW_REQUIRED';
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface AlertEvidence {
  ruleId: 'R1_PHYSICAL_IMPOSSIBILITY' | 'R2_FUZZY_IDENTITY' | 'R3_GHOST_SEAT_INTAKE' | 'R4_FRAUD_RING';
  ruleTitle: string;
  distanceKm?: number;
  overlapPeriod?: string;
  institutionsInvolved: string[];
  studentsInvolved: string[];
  similarityScore?: number;
  details: string;
  investigatorGuidance: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'INSTITUTION' | 'STUDENT' | 'COURSE';
  flagged?: boolean;
  institutionId?: string;
  apaarMasked?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
  flagged?: boolean;
  distanceKm?: number;
}

export interface AnomalyAlert {
  id: string;
  ruleId: 'R1_PHYSICAL_IMPOSSIBILITY' | 'R2_FUZZY_IDENTITY' | 'R3_GHOST_SEAT_INTAKE' | 'R4_FRAUD_RING';
  severity: number; // 0-100
  severityLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  summary: string;
  affectedInstitutions: string[];
  affectedStudents: { id: string; maskedApaar: string; name: string }[];
  evidence: AlertEvidence;
  graphData: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'FALSE_POSITIVE';
  createdAt: string;
  updatedAt: string;
  closedBy?: string;
  closureReason?: string;
  investigationNotes: { id: string; author: string; text: string; timestamp: string }[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: UserRole;
  action: string;
  resourceType: 'STUDENT' | 'INSTITUTION' | 'UPLOAD' | 'ALERT' | 'EXPORT' | 'SECURITY' | 'CREDENTIAL';
  resourceId: string;
  payload: Record<string, any>;
  previousHash: string;
  eventHash: string;
  requestId: string;
  tampered?: boolean;
}

export interface AuditCheckpoint {
  id: string;
  timeRange: string;
  eventCount: number;
  merkleRoot: string;
  signature: string;
  publicKeyId: string;
  witnessStatus: 'VERIFIED' | 'PENDING' | 'REJECTED' | 'TAMPERED';
  createdAt: string;
  witnessReceipts: {
    witnessName: string;
    timestamp: string;
    signature: string;
  }[];
}

export interface ExportRecord {
  id: string;
  exportId: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole;
  sessionTitle: string;
  institutionId?: string;
  institutionName?: string;
  rowCount: number;
  canaryCount: number;
  canaries: {
    apaarId: string;
    name: string;
    dob: string;
    tokenType: string;
  }[];
  contentSignature: string;
  rowOrderFingerprint: string;
  timestamp: string;
}

export interface SecuritySession {
  id: string;
  userId: string;
  userEmail: string;
  role: UserRole;
  ipAddress: string;
  riskScore: number; // 0-100
  status: 'ACTIVE' | 'CHALLENGED' | 'THROTTLED' | 'FROZEN';
  signals: {
    name: string;
    weight: number;
    description: string;
    triggeredAt: string;
  }[];
  requestCount: number;
  exportCount: number;
  lastActive: string;
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  sessionId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  actionTaken: 'WARNING' | 'STEP_UP_MFA' | 'RATE_LIMIT_APPLIED' | 'SESSION_FROZEN';
  actorEmail: string;
}

export interface VerifiableCredential {
  id: string;
  apaarMasked: string; // not included in signed claims!
  program: string;
  academicSession: string;
  enrolmentStatus: 'ENROLLED' | 'PROVISIONAL' | 'GRADUATED';
  aicteApprovedClaim: boolean;
  institutionApprovalRef: string;
  issuedAt: string;
  expiresAt: string;
  issuerId: string;
  issuerName: string;
  publicKeyId: string;
  jwsPayload: string;
  signature: string;
}

export interface ConsentRecord {
  id: string;
  studentId: string;
  studentName: string;
  verifierName: string;
  purpose: string;
  disclosedFields: string[];
  status: 'GRANTED' | 'REVOKED' | 'EXPIRED' | 'DENIED';
  grantedAt: string;
  expiresAt: string;
  revokedAt?: string;
}
