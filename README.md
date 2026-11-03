# csv-normalizer

Normalizes CSV exports into batched records. Part of the dependency-defense demo fleet.

```bash
npm ci
npm test
npm run build
```

## Tests

`npm test` runs `test/*.test.js`: `test/normalize.test.js` plus `test/preservation.test.js`, which pin
the whole batched output of `normalize` and the exact results of `parseCsv`, `normalizeKeys` and
`coerceNumbers` for legitimate CSV. They must stay green across a lodash upgrade, so a remediation PR
can use them as proof it changed no behaviour.

There is no characterization suite here, because no vulnerable behaviour is observable through this
package's API (see below).

`npm run test:security` runs `test/security/**/*.test.js` and is deliberately **not** part of
`npm test`. It asserts that untrusted CSV header names cannot reach `Object.prototype`.

All 4 security tests are **green today**. The advisory against the pinned lodash version is real, but
this package only uses `camelCase`, `chunk` and `mapValues`. `camelCase('__proto__')` is `'proto'`, so
a hostile header cannot name the prototype, and `mapValues` keeps an own `__proto__` key as data
without walking into the prototype. These tests exist to document the invariant and catch a regression
if the pipeline starts using a deep-write lodash function such as `set` or `merge`.

What these tests do **not** cover: the planted unused dependencies (`moment`, `uuid`), the bundled
`dist/index.js`, `csv-parse` options other than the ones `parseCsv` sets, malformed or adversarially
large CSV, dynamic imports, and any network or filesystem path.
