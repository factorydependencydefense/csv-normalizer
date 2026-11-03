import { parse } from 'csv-parse/sync';
import camelCase from 'lodash/camelCase.js';
import chunk from 'lodash/chunk.js';
import mapValues from 'lodash/mapValues.js';

export function parseCsv(text) {
  return parse(text, { columns: true, skip_empty_lines: true, trim: true });
}

export function normalizeKeys(record) {
  const out = {};
  for (const [key, value] of Object.entries(record)) {
    out[camelCase(key)] = value;
  }
  return out;
}

export function coerceNumbers(record) {
  return mapValues(record, (value) =>
    typeof value === 'string' && value !== '' && !Number.isNaN(Number(value)) ? Number(value) : value,
  );
}

export function normalize(text, batchSize = 2) {
  const records = parseCsv(text).map((record) => coerceNumbers(normalizeKeys(record)));
  return chunk(records, batchSize);
}
