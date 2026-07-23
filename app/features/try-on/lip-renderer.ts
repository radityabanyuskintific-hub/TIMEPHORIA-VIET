import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

const OUTER_LIP = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267,
  0, 37, 39, 40, 185,
];

const INNER_LIP = [
  78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312,
  13, 82, 81, 80, 191,
];

type CanvasSlot = {
  current: HTMLCanvasElement | null;
};

export type LipRenderOptions = {
  shadeHex: string;
  intensity: number;
  isGloss: boolean;
};

function tracePath(
  context: CanvasRenderingContext2D,
  points: NormalizedLandmark[],
  indices: number[],
  width: number,
  height: number,
) {
  const firstPoint = points[indices[0]];
  const lastPoint = points[indices[indices.length - 1]];
  context.moveTo(
    ((lastPoint.x + firstPoint.x) / 2) * width,
    ((lastPoint.y + firstPoint.y) / 2) * height,
  );

  indices.forEach((index, pointIndex) => {
    const point = points[index];
    const nextPoint = points[indices[(pointIndex + 1) % indices.length]];
    context.quadraticCurveTo(
      point.x * width,
      point.y * height,
      ((point.x + nextPoint.x) / 2) * width,
      ((point.y + nextPoint.y) / 2) * height,
    );
  });
  context.closePath();
}

function prepareWorkingCanvas(
  canvasSlot: CanvasSlot,
  width: number,
  height: number,
) {
  if (!canvasSlot.current) {
    canvasSlot.current = document.createElement("canvas");
  }

  const canvas = canvasSlot.current;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }
  return canvas;
}

function drawGlossHighlight(
  context: CanvasRenderingContext2D,
  points: NormalizedLandmark[],
  width: number,
  height: number,
  featheredMask: HTMLCanvasElement,
  effectCanvas: HTMLCanvasElement,
  edgeBlur: number,
) {
  const lipPoints = OUTER_LIP.map((index) => points[index]);
  const minX = Math.min(...lipPoints.map((point) => point.x * width));
  const maxX = Math.max(...lipPoints.map((point) => point.x * width));
  const minY = Math.min(...lipPoints.map((point) => point.y * height));
  const maxY = Math.max(...lipPoints.map((point) => point.y * height));
  const lipWidth = maxX - minX;
  const lipHeight = maxY - minY;

  const effectContext = effectCanvas.getContext("2d");
  if (!effectContext) return;

  effectContext.clearRect(0, 0, width, height);

  const sheen = effectContext.createLinearGradient(0, minY, 0, maxY);
  sheen.addColorStop(0, "rgba(255,255,255,0)");
  sheen.addColorStop(0.2, "rgba(255,225,233,0.2)");
  sheen.addColorStop(0.4, "rgba(255,246,248,0.03)");
  sheen.addColorStop(0.63, "rgba(255,225,233,0.16)");
  sheen.addColorStop(0.88, "rgba(255,255,255,0)");
  effectContext.fillStyle = sheen;
  effectContext.fillRect(minX, minY, lipWidth, lipHeight);

  const highlight = effectContext.createRadialGradient(
    minX + lipWidth * 0.42,
    minY + lipHeight * 0.32,
    0,
    minX + lipWidth * 0.42,
    minY + lipHeight * 0.32,
    lipWidth * 0.38,
  );
  highlight.addColorStop(0, "rgba(255,225,233,0.22)");
  highlight.addColorStop(0.46, "rgba(255,240,244,0.08)");
  highlight.addColorStop(1, "rgba(255,255,255,0)");
  effectContext.fillStyle = highlight;
  effectContext.fillRect(minX, minY, lipWidth, lipHeight);

  effectContext.globalCompositeOperation = "destination-in";
  effectContext.drawImage(featheredMask, 0, 0);
  effectContext.globalCompositeOperation = "source-over";

  context.save();
  context.globalCompositeOperation = "multiply";
  context.globalAlpha = Math.max(0.2, 0.34 - edgeBlur * 0.02);
  context.drawImage(effectCanvas, 0, 0);
  context.restore();
}

export function createLipRenderer() {
  const maskCanvas: CanvasSlot = { current: null };
  const featheredMaskCanvas: CanvasSlot = { current: null };
  const lipEffectCanvas: CanvasSlot = { current: null };

  function createFeatheredLipMask(
    points: NormalizedLandmark[],
    width: number,
    height: number,
  ) {
    const mask = prepareWorkingCanvas(maskCanvas, width, height);
    const featheredMask = prepareWorkingCanvas(
      featheredMaskCanvas,
      width,
      height,
    );
    const maskContext = mask.getContext("2d");
    const featheredMaskContext = featheredMask.getContext("2d");
    const outerLipPoints = OUTER_LIP.map((index) => points[index]);
    const lipMinX = Math.min(...outerLipPoints.map((point) => point.x * width));
    const lipMaxX = Math.max(...outerLipPoints.map((point) => point.x * width));
    const detectedLipWidth = lipMaxX - lipMinX;
    const edgeBlur = Math.max(4.5, Math.min(10, detectedLipWidth * 0.055));

    if (!maskContext || !featheredMaskContext) {
      return { canvas: mask, edgeBlur };
    }

    maskContext.clearRect(0, 0, width, height);
    maskContext.beginPath();
    tracePath(maskContext, points, OUTER_LIP, width, height);
    tracePath(maskContext, points, INNER_LIP, width, height);
    maskContext.fillStyle = "#ffffff";
    maskContext.fill("evenodd");

    featheredMaskContext.clearRect(0, 0, width, height);
    featheredMaskContext.save();
    featheredMaskContext.globalAlpha = 0.96;
    featheredMaskContext.filter = `blur(${edgeBlur}px)`;
    featheredMaskContext.drawImage(mask, 0, 0);
    featheredMaskContext.restore();

    return { canvas: featheredMask, edgeBlur };
  }

  return {
    draw(
      context: CanvasRenderingContext2D,
      points: NormalizedLandmark[],
      width: number,
      height: number,
      options: LipRenderOptions,
    ) {
      const { canvas: featheredMask, edgeBlur } = createFeatheredLipMask(
        points,
        width,
        height,
      );
      const effectCanvas = prepareWorkingCanvas(lipEffectCanvas, width, height);
      const effectContext = effectCanvas.getContext("2d");
      if (!effectContext) return;

      effectContext.clearRect(0, 0, width, height);
      effectContext.fillStyle = options.shadeHex;
      effectContext.fillRect(0, 0, width, height);
      effectContext.globalCompositeOperation = "destination-in";
      effectContext.drawImage(featheredMask, 0, 0);
      effectContext.globalCompositeOperation = "source-over";

      context.save();
      context.globalCompositeOperation = "multiply";
      context.globalAlpha = options.intensity;
      context.drawImage(effectCanvas, 0, 0);
      context.restore();

      if (options.isGloss) {
        drawGlossHighlight(
          context,
          points,
          width,
          height,
          featheredMask,
          effectCanvas,
          edgeBlur,
        );
      }
    },
  };
}

export type LipRenderer = ReturnType<typeof createLipRenderer>;
