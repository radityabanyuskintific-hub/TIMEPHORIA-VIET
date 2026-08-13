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

      if (options.preset.region === "foundation" || options.preset.region === "soft-focus") {
        fillSoft(context, options.preset.region === "soft-focus" ? "#f7e9e3" : options.shadeHex, options.preset.region === "soft-focus" ? alpha * 0.25 : alpha * 0.5, 12, () => {
          path(context, points, FACE_OVAL, width, height);
          context.closePath();
        });
      } else if (options.preset.region === "concealer") {
        for (const [a, b] of [[33, 133], [263, 362]]) {
          const left = point(points, a, width, height);
          const right = point(points, b, width, height);
          context.save();
          context.filter = "blur(8px)";
          context.globalAlpha = alpha * 0.55;
          context.fillStyle = options.shadeHex;
          context.beginPath();
          context.ellipse((left.x + right.x) / 2, (left.y + right.y) / 2 + Math.abs(right.x - left.x) * 0.2, Math.abs(right.x - left.x) * 0.55, Math.abs(right.x - left.x) * 0.2, 0, 0, Math.PI * 2);
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
        context.globalAlpha = alpha * 0.62;
        context.globalCompositeOperation = "multiply";
        context.filter = "blur(9px)";
        context.lineCap = "round";
        context.lineWidth = Math.abs(points[454].x - points[234].x) * width * 0.035;
        for (const indices of [[234, 138, 172], [454, 367, 397], [136, 150, 152, 379, 365]]) {
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
