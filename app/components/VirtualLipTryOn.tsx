"use client";

import type { FaceLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LipTryOnShade } from "../lip-try-on-shades";

type Language = "en" | "id";
type TryOnStatus = "idle" | "loading" | "running" | "error";

type VirtualLipTryOnProps = {
  language: Language;
  onClose: () => void;
  productFinish: string;
  productImage: string;
  productName: string;
  shades: LipTryOnShade[];
};

const OUTER_LIP = [
  61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267,
  0, 37, 39, 40, 185,
];

const INNER_LIP = [
  78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312,
  13, 82, 81, 80, 191,
];

const MEDIAPIPE_VERSION = "0.10.35";
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

export default function VirtualLipTryOn({
  language,
  onClose,
  productFinish,
  productImage,
  productName,
  shades,
}: VirtualLipTryOnProps) {
  const initialShade = shades[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lipMaskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const featheredMaskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lipEffectCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);
  const mountedRef = useRef(true);
  const faceDetectedRef = useRef(false);
  const shadeRef = useRef(initialShade);
  const intensityRef = useRef(0.01);
  const effectEnabledRef = useRef(true);

  const [status, setStatus] = useState<TryOnStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedShade, setSelectedShade] = useState(initialShade);
  const [intensity, setIntensity] = useState(0.01);
  const [effectEnabled, setEffectEnabled] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const isGlossProduct = productFinish === "GLOSS IT BETTER" ||
    /GLOSS|GLOSSY|VINYL|BALM|VELVET-SHINE/i.test(productName);

  const copy = language === "id"
    ? {
        title: "COBA WARNA BIBIRMU",
        intro: "Lihat warna Timephoria langsung di bibirmu melalui kamera depan.",
        privacy: "Kamera diproses di perangkatmu. Foto dan video tidak diunggah atau disimpan.",
        enable: "AKTIFKAN KAMERA",
        loading: "MENYIAPKAN TRY-ON...",
        cameraHint: "Izinkan akses kamera saat browser memintanya.",
        centerFace: "Posisikan wajahmu di tengah kamera",
        shade: "Warna",
        scrollHint: "Geser ke kiri untuk melihat warna lain",
        intensity: "Intensitas warna",
        effectOn: "HASIL AKTIF",
        effectOff: "LIHAT TANPA WARNA",
        retry: "COBA LAGI",
        close: "Tutup virtual try-on",
        approximation: "Visualisasi warna. Hasil aktual dapat berbeda karena pencahayaan dan layar.",
      }
    : {
        title: "TRY YOUR LIP SHADE",
        intro: "See Timephoria shades on your lips using your front camera.",
        privacy: "Camera processing stays on your device. Photos and video are not uploaded or saved.",
        enable: "ENABLE CAMERA",
        loading: "PREPARING TRY-ON...",
        cameraHint: "Allow camera access when your browser asks.",
        centerFace: "Center your face in the camera",
        shade: "Shade",
        scrollHint: "Scroll left to explore shade",
        intensity: "Color intensity",
        effectOn: "EFFECT ON",
        effectOff: "VIEW WITHOUT COLOR",
        retry: "TRY AGAIN",
        close: "Close virtual try-on",
        approximation: "Shade visualization only. Actual results vary with lighting and screen settings.",
      };

  const stopEverything = useCallback(() => {
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    landmarkerRef.current?.close();
    landmarkerRef.current = null;
  }, []);

  const requestClose = useCallback(() => {
    if (isClosingRef.current) return;
    isClosingRef.current = true;
    setIsClosing(true);

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimerRef.current = window.setTimeout(onClose, prefersReducedMotion ? 0 : 420);
  }, [onClose]);

  useEffect(() => {
    mountedRef.current = true;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") requestClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      mountedRef.current = false;
      window.removeEventListener("keydown", handleKeyDown);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      stopEverything();
    };
  }, [requestClose, stopEverything]);

  function updateFaceDetected(nextValue: boolean) {
    if (faceDetectedRef.current === nextValue) return;
    faceDetectedRef.current = nextValue;
    setFaceDetected(nextValue);
  }

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
    canvasReference: { current: HTMLCanvasElement | null },
    width: number,
    height: number,
  ) {
    if (!canvasReference.current) {
      canvasReference.current = document.createElement("canvas");
    }

    const canvas = canvasReference.current;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    return canvas;
  }

  function createFeatheredLipMask(
    points: NormalizedLandmark[],
    width: number,
    height: number,
  ) {
    const maskCanvas = prepareWorkingCanvas(lipMaskCanvasRef, width, height);
    const featheredMaskCanvas = prepareWorkingCanvas(
      featheredMaskCanvasRef,
      width,
      height,
    );
    const maskContext = maskCanvas.getContext("2d");
    const featheredMaskContext = featheredMaskCanvas.getContext("2d");
    const edgeBlur = Math.max(2.2, Math.min(4, (width / 640) * 2.4));

    if (!maskContext || !featheredMaskContext) {
      return { canvas: maskCanvas, edgeBlur };
    }

    maskContext.clearRect(0, 0, width, height);
    maskContext.beginPath();
    tracePath(maskContext, points, OUTER_LIP, width, height);
    tracePath(maskContext, points, INNER_LIP, width, height);
    maskContext.fillStyle = "#ffffff";
    maskContext.fill("evenodd");

    featheredMaskContext.clearRect(0, 0, width, height);
    featheredMaskContext.save();
    featheredMaskContext.filter = `blur(${edgeBlur}px)`;
    featheredMaskContext.drawImage(maskCanvas, 0, 0);
    featheredMaskContext.restore();

    return { canvas: featheredMaskCanvas, edgeBlur };
  }

  function drawLipColor(
    context: CanvasRenderingContext2D,
    points: NormalizedLandmark[],
    width: number,
    height: number,
  ) {
    const { canvas: featheredMask, edgeBlur } = createFeatheredLipMask(
      points,
      width,
      height,
    );
    const effectCanvas = prepareWorkingCanvas(lipEffectCanvasRef, width, height);
    const effectContext = effectCanvas.getContext("2d");
    if (!effectContext) return;

    effectContext.clearRect(0, 0, width, height);
    effectContext.fillStyle = shadeRef.current.hex;
    effectContext.fillRect(0, 0, width, height);
    effectContext.globalCompositeOperation = "destination-in";
    effectContext.drawImage(featheredMask, 0, 0);
    effectContext.globalCompositeOperation = "source-over";

    context.save();
    context.globalCompositeOperation = "multiply";
    context.globalAlpha = intensityRef.current;
    context.drawImage(effectCanvas, 0, 0);
    context.restore();

    if (isGlossProduct) {
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

  function beginRenderLoop() {
    let lastDetectionAt = 0;
    let lastVideoTime = -1;
    const frameInterval = 1000 / 24;

    function renderFrame(timestamp: number) {
      if (!mountedRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;

      if (
        video &&
        canvas &&
        landmarker &&
        video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA &&
        !document.hidden &&
        timestamp - lastDetectionAt >= frameInterval &&
        video.currentTime !== lastVideoTime
      ) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          const result = landmarker.detectForVideo(video, performance.now());
          const points = result.faceLandmarks[0];
          updateFaceDetected(Boolean(points));

          if (points && effectEnabledRef.current) {
            drawLipColor(context, points, canvas.width, canvas.height);
          }
        }

        lastDetectionAt = timestamp;
        lastVideoTime = video.currentTime;
      }

      rafRef.current = window.requestAnimationFrame(renderFrame);
    }

    rafRef.current = window.requestAnimationFrame(renderFrame);
  }

  async function createLandmarker() {
    const { FaceLandmarker, FilesetResolver } = await import("@mediapipe/tasks-vision");
    const fileset = await FilesetResolver.forVisionTasks(
      `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MEDIAPIPE_VERSION}/wasm`,
    );
    const options = {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" as const },
      runningMode: "VIDEO" as const,
      numFaces: 1,
      minFaceDetectionConfidence: 0.55,
      minFacePresenceConfidence: 0.55,
      minTrackingConfidence: 0.55,
    };

    try {
      return await FaceLandmarker.createFromOptions(fileset, options);
    } catch {
      return FaceLandmarker.createFromOptions(fileset, {
        ...options,
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "CPU" },
      });
    }
  }

  async function startTryOn() {
    stopEverything();
    setStatus("loading");
    setErrorMessage("");
    updateFaceDetected(false);

    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("unsupported");
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
          aspectRatio: { ideal: 4 / 3 },
        },
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const landmarker = await createLandmarker();
      if (!mountedRef.current) {
        landmarker.close();
        stopEverything();
        return;
      }

      landmarkerRef.current = landmarker;
      setStatus("running");
      beginRenderLoop();
    } catch (error) {
      stopEverything();
      const errorName = error instanceof DOMException ? error.name : "";
      const message = errorName === "NotAllowedError"
        ? language === "id"
          ? "Akses kamera ditolak. Izinkan kamera di pengaturan browser lalu coba lagi."
          : "Camera access was denied. Allow it in your browser settings, then try again."
        : errorName === "NotFoundError"
          ? language === "id"
            ? "Kamera depan tidak ditemukan di perangkat ini."
            : "A front camera could not be found on this device."
          : language === "id"
            ? "Virtual try-on belum dapat dimulai. Periksa koneksi dan izin kameramu."
            : "Virtual try-on could not start. Check your connection and camera permission.";

      if (mountedRef.current) {
        setErrorMessage(message);
        setStatus("error");
      }
    }
  }

  function chooseShade(nextShade: LipTryOnShade) {
    shadeRef.current = nextShade;
    setSelectedShade(nextShade);
  }

  function changeIntensity(nextIntensity: number) {
    intensityRef.current = nextIntensity;
    setIntensity(nextIntensity);
  }

  function toggleEffect() {
    const nextValue = !effectEnabledRef.current;
    effectEnabledRef.current = nextValue;
    setEffectEnabled(nextValue);
    if (!nextValue) {
      const canvas = canvasRef.current;
      canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  return (
    <section
      aria-label={`${productName} virtual try-on`}
      aria-modal="true"
      className={`virtual-tryon ${isClosing ? "closing" : ""}`}
      role="dialog"
    >
      <header className="tryon-header">
        <div>
          <span>TIMEPHORIA VIRTUAL TRY-ON</span>
          <h2>{productName}</h2>
        </div>
        <button aria-label={copy.close} className="tryon-close" onClick={requestClose} type="button">
          X
        </button>
      </header>

      <div className={`tryon-stage ${status}`}>
        {/* The existing local product thumbnail is a decorative camera-stage backdrop. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tryon-product-backdrop" src={productImage} alt="" aria-hidden="true" />
        <video ref={videoRef} className="tryon-video" muted playsInline />
        <canvas ref={canvasRef} className="tryon-canvas" aria-hidden="true" />

        {status === "idle" ? (
          <div className="tryon-intro-panel">
            <span>LIVE LIP COLOR</span>
            <h3>{copy.title}</h3>
            <p>{copy.intro}</p>
            <p className="tryon-privacy">{copy.privacy}</p>
            <button autoFocus onClick={startTryOn} type="button">
              {copy.enable}
            </button>
          </div>
        ) : null}

        {status === "loading" ? (
          <div className="tryon-status-panel" aria-live="polite">
            <i aria-hidden="true" />
            <strong>{copy.loading}</strong>
            <span>{copy.cameraHint}</span>
          </div>
        ) : null}

        {status === "running" && !faceDetected ? (
          <div className="tryon-face-guide" aria-live="polite">
            <i aria-hidden="true" />
            <span>{copy.centerFace}</span>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="tryon-status-panel error" role="alert">
            <strong>{errorMessage}</strong>
            <button onClick={startTryOn} type="button">{copy.retry}</button>
          </div>
        ) : null}
      </div>

      <div className={`tryon-controls ${status === "running" ? "active" : ""}`}>
        <div className="tryon-selected-shade">
          <span>{copy.shade}</span>
          <strong>{selectedShade.code} {selectedShade.name}</strong>
          {shades.length > 9 ? <em>{copy.scrollHint}</em> : null}
          {selectedShade.description ? <small>{selectedShade.description}</small> : null}
        </div>

        <div className="tryon-shade-list" aria-label={copy.shade}>
          {shades.map((shadeItem) => (
            <button
              aria-label={`${shadeItem.code} ${shadeItem.name}`}
              aria-pressed={selectedShade.code === shadeItem.code}
              className={selectedShade.code === shadeItem.code ? "selected" : ""}
              key={`${shadeItem.code}-${shadeItem.name}`}
              onClick={() => chooseShade(shadeItem)}
              title={`${shadeItem.code} ${shadeItem.name}`}
              type="button"
            >
              <i style={{ backgroundColor: shadeItem.hex }} />
              <span>{shadeItem.code}</span>
            </button>
          ))}
        </div>

        <div className="tryon-adjustments">
          <label>
            <span>{copy.intensity}</span>
            <input
              aria-label={copy.intensity}
              max="0.22"
              min="0.01"
              onChange={(event) => changeIntensity(Number(event.target.value))}
              step="0.01"
              type="range"
              value={intensity}
            />
          </label>
          <button aria-pressed={effectEnabled} onClick={toggleEffect} type="button">
            {effectEnabled ? copy.effectOn : copy.effectOff}
          </button>
        </div>

        <p>{copy.approximation}</p>
      </div>
    </section>
  );
}
