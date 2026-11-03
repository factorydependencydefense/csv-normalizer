import assert from 'node:assert/strict';
import test from 'node:test';
import { coerceNumbers, normalize, normalizeKeys, parseCsv } from '../src/index.js';

const csv = 'Account Id,usage_amount\nacct_1,10\nacct_2,20\nacct_3,30\n';

test('parseCsv returns every row keyed by the raw header, values still strings', () => {
  assert.deepEqual(parseCsv(csv), [
    { 'Account Id': 'acct_1', usage_amount: '10' },
    { 'Account Id': 'acct_2', usage_amount: '20' },
    { 'Account Id': 'acct_3', usage_amount: '30' },
  ]);
});

test('normalizeKeys camel cases every header and keeps values as they are', () => {
  assert.deepEqual(normalizeKeys({ 'Account Id': 'x', usage_amount: '1', 'TOTAL-DUE': null }), {
    accountId: 'x',
    usageAmount: '1',
    totalDue: null,
  });
});

test('coerceNumbers converts only non-empty numeric strings', () => {
  assert.deepEqual(coerceNumbers({ a: '10', b: 'acct_1', c: '', d: '2.5', e: '0' }), {
    a: 10,
    b: 'acct_1',
    c: '',
    d: 2.5,
    e: 0,
  });
});

test('normalize produces the whole batched, normalized result', () => {
  assert.deepEqual(normalize(csv, 2), [
    [
      { accountId: 'acct_1', usageAmount: 10 },
      { accountId: 'acct_2', usageAmount: 20 },
    ],
    [{ accountId: 'acct_3', usageAmount: 30 }],
  ]);
});

test('normalize honours the batch size', () => {
  assert.deepEqual(
    normalize(csv, 3).map((batch) => batch.length),
    [3],
  );
  assert.deepEqual(
    normalize(csv, 1).map((batch) => batch.length),
    [1, 1, 1],
  );
});
