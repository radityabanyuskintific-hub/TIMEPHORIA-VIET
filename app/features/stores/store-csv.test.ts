import assert from "node:assert/strict";
import test from "node:test";
import { parseStoreCsv } from "./store-csv.ts";

test("parses quoted store names and Windows line endings", () => {
  const csv =
    'name,region\r\n"Timephoria, Central",Jakarta\r\nBandung Store,Bandung\r\n';

  assert.deepEqual(parseStoreCsv(csv), [
    { name: "Timephoria, Central", region: "Jakarta" },
    { name: "Bandung Store", region: "Bandung" },
  ]);
});

test("skips incomplete rows", () => {
  const csv = "name,region\nComplete Store,Bali\nMissing Region,\n,Surabaya\n";

  assert.deepEqual(parseStoreCsv(csv), [
    { name: "Complete Store", region: "Bali" },
  ]);
});
