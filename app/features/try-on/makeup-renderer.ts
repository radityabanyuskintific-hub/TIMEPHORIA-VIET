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

function fillSoft(
  context: CanvasRenderingContext2D,
  color: string,
  alpha: number,
  blur: number,
  drawPath: () => void,
  composite: GlobalCompositeOperation = "multiply",
) {
  context.save();
  context.filter = `blur(${blur}px)`;
  context.globalAlpha = alpha;
  context.globalCompositeOperation = composite;
  context.fillStyle = color;
  context.beginPath();
  drawPath();
  context.fill();
  context.restore();
}

function featheredOval(
  context: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  radiusX: number,
  radiusY: number,
  angle: number,
  opacity: number,
) {
  const red = Number.parseInt(color.slice(1, 3), 16);
  const green = Number.parseInt(color.slice(3, 5), 16);
  const blue = Number.parseInt(color.slice(5, 7), 16);
  const tint = (alpha: number) => `rgba(${red}, ${green}, ${blue}, ${alpha})`;

  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.scale(radiusX, radiusY);
  const gradient = context.createRadialGradient(0, 0, 0, 0, 0, 1);
  gradient.addColorStop(0, tint(opacity));
  gradient.addColorStop(0.35, tint(opacity * 0.68));
  gradient.addColorStop(0.72, tint(opacity * 0.18));
  gradient.addColorStop(1, tint(0));
  context.fillStyle = gradient;
  context.beginPath();
  context.arc(0, 0, 1, 0, Math.PI * 2);
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
        fillSoft(context, options.shadeHex, alpha * coverage * 0.72, options.preset.finish === "matte" ? 7 : 10, () => {
          path(context, points, FACE_OVAL, width, height);
          context.closePath();
        }, "source-over");
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
          context.filter = "blur(5px)";
          context.globalAlpha = alpha * (options.preset.coverage ?? 0.58) * 0.72;
          context.globalCompositeOperation = "source-over";
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
        const faceWidth = Math.hypot(
          (points[454].x - points[234].x) * width,
          (points[454].y - points[234].y) * height,
        );
        for (const [appleIndex, outerIndex] of [[50, 123], [280, 352]]) {
          const apple = point(points, appleIndex, width, height);
          const outer = point(points, outerIndex, width, height);
          const angle = Math.atan2(apple.y - outer.y, apple.x - outer.x);
          featheredOval(
            context,
            options.shadeHex,
            apple.x * 0.76 + outer.x * 0.24,
            apple.y * 0.76 + outer.y * 0.24 - faceWidth * 0.025,
            faceWidth * 0.21,
            faceWidth * 0.11,
            angle,
            0.075 + options.intensity * 0.23,
          );
        }
      } else if (options.preset.region === "contour") {
        const faceWidth = Math.hypot(
          (points[454].x - points[234].x) * width,
          (points[454].y - points[234].y) * height,
        );
        for (const [outerIndex, innerIndex] of [[123, 205], [352, 425]]) {
          const outer = point(points, outerIndex, width, height);
          const inner = point(points, innerIndex, width, height);
          const span = Math.hypot(inner.x - outer.x, inner.y - outer.y);
          featheredOval(
            context,
            options.shadeHex,
            (outer.x + inner.x) / 2,
            (outer.y + inner.y) / 2 + faceWidth * 0.025,
            span * 0.73,
            faceWidth * 0.075,
            Math.atan2(inner.y - outer.y, inner.x - outer.x),
            0.075 + options.intensity * 0.18,
          );
        }
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
