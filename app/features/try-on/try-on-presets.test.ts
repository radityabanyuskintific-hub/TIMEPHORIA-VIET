import assert from "node:assert/strict";
import test from "node:test";
import { tryOnPresets } from "./try-on-presets.ts";

test("provides try-on presets for lip, face, and eye products", () => {
  assert.equal(tryOnPresets["STELLAR DUST LIP STAIN"].region, "lips");
  assert.equal(tryOnPresets["LUMINA MATTE CUSHION"].region, "foundation");
  assert.equal(tryOnPresets["DUNE EYELINER"].region, "eyeliner");
  assert.ok(tryOnPresets["PANDORA CHEEK LIQUID BLUSH"].shades.length >= 7);
});

test("marks Illumina as a multi-shade shimmer eyeshadow", () => {
  const illumina = tryOnPresets["ILLUMINA EYESHADOW STICK"];
  assert.equal(illumina.region, "eyeshadow");
  assert.equal(illumina.shimmer, true);
  assert.deepEqual(
    illumina.shades.map((shade) => shade.name),
    ["Champagne", "Rose chrome", "Copper", "Galaxy", "Moonlit"],
  );
});
