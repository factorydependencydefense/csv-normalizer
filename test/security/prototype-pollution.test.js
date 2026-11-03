import assert from 'node:assert/strict';
import test from 'node:test';
import { coerceNumbers, normalize, normalizeKeys } from '../../src/index.js';

test('a __proto__ CSV header must not reach Object.prototype', () => {
  try {
    normalize('__proto__,csvSecHeader\nPWN,PWN\n', 2);
    assert.equal({}.csvSecHeader, undefined);
  } finally {
    delete Object.prototype.csvSecHeader;
  }
});

test('a constructor.prototype CSV header must not reach Object.prototype', () => {
  try {
    normalize('constructor.prototype.csvSecCtor,amount\nPWN,1\n', 2);
    assert.equal({}.csvSecCtor, undefined);
  } finally {
    delete Object.prototype.csvSecCtor;
  }
});

test('normalizeKeys must not let an own __proto__ key reach Object.prototype', () => {
  try {
    normalizeKeys(JSON.parse('{"__proto__":{"csvSecNormalizeKeys":"PWN"},"amount":"1"}'));
    assert.equal({}.csvSecNormalizeKeys, undefined);
  } finally {
    delete Object.prototype.csvSecNormalizeKeys;
  }
});

test('coerceNumbers must not let an own __proto__ key reach Object.prototype', () => {
  try {
    coerceNumbers(JSON.parse('{"__proto__":{"csvSecCoerce":"PWN"},"amount":"1"}'));
    assert.equal({}.csvSecCoerce, undefined);
  } finally {
    delete Object.prototype.csvSecCoerce;
  }
});
