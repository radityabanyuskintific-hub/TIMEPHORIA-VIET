import type { TryOnPreset } from "./try-on-presets";
import { BANUBA_VERSIONED_BASE_PATH } from "./banuba-config";

const SDK_ROOT = BANUBA_VERSIONED_BASE_PATH;
const configuredToken = process.env.NEXT_PUBLIC_BANUBA_CLIENT_TOKEN?.trim() ?? "";

export const isBanubaConfigured =
  configuredToken.length > 40 && !/PUT YOUR|placeholder/i.test(configuredToken);

function rgb(hex: string, alpha: number) {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16) / 255;
  const green = Number.parseInt(value.slice(2, 4), 16) / 255;
  const blue = Number.parseInt(value.slice(4, 6), 16) / 255;
  return `${red.toFixed(3)} ${green.toFixed(3)} ${blue.toFixed(3)} ${alpha.toFixed(3)}`;
}

export async function createBanubaSession(
  container: HTMLElement,
  facingMode: "environment" | "user",
) {
  if (!isBanubaConfigured) throw new Error("Banuba token is not configured");

  const Banuba = await import("@banuba/webar");
  const player = await Banuba.Player.create({
    clientToken: configuredToken,
    devicePixelRatio: Math.min(window.devicePixelRatio, 2),
    locateFile: `${SDK_ROOT}/`,
    logger: { error: console.error, warn: console.warn },
  });
  const modules = ["face_tracker", "eyes", "lips", "skin"].map(
    (name) => new Banuba.Module(`${SDK_ROOT}/modules/${name}.zip`),
  );
  await player.addModule(...modules);
  const effect = new Banuba.Effect(`${SDK_ROOT}/effects/Makeup.zip`);
  await player.applyEffect(effect);
  let webcam = new Banuba.Webcam({ facingMode, width: { ideal: 1280 } });
  player.use(webcam);
  player.play();
  Banuba.Dom.render(player, container);

  async function applyPreset(preset: TryOnPreset, shadeHex: string, intensity: number) {
    const alpha = Math.min(1, Math.max(0, intensity * 2.4));
    const color = rgb(shadeHex, alpha);
    const reset = [
      'Lips.color("0 0 0 0")',
      'Makeup.eyeshadow("0 0 0 0")',
      'Makeup.eyeliner("0 0 0 0")',
      'Makeup.blushes("0 0 0 0")',
      'Makeup.contour("0 0 0 0")',
      'Makeup.highlighter("0 0 0 0")',
      'Brows.color("0 0 0 0")',
      'Skin.color("0 0 0 0")',
      "Skin.softening(0)",
    ];
    const commands: Record<TryOnPreset["region"], string[]> = {
      lips: [`Lips.color("${color}")`],
      eyeshadow: [`Makeup.eyeshadow("${color}")`],
      eyeliner: [`Makeup.eyeliner("${color}")`],
      brows: [`Brows.color("${color}")`],
      blush: [`Makeup.blushes("${color}")`],
      contour: [`Makeup.contour("${color}")`],
      concealer: [`Skin.color("${rgb(shadeHex, alpha * 0.35)}")`, `Skin.softening(${(alpha * 0.35).toFixed(2)})`],
      foundation: [`Skin.color("${rgb(shadeHex, alpha * 0.42)}")`, `Skin.softening(${(alpha * 0.25).toFixed(2)})`],
      "soft-focus": [`Skin.softening(${(alpha * 0.8).toFixed(2)})`],
    };
    if (preset.shimmer) {
      commands.eyeshadow.push(`Makeup.highlighter("${rgb("#fff2d5", alpha * 0.28)}")`);
    }
    await effect.evalJs([...reset, ...commands[preset.region]].join(";"));
  }

  return {
    applyPreset,
    async capture() {
      return new Banuba.ImageCapture(player).takePhoto({ quality: 0.94, type: "image/jpeg" });
    },
    async destroy() {
      webcam.stop();
      Banuba.Dom.unmount(container);
      await player.destroy();
    },
    async switchCamera(nextFacingMode: "environment" | "user") {
      webcam.stop();
      webcam = new Banuba.Webcam({ facingMode: nextFacingMode, width: { ideal: 1280 } });
      player.use(webcam);
      player.play();
    },
  };
}

export type BanubaSession = Awaited<ReturnType<typeof createBanubaSession>>;
