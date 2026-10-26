/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  USER_NATAL_PROFILE,
  EPHEMERIS_DATA,
  calculateTransitStatus,
  getDefaultAuditTasks,
} from './saturnEngine';

test('Natal profile matches user birth specification (11/01/1998, Saturn in Aries)', () => {
  assert.equal(USER_NATAL_PROFILE.birthDate, '1998-01-11');
  assert.equal(USER_NATAL_PROFILE.natalSaturnSign, 'Áries');
  assert.equal(USER_NATAL_PROFILE.firstReturnStartYear, 2026);
  assert.equal(USER_NATAL_PROFILE.firstReturnEndYear, 2028);
  assert.equal(USER_NATAL_PROFILE.annualActivationDate, '11 de Janeiro');
});

test('Ephemeris covers 2026 to 2045 with complete data rows', () => {
  assert.equal(EPHEMERIS_DATA.length >= 20, true);
  assert.equal(EPHEMERIS_DATA[0].year, 2026);
  assert.equal(EPHEMERIS_DATA[EPHEMERIS_DATA.length - 1].year, 2045);

  const row2026 = EPHEMERIS_DATA.find((e) => e.year === 2026);
  assert.ok(row2026);
  assert.equal(row2026.retroStart, '2026-07-26');
  assert.equal(row2026.retroEnd, '2026-12-10');
  assert.equal(row2026.inReturnWindow, true);
});

test('October 26, 2026 is recognized as active RETROGRADE phase', () => {
  const dateOct26 = new Date('2026-10-26T12:00:00Z');
  const status = calculateTransitStatus(dateOct26);

  assert.equal(status.phase, 'RETRÓGRADO');
  assert.equal(status.nextStationType, 'DIRETO');
  assert.equal(status.nextStationDate, '2026-12-10');
  assert.equal(status.isFirstReturnActive, true);
  assert.equal(status.rules.canDeployNewFeatures, false);
  assert.equal(status.daysUntilNextStation > 0, true);
  assert.equal(status.daysUntilNextStation <= 46, true);
  assert.equal(status.retroProgressPct > 50, true);
});

test('January 15, 2027 is recognized as DIRECT phase', () => {
  const dateJan15 = new Date('2027-01-15T12:00:00Z');
  const status = calculateTransitStatus(dateJan15);

  assert.equal(status.phase, 'DIRETO');
  assert.equal(status.nextStationType, 'RETRÓGRADO');
  assert.equal(status.nextStationDate, '2027-08-08');
  assert.equal(status.rules.canDeployNewFeatures, true);
});

test('Birthday / Annual Solar-Saturn Revolution calculation', () => {
  const dateOct26 = new Date('2026-10-26T12:00:00Z');
  const status = calculateTransitStatus(dateOct26);

  assert.equal(status.nextBirthdayDate, '2027-01-11');
  assert.equal(status.daysUntilNextBirthday > 70 && status.daysUntilNextBirthday < 85, true);
});

test('Orbital cycle progress reflects user age during First Saturn Return', () => {
  const dateOct26 = new Date('2026-10-26T12:00:00Z');
  const status = calculateTransitStatus(dateOct26);

  // User born Jan 1998 is ~28.8 years old in Oct 2026 (out of 29.45 years cycle: >95%)
  assert.equal(status.currentAgeYears > 28 && status.currentAgeYears < 29, true);
  assert.equal(status.orbitalCycleProgressPct > 90, true);
});

test('Default audit tasks are prioritized for debugging & technical debt', () => {
  const tasks = getDefaultAuditTasks();
  assert.equal(tasks.length >= 6, true);
  const codeTasks = tasks.filter((t) => t.category === 'codigo');
  assert.equal(codeTasks.length >= 2, true);
});
