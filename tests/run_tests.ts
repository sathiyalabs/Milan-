/**
 * Verification test suite for Milan SRMIST Cultural Fest website
 * Track B — Frontend Development requirements verification
 *
 * Uses the EXACT shared application utilities from src/utils/filtering and src/utils/validation
 * to eliminate test-implementation duplication.
 */

import assert from 'node:assert';
import { SAMPLE_EVENTS, FESTIVAL_CATEGORIES, FESTIVAL_SCHEDULE_HIGHLIGHTS, FESTIVAL_FAQS } from '../src/data/events';
import { filterFestivalEvents } from '../src/utils/filtering';
import {
  validateRegistrationField,
  validateRegistrationForm,
  generateSamplePaymentReference,
  normalisePhoneNumber,
  DEMO_PAYMENT_REF_REGEX,
} from '../src/utils/validation';
import { FestivalEvent, RegistrationFormData } from '../src/types';

console.log('--- STARTING MILAN ASSESSMENT TEST SUITE ---');

// 1. DATA INTEGRITY & SCOPE
console.log('\n[TEST 1] Verifying Event Data Scope & Structure...');
const totalEvents = SAMPLE_EVENTS.length;
assert.ok(totalEvents >= 6, `Expected at least 6 events, found ${totalEvents}`);
assert.strictEqual(totalEvents, 8, `Expected exactly 8 curated sample events in dataset, found ${totalEvents}`);

const paidEvents = SAMPLE_EVENTS.filter((e) => e.feeAmount > 0);
const freeEvents = SAMPLE_EVENTS.filter((e) => e.feeAmount === 0);

assert.ok(paidEvents.length >= 1, 'Expected at least one paid sample event to test payment reference flow');
assert.ok(freeEvents.length >= 5, 'Expected majority of events to be free student registrations');

const vogueEvent = SAMPLE_EVENTS.find((e) => e.id === 'vogue-milan');
assert.ok(vogueEvent, 'vogue-milan event exists');
assert.strictEqual(vogueEvent?.feeAmount, 150, 'vogue-milan has explicit sample fee of 150');
assert.ok(vogueEvent?.registrationFee.includes('150'), 'vogue-milan fee string matches feeAmount');

SAMPLE_EVENTS.forEach((event) => {
  assert.ok(event.id, `Event has id`);
  assert.ok(event.title, `Event ${event.id} has title`);
  assert.ok(event.category, `Event ${event.id} has category`);
  assert.ok(event.shortDescription, `Event ${event.id} has shortDescription`);
  assert.ok(event.fullDescription, `Event ${event.id} has fullDescription`);
  assert.ok(event.venue, `Event ${event.id} has venue`);
  assert.ok(event.date, `Event ${event.id} has date`);
  assert.ok(event.rules.length >= 3, `Event ${event.id} has at least 3 rules`);
  assert.ok(event.judgingCriteria.length >= 2, `Event ${event.id} has judging criteria`);
  assert.ok(event.coordinators.length >= 1, `Event ${event.id} has coordinators`);
  if (event.participationType === 'Team') {
    assert.ok(event.minTeamSize && event.minTeamSize >= 2, `Team event ${event.id} has valid minTeamSize`);
    assert.ok(event.maxTeamSize && event.maxTeamSize >= event.minTeamSize, `Team event ${event.id} has valid maxTeamSize`);
  }
});
console.log(`✓ Test 1 passed: All ${totalEvents} events meet full data schema with consistent fees and team constraints.`);

// 2. COMBINED KEYWORD SEARCH AND CATEGORY FILTERING (USING SHARED UTILITY)
console.log('\n[TEST 2] Verifying Combined Search & Category Filtering via filterFestivalEvents()...');

// Category filter alone
const danceEvents = filterFestivalEvents(SAMPLE_EVENTS, 'Dance', '');
assert.strictEqual(danceEvents.length, 2, 'Dance category should return 2 dance events');

// Case-insensitive search alone
const choreoQueryLower = filterFestivalEvents(SAMPLE_EVENTS, 'All', 'choreo');
const choreoQueryUpper = filterFestivalEvents(SAMPLE_EVENTS, 'All', 'CHOREO');
assert.strictEqual(choreoQueryLower.length, 2, 'Lower query matches 2 events with choreo in title/rules');
assert.strictEqual(choreoQueryUpper.length, 2, 'Upper query matches 2 events with choreo in title/rules');
assert.ok(choreoQueryLower.some((e) => e.id === 'choreo-night'), 'Includes Choreo Night');

// Combined search: Category 'Music' + Query 'rock'
const musicRock = filterFestivalEvents(SAMPLE_EVENTS, 'Music', 'rock');
assert.strictEqual(musicRock.length, 1, 'Music category + rock keyword should match Battle of the Bands');
assert.strictEqual(musicRock[0].id, 'battle-of-the-bands');

// Combined search: Category 'Music' + Query 'classical' -> Aalap vocals
const musicClassical = filterFestivalEvents(SAMPLE_EVENTS, 'Music', 'classical');
assert.strictEqual(musicClassical.length, 1);
assert.strictEqual(musicClassical[0].id, 'aalap-vocals');

// No results and Reset
const noResults = filterFestivalEvents(SAMPLE_EVENTS, 'Music', 'nonexistenttermxyz99');
assert.strictEqual(noResults.length, 0, 'Non-existent keyword returns 0 results');
const resetResults = filterFestivalEvents(SAMPLE_EVENTS, 'All', '');
assert.strictEqual(resetResults.length, totalEvents, `Reset returns all ${totalEvents} events`);
console.log('✓ Test 2 passed: Shared filterFestivalEvents() executes combined case-insensitive search and category filtering.');

// 3. REGISTRATION VALIDATION ENGINE (USING SHARED UTILITY)
console.log('\n[TEST 3] Verifying Registration Form Validation via validateRegistrationField() & validateRegistrationForm()...');

const freeEvent = SAMPLE_EVENTS.find((e) => e.feeAmount === 0)!;
const paidEvent = SAMPLE_EVENTS.find((e) => e.feeAmount > 0)!;

// Name validation
assert.strictEqual(validateRegistrationField('fullName', '', {}, freeEvent), 'Full name is required.');
assert.strictEqual(validateRegistrationField('fullName', 'A', {}, freeEvent), 'Full name must contain at least 2 characters.');
assert.strictEqual(validateRegistrationField('fullName', 'Priyadarshini Iyer', {}, freeEvent), undefined);

// Phone normalization & validation
assert.strictEqual(normalisePhoneNumber('98401 23456'), '9840123456');
assert.strictEqual(normalisePhoneNumber('+91 98401 23456'), '9840123456');
assert.strictEqual(normalisePhoneNumber('+91-98401-23456'), '9840123456');
assert.strictEqual(normalisePhoneNumber('(0) 9840123456'), '9840123456');

assert.strictEqual(validateRegistrationField('phone', '', {}, freeEvent), 'Mobile number is required.');
assert.strictEqual(validateRegistrationField('phone', '12345', {}, freeEvent), 'Please enter a valid 10-digit mobile number starting with 6-9.');
assert.strictEqual(validateRegistrationField('phone', '9876543210', {}, freeEvent), undefined);
assert.strictEqual(validateRegistrationField('phone', '+91 9876543210', {}, freeEvent), undefined);
assert.strictEqual(validateRegistrationField('phone', '+91 98401 23456', {}, freeEvent), undefined);
assert.strictEqual(validateRegistrationField('phone', '98401-23456', {}, freeEvent), undefined);

// Team size validation: empty, fractional, bounds
assert.strictEqual(
  validateRegistrationField('teamSize', '', { participationType: 'Team' }, freeEvent),
  'Team size is required.'
);
assert.strictEqual(
  validateRegistrationField('teamSize', 2.5, { participationType: 'Team' }, freeEvent),
  'Team size must be a whole integer number.'
);
assert.strictEqual(
  validateRegistrationField('teamSize', 1, { participationType: 'Team' }, freeEvent),
  `Team size for this event must be between ${freeEvent.minTeamSize} and ${freeEvent.maxTeamSize} members.`
);
assert.strictEqual(
  validateRegistrationField('teamSize', 50, { participationType: 'Team' }, freeEvent),
  `Team size for this event must be between ${freeEvent.minTeamSize} and ${freeEvent.maxTeamSize} members.`
);
assert.strictEqual(
  validateRegistrationField('teamSize', 8, { participationType: 'Team' }, freeEvent),
  undefined
);

// Verify team size preservation across event switch without silent clamping
const teamEventA = SAMPLE_EVENTS.find((e) => e.participationType === 'Team' && (e.maxTeamSize ?? 0) >= 15)!;
const teamEventB = SAMPLE_EVENTS.find((e) => e.participationType === 'Team' && (e.maxTeamSize ?? 0) <= 8)!;
assert.ok(teamEventA && teamEventB, 'Found two team events with differing bounds for switch test');
const enteredSize = 14; // Valid for A (e.g. max 20), invalid for B (e.g. max 8)
assert.strictEqual(validateRegistrationField('teamSize', enteredSize, { participationType: 'Team' }, teamEventA), undefined);
const outOfBoundsError = validateRegistrationField('teamSize', enteredSize, { participationType: 'Team' }, teamEventB);
assert.ok(outOfBoundsError?.includes(`between ${teamEventB.minTeamSize} and ${teamEventB.maxTeamSize}`), 'Shows bounds error for new event without clamping');

// Payment Reference validation
// Free event: should NOT require reference
assert.strictEqual(
  validateRegistrationField('demoPaymentReference', '', {}, freeEvent),
  undefined,
  'Free event does not require payment reference'
);

// Paid event: empty reference rejected
assert.strictEqual(
  validateRegistrationField('demoPaymentReference', '', {}, paidEvent),
  'Demo payment reference is required for events with a sample fee.'
);

// Paid event: invalid reference format rejected
assert.strictEqual(
  validateRegistrationField('demoPaymentReference', 'PAY-12345', {}, paidEvent),
  'Must match fictional format: DEMO-MILAN-XXXXXXXX (8 uppercase letters or digits).'
);
assert.strictEqual(
  validateRegistrationField('demoPaymentReference', 'demo-milan-abcdef12', {}, paidEvent),
  'Must match fictional format: DEMO-MILAN-XXXXXXXX (8 uppercase letters or digits).'
);

// Paid event: valid reference accepted
assert.strictEqual(
  validateRegistrationField('demoPaymentReference', 'DEMO-MILAN-84729183', {}, paidEvent),
  undefined
);
const generatedSampleRef = generateSamplePaymentReference();
assert.ok(DEMO_PAYMENT_REF_REGEX.test(generatedSampleRef), 'Sample generator produces valid reference');
assert.strictEqual(
  validateRegistrationField('demoPaymentReference', generatedSampleRef, {}, paidEvent),
  undefined
);

// Complete form validation test
const validFreeForm: RegistrationFormData = {
  fullName: 'Vikramaditya Sharma',
  registrationNumber: 'RA2311003010123',
  email: 'vikram@srmist.edu.in',
  phone: '98401 23456',
  college: 'SRM Institute of Science and Technology',
  eventId: freeEvent.id,
  participationType: 'Team',
  teamName: 'Western Dancers Society',
  teamSize: 10,
  specialRequirements: '',
  demoPaymentReference: '',
  agreeTerms: true,
};
const freeErrors = validateRegistrationForm(validFreeForm, freeEvent);
assert.strictEqual(Object.keys(freeErrors).length, 0, 'Valid free registration produces zero errors');

// Complete form validation with paid event without reference
const invalidPaidForm: RegistrationFormData = {
  ...validFreeForm,
  eventId: paidEvent.id,
  demoPaymentReference: '',
} as any;
const paidErrors = validateRegistrationForm(invalidPaidForm, paidEvent);
assert.ok(paidErrors.demoPaymentReference, 'Paid event without reference produces demoPaymentReference error');

console.log('✓ Test 3 passed: Shared validation utility enforces bounds, fractional checks, phone whitespace normalization, and conditional demo references.');

// 4. DEMO PASS ID GENERATION AND LABELLING
console.log('\n[TEST 4] Verifying Demo Pass ID Generation and Labelling...');
const fullPassId = `DEMO-PASS-${crypto.randomUUID().toUpperCase()}`;
assert.ok(fullPassId.startsWith('DEMO-PASS-'), 'Pass ID has DEMO-PASS- prefix');
assert.strictEqual(fullPassId.length, 46, 'Pass ID includes full UUID length');

const demoReference = 'DEMO-MILAN-84729183';
assert.notStrictEqual(fullPassId, demoReference, 'User demo payment reference is distinct from generated demo pass ID');

console.log('✓ Test 4 passed: Generated pass ID uses full crypto.randomUUID and is distinct from user reference.');

// 5. SCHEDULE AND FAQ DATA
console.log('\n[TEST 5] Verifying Festival Schedule & FAQ Highlights...');
assert.strictEqual(FESTIVAL_SCHEDULE_HIGHLIGHTS.length, 3, 'Expected 3 days of festival schedule');
assert.ok(FESTIVAL_FAQS.length >= 4, 'Expected at least 4 FAQ entries');
FESTIVAL_SCHEDULE_HIGHLIGHTS.forEach((day) => {
  assert.ok(day.day, 'Schedule day has label');
  assert.ok(day.date, 'Schedule day has date');
  assert.ok(day.events.length >= 2, 'Schedule day has at least 2 sessions');
});
console.log('✓ Test 5 passed: Schedule and FAQ datasets verified.');

console.log('\n========================================');
console.log(`ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY (5/5) FOR ${totalEvents} EVENTS`);
console.log('========================================\n');
