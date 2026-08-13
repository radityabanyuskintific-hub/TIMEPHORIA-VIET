import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { createLipRenderer } from "./lip-renderer";
import type { TryOnPreset } from "./try-on-presets";

type DrawOptions = {
  intensity: number;
  isGloss: boolean;
  preset: TryOnPreset;
  shadeHex: string;
  time: number;
};

const FACE_OVAL = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
const LEFT_EYE = [33, 246, 161, 160, 159, 158, 157, 173, 133];
const RIGHT_EYE = [263, 466, 388, 387, 386, 385, 384, 398, 362];
const LEFT_EYE_LOWER = [33, 130, 25, 110, 24, 23, 22, 26, 112, 243, 133];
const RIGHT_EYE_LOWER = [263, 359, 255, 339, 254, 253, 252, 256, 341, 463, 362];
const OUTER_LIPS = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 0, 39, 40, 185];
const LEFT_BROW = [70, 63, 105, 66, 107];
const RIGHT_BROW = [336, 296, 334, 293, 300];

function point(points: NormalizedLandmark[], index: number, width: number, height: number) {
  return { x: points[index].x * width, y: points[index].y * height };
}

function path(context: CanvasRenderingContext2D, points: NormalizedLandmark[], indices: number[], width: number, height: number) {
  const start = point(points, indices[0], width, height);
  context.moveTo(start.x, start.y);
  for (const index of indices.slice(1)) {
    const next = point(points, index, width, height);
    context.lineTo(next.x, next.y);
  }
}

function eyeShadowPath(context: CanvasRenderingContext2D, points: NormalizedLandmark[], eye: number[], brow: number[], width: number, height: number) {
  path(context, points, eye, width, height);
  for (const index of [...brow].reverse()) {
    const browPoint = point(points, index, width, height);
    const eyeCenterY = eye.reduce((sum, eyeIndex) => sum + points[eyeIndex].y, 0) / eye.length * height;
    context.lineTo(browPoint.x, browPoint.y + (eyeCenterY - browPoint.y) * 0.42);
  }
  context.closePath();
}

function fillSoft(context: CanvasRenderingContext2D, color: string, alpha: number, blur: number, drawPath: () => void) {
  context.save();
  context.filter = `blur(${blur}px)`;
  context.globalAlpha = alpha;
  context.globalCompositeOperation = "multiply";
  context.fillStyle = color;
  context.beginPath();
  drawPath();
  context.fill();
  context.restore();
}

function drawSparkles(context: CanvasRenderingContext2D, points: NormalizedLandmark[], eye: number[], width: number, height: number, time: number, intensity: number) {
  const eyePoints = eye.map((index) => point(points, index, width, height));
  const minX = Math.min(...eyePoints.map((item) => item.x));
  const maxX = Math.max(...eyePoints.map((item) => item.x));
  const minY = Math.min(...eyePoints.map((item) => item.y)) - (maxX - minX) * 0.24;
  const maxY = Math.max(...eyePoints.map((item) => item.y));
  context.save();
  context.globalCompositeOperation = "screen";
  for (let index = 0; index < 14; index += 1) {
    const x = minX + ((index * 37) % 97) / 97 * (maxX - minX);
    const y = minY + ((index * 61) % 89) / 89 * (maxY - minY);
    const pulse = 0.25 + 0.75 * Math.abs(Math.sin(time / 260 + index * 1.73));
    context.globalAlpha = pulse * intensity * 1.8;
    context.fillStyle = index % 3 === 0 ? "#ffe1f0" : "#fff8d5";
    context.beginPath();
    context.arc(x, y, Math.max(0.8, (maxX - minX) * 0.012 * pulse), 0, Math.PI * 2);
    context.fill();
  }
  context.restore();
}

function drawLashes(
  context: CanvasRenderingContext2D,
  points: NormalizedLandmark[],
  eye: number[],
  width: number,
  height: number,
  color: string,
  intensity: number,
) {
  const upperLid = eye.slice(1, -1).map((index) => point(points, index, width, height));
  const eyeWidth = Math.abs(point(points, eye[0], width, height).x - point(points, eye[eye.length - 1], width, height).x);
  context.save();
  context.globalAlpha = Math.min(1, 0.58 + intensity);
  context.strokeStyle = color;
  context.lineCap = "round";
  context.lineWidth = Math.max(1.2, eyeWidth * 0.018);
  upperLid.forEach((lash, index) => {
    const centerBias = 1 - Math.abs(index - (upperLid.length - 1) / 2) / Math.max(1, upperLid.length / 2);
    const length = eyeWidth * (0.055 + centerBias * 0.045) * (0.8 + intensity * 1.4);
    const sideways = (index - (upperLid.length - 1) / 2) * eyeWidth * 0.012;
    context.beginPath();
    context.moveTo(lash.x, lash.y);
    context.quadraticCurveTo(lash.x + sideways * 0.35, lash.y - length * 0.55, lash.x + sideways, lash.y - length);
    context.stroke();
  });
  context.restore();
}

export function createMakeupRenderer() {
  const lipRenderer = createLipRenderer();

  return {
    draw(context: CanvasRenderingContext2D, points: NormalizedLandmark[], width: number, height: number, options: DrawOptions) {
      const alpha = Math.min(0.72, options.intensity * 1.65);
      if (options.preset.region === "lips") {
        lipRenderer.draw(context, points, width, height, {
          intensity: options.intensity,
          isGloss: options.isGloss,
          shadeHex: options.shadeHex,
        });
        return;
      }

      if (options.preset.region === "foundation") {
        const coverage = options.preset.coverage ?? 0.5;
        fillSoft(context, options.shadeHex, alpha * coverage, options.preset.finish === "matte" ? 9 : 12, () => {
          path(context, points, FACE_OVAL, width, height);
          context.closePath();
        });
        context.save();
        context.globalCompositeOperation = "destination-out";
        context.filter = "blur(4px)";
        for (const indices of [LEFT_EYE, RIGHT_EYE, OUTER_LIPS]) {
          context.beginPath();
          path(context, points, indices, width, height);
          context.closePath();
          context.fill();
        }
        context.restore();
      } else if (options.preset.region === "concealer") {
        for (const indices of [LEFT_EYE_LOWER, RIGHT_EYE_LOWER]) {
          const eyePoints = indices.map((index) => point(points, index, width, height));
          const minX = Math.min(...eyePoints.map(({ x }) => x));
          const maxX = Math.max(...eyePoints.map(({ x }) => x));
          const topY = Math.min(...eyePoints.map(({ y }) => y));
          const bottomY = Math.max(...eyePoints.map(({ y }) => y)) + (maxX - minX) * 0.22;
          context.save();
          context.filter = "blur(6px)";
          context.globalAlpha = alpha * (options.preset.coverage ?? 0.58);
          context.globalCompositeOperation = "soft-light";
          context.fillStyle = options.shadeHex;
          context.beginPath();
          context.moveTo(minX, topY);
          context.quadraticCurveTo((minX + maxX) / 2, bottomY, maxX, topY);
          context.quadraticCurveTo((minX + maxX) / 2, topY + (bottomY - topY) * 0.35, minX, topY);
          context.closePath();
          context.fill();
          context.restore();
        }
      } else if (options.preset.region === "blush") {
        for (const cheek of [point(points, 50, width, height), point(points, 280, width, height)]) {
          const radius = Math.abs(points[454].x - points[234].x) * width * 0.13;
          const gradient = context.createRadialGradient(cheek.x, cheek.y, 0, cheek.x, cheek.y, radius);
          gradient.addColorStop(0, options.shadeHex);
          gradient.addColorStop(1, "transparent");
          context.save();
          context.globalAlpha = alpha;
          context.globalCompositeOperation = "multiply";
          context.fillStyle = gradient;
          context.fillRect(cheek.x - radius, cheek.y - radius, radius * 2, radius * 2);
          context.restore();
        }
      } else if (options.preset.region === "contour") {
        context.save();
        context.strokeStyle = options.shadeHex;
        context.globalAlpha = alpha * 0.48;
        context.globalCompositeOperation = "soft-light";
        context.filter = "blur(7px)";
        context.lineCap = "round";
        context.lineWidth = Math.abs(points[454].x - points[234].x) * width * 0.028;
        for (const indices of [
          [234, 123, 50, 205],
          [454, 352, 280, 425],
          [127, 162, 21, 54],
          [356, 389, 251, 284],
          [136, 150, 152, 379, 365],
        ]) {
          context.beginPath();
          path(context, points, indices, width, height);
          context.stroke();
        }
        context.lineWidth *= 0.48;
        for (const indices of [[168, 6, 197, 5], [168, 6, 195, 5]]) {
          context.beginPath();
          path(context, points, indices, width, height);
          context.stroke();
        }
        context.restore();
      } else if (options.preset.region === "brows") {
        context.save();
        context.strokeStyle = options.shadeHex;
        context.globalAlpha = alpha;
        context.globalCompositeOperation = "multiply";
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = Math.max(3, Math.abs(points[33].x - points[133].x) * width * 0.13);
        for (const indices of [LEFT_BROW, RIGHT_BROW]) {
          context.beginPath();
          path(context, points, indices, width, height);
          context.stroke();
        }
        context.restore();
      } else if (options.preset.region === "eyeliner") {
        context.save();
        context.strokeStyle = options.shadeHex;
        context.globalAlpha = Math.min(1, alpha * 1.4);
        context.lineCap = "round";
        context.lineJoin = "round";
        context.lineWidth = Math.max(2, width * 0.0032);
        for (const indices of [LEFT_EYE, RIGHT_EYE]) {
          context.beginPath();
          path(context, points, indices, width, height);
          context.stroke();
        }
        context.restore();
      } else if (options.preset.region === "eyelashes") {
        drawLashes(context, points, LEFT_EYE, width, height, options.shadeHex, options.intensity);
        drawLashes(context, points, RIGHT_EYE, width, height, options.shadeHex, options.intensity);
      } else if (options.preset.region === "eyeshadow") {
        fillSoft(context, options.shadeHex, alpha, 5, () => {
          eyeShadowPath(context, points, LEFT_EYE, LEFT_BROW, width, height);
          eyeShadowPath(context, points, RIGHT_EYE, RIGHT_BROW, width, height);
        });
        if (options.preset.shimmer) {
          drawSparkles(context, points, LEFT_EYE, width, height, options.time, options.intensity);
          drawSparkles(context, points, RIGHT_EYE, width, height, options.time, options.intensity);
        }
      }
    },
  };
}

export type MakeupRenderer = ReturnType<typeof createMakeupRenderer>;
