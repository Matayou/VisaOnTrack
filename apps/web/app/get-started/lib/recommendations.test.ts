import test from 'node:test';
import assert from 'node:assert/strict';

import { generateRecommendations } from './recommendations';
import type { EligibilityState } from './recommendations';

const baseState: EligibilityState = {
  age: 'Under 50',
  purpose: 'longstay',
  nationality: 'United States',
  incomeType: 'Remote/freelance',
  savings: '500k_800k',
  location: 'Outside Thailand',
  duration: '365',
  fields: [],
};

test('filters out retirement visas for underage users', () => {
  const recs = generateRecommendations({ ...baseState, age: 'Under 50', purpose: 'retirement' });
  const hasRetirement = recs.some((rec) => rec.code === 'RET_OA' || rec.code === 'RET_OX');
  assert.equal(hasRetirement, false, 'Retirement visas should not appear for users under 50');
});

test('education visa surfaces for budget long-stay profiles', () => {
  const recs = generateRecommendations({ ...baseState, savings: '0_500k', purpose: 'longstay' });
  const top = recs[0];
  assert.ok(top, 'Should return at least one recommendation');
  assert.equal(top.code === 'ED_LANG', true, 'Education visa should be the top suggestion for budget long stays');
});

test('retirement purpose prioritizes retirement visa when age and savings match', () => {
  const recs = generateRecommendations({
    ...baseState,
    age: '50+',
    purpose: 'retirement',
    savings: '800k_3M',
    incomeType: 'Pension',
  });
  assert.equal(recs[0]?.code, 'RET_OA');
});

test('family purpose highlights marriage visa when spouse flag is set', () => {
  const recs = generateRecommendations({
    ...baseState,
    purpose: 'family',
    fields: ['Spouse/family in Thailand'],
    location: 'Inside Thailand',
  });
  const familyVisa = recs.find((rec) => rec.code === 'O_MARRIAGE');
  assert.ok(familyVisa, 'Marriage visa should appear when user indicates Thai spouse');
  assert.equal(familyVisa.confidence === 'High' || familyVisa.confidence === 'Medium', true);
});

