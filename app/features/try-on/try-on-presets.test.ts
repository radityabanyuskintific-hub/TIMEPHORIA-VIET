import assert from "node:assert/strict";
import test from "node:test";
import { skuMaster } from "../../sku-master.ts";
import { tryOnPresets } from "./try-on-presets.ts";

test("keeps the active Watsons and Guardian SKU sets distinct", () => {
  const variants = Object.values(skuMaster).flat();
  assert.equal(variants.length, 71);
  assert.equal(variants.filter((variant) => variant.retailers.includes("guardian")).length, 57);
  assert.equal(new Set(variants.map((variant) => variant.sku)).size, variants.length);
  assert.equal(skuMaster["SUPERNOVA SETTING SPRAY"][0].sku, "TDW106000");
  assert.deepEqual(
    skuMaster["STELLAR DUST LIP STAIN"].filter((variant) => !variant.retailers.includes("guardian")).map((variant) => variant.sku),
    ["TCC102404", "TCC102402", "TCC102401", "TCC102009"],
  );
});

test("offers only listed SKU shades in try-on", () => {
  assert.equal(tryOnPresets["STELLAR DUST LIP STAIN"].region, "lips");
  assert.equal(tryOnPresets["LUMINA MATTE CUSHION"].region, "foundation");
  assert.equal(tryOnPresets["DUNE EYELINER"], undefined);
  assert.equal(tryOnPresets["SUPERNOVA SETTING SPRAY"], undefined);
  assert.equal(tryOnPresets["PANDORA CHEEK LIQUID BLUSH"].shades.length, 4);

  for (const [productName, preset] of Object.entries(tryOnPresets)) {
    const listed = skuMaster[productName].filter((variant) => variant.shadeName);
    assert.deepEqual(
      preset.shades.map((shade) => [shade.sku, shade.code, shade.name]),
      listed.map((variant) => [variant.sku, variant.shadeCode, variant.shadeName]),
      productName,
    );
    assert.ok(preset.shades.every((shade) => /^#[0-9A-F]{6}$/i.test(shade.hex)), productName);
  }
});
