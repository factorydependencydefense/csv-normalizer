import assert from 'node:assert/strict';
import test from 'node:test';
import { coerceNumbers, normalize, normalizeKeys, parseCsv } from '../src/index.js';

const csv = 'Account Id,usage_amount\nacct_1,10\nacct_2,20\nacct_3,30\n';

test('parseCsv reads headers as keys', () => {
  assert.deepEqual(parseCsv(csv)[0], { 'Account Id': 'acct_1', usage_amount: '10' });
});

test('normalizeKeys camel cases headers', () => {
  assert.deepEqual(normalizeKeys({ 'Account Id': 'x', usage_amount: '1' }), {
    accountId: 'x',
    usageAmount: '1',
  });
});

test('coerceNumbers converts numeric strings only', () => {
  assert.deepEqual(coerceNumbers({ a: '10', b: 'acct_1', c: '' }), { a: 10, b: 'acct_1', c: '' });
});

test('normalize batches normalized records', () => {
  const batches = normalize(csv, 2);
  assert.equal(batches.length, 2);
  assert.deepEqual(batches[0][0], { accountId: 'acct_1', usageAmount: 10 });
  assert.equal(batches[1].length, 1);
});
