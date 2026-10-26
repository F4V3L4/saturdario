/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SaturnPhase = 'RETRÓGRADO' | 'DIRETO' | 'ESTACIONÁRIO';

export interface NatalProfile {
  birthDate: string; // '1998-01-11'
  natalSaturnSign: string; // 'Áries'
  natalSaturnDegree: number; // ~13.75° (13°45')
  firstReturnStartYear: number; // 2026
  firstReturnEndYear: number; // 2028
  annualActivationDate: string; // '11 de Janeiro'
  focusAreas: string[];
}

export interface EphemerisEntry {
  year: number;
  sign: string;
  degrees: string;
  retroStart: string; // 'YYYY-MM-DD'
  retroEnd: string; // 'YYYY-MM-DD'
  directive: string;
  focus: string;
  inReturnWindow: boolean;
}

export interface TransitStatus {
  currentDate: string; // ISO string
  phase: SaturnPhase;
  phaseLabel: string;
  currentSign: string;
  currentDegree: string;
  eclipticLongitude: number; // 0 - 360
  daysUntilNextStation: number;
  nextStationType: SaturnPhase;
  nextStationDate: string;
  retroProgressPct: number; // 0 - 100
  retroDaysElapsed: number;
  retroTotalDays: number;
  orbitalCycleProgressPct: number; // % of 29.45 years from birth
  currentAgeYears: number;
  isFirstReturnActive: boolean;
  daysUntilNextBirthday: number;
  nextBirthdayDate: string;
  ringTiltDeg: number; // -27 to +27 (near 0 in 2025/2026 ring crossing)
  operationalDirective: string;
  rules: {
    canDeployNewFeatures: boolean;
    recommendedFocus: string;
    warningNote: string;
  };
}

export type AuditCategory = 'codigo' | 'financas' | 'fundacoes' | 'soberania';

export interface AuditTask {
  id: string;
  title: string;
  description: string;
  category: AuditCategory;
  completed: boolean;
  priority: 'alta' | 'media' | 'baixa';
  createdAt: string;
  completedAt?: string;
  phaseRecommendation: 'retrogrado' | 'direto' | 'ambos';
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: 'phase_change' | 'zodiac_ingress' | 'annual_revolution' | 'audit_reminder';
  date: string;
  read: boolean;
  badge?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
