"use client";

import type { FaceLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef, useState } from "react";
import type { LipTryOnShade } from "../lip-try-on-shades";

type Language = "en" | "id";
type TryOnStatus = "idle" | "loading" | "running" | "error";
type CaptureStatus = "idle" | "saved" | "error";
type CameraRatio = "9:16" | "4:5";

const INTENSITY_LEVELS = [
  { label: "1 SWIPE", value: 0.15 },
  { label: "2 SWIPES", value: 0.22 },
  { label: "3 SWIPES", value: 0.3 },
] as const;

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
  const tryOnRef = useRef<HTMLElement>(null);
  const lipMaskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const featheredMaskCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lipEffectCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const captureTimerRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);
  const mountedRef = useRef(true);
  const faceDetectedRef = useRef(false);
  const shadeRef = useRef(initialShade);
  const intensityRef = useRef(0.15);
  const effectEnabledRef = useRef(true);

  const [status, setStatus] = useState<TryOnStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedShade, setSelectedShade] = useState(initialShade);
  const [intensity, setIntensity] = useState(0.15);
  const [effectEnabled, setEffectEnabled] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>("idle");
  const [cameraRatio, setCameraRatio] = useState<CameraRatio>("9:16");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
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
        capture: "AMBIL FOTO",
        captured: "FOTO TERSIMPAN",
        captureError: "COBA LAGI",
        close: "Tutup virtual try-on",
        approximation: "Visualisasi warna. Hasil aktual dapat berbeda karena pencahayaan dan layar.",
        fullscreen: "Layar penuh",
        exitFullscreen: "Keluar layar penuh",
        zoomIn: "Perbesar kamera",
        zoomOut: "Kembalikan zoom",
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
        capture: "CAPTURE",
        captured: "PHOTO SAVED",
        captureError: "TRY AGAIN",
        close: "Close virtual try-on",
        approximation: "Shade visualization only. Actual results vary with lighting and screen settings.",
        fullscreen: "Enter fullscreen",
        exitFullscreen: "Exit fullscreen",
        zoomIn: "Zoom camera in",
        zoomOut: "Reset camera zoom",
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

    function handleFullscreenChange() {
      setIsFullscreen(document.fullscreenElement === tryOnRef.current);
    }

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      mountedRef.current = false;
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      if (captureTimerRef.current !== null) window.clearTimeout(captureTimerRef.current);
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
    const outerLipPoints = OUTER_LIP.map((index) => points[index]);
    const lipMinX = Math.min(...outerLipPoints.map((point) => point.x * width));
    const lipMaxX = Math.max(...outerLipPoints.map((point) => point.x * width));
    const detectedLipWidth = lipMaxX - lipMinX;
    const edgeBlur = Math.max(4.5, Math.min(10, detectedLipWidth * 0.055));

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
    featheredMaskContext.globalAlpha = 0.96;
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
          width: { ideal: 720 },
          height: { ideal: 1080 },
          aspectRatio: { ideal: 4 / 6 },
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

  async function toggleFullscreen() {
    const tryOnElement = tryOnRef.current;
    if (!tryOnElement) return;

    try {
      if (document.fullscreenElement === tryOnElement) {
        await document.exitFullscreen();
      } else if (!document.fullscreenEnabled) {
        setIsFullscreen((fullscreen) => !fullscreen);
      } else {
        await tryOnElement.requestFullscreen();
      }
    } catch {
      setIsFullscreen((fullscreen) => !fullscreen);
    }
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

  function capturePhoto() {
    const video = videoRef.current;
    const overlayCanvas = canvasRef.current;
    if (!video || !overlayCanvas || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
      setCaptureStatus("error");
      return;
    }

    const outputWidth = 1080;
    const outputHeight = cameraRatio === "9:16" ? 1920 : 1350;
    const targetAspectRatio = outputWidth / outputHeight;
    const sourceWidth = video.videoWidth;
    const sourceHeight = video.videoHeight;
    const sourceAspectRatio = sourceWidth / sourceHeight;
    let cropX = 0;
    let cropY = 0;
    let cropWidth = sourceWidth;
    let cropHeight = sourceHeight;

    if (sourceAspectRatio > targetAspectRatio) {
      cropWidth = sourceHeight * targetAspectRatio;
      cropX = (sourceWidth - cropWidth) / 2;
    } else {
      cropHeight = sourceWidth / targetAspectRatio;
      cropY = (sourceHeight - cropHeight) / 2;
    }

    if (isZoomed) {
      const zoomScale = 1.22;
      const zoomedWidth = cropWidth / zoomScale;
      const zoomedHeight = cropHeight / zoomScale;
      cropX += (cropWidth - zoomedWidth) / 2;
      cropY += (cropHeight - zoomedHeight) / 2;
      cropWidth = zoomedWidth;
      cropHeight = zoomedHeight;
    }

    const photoCanvas = document.createElement("canvas");
    photoCanvas.width = outputWidth;
    photoCanvas.height = outputHeight;
    const photoContext = photoCanvas.getContext("2d");
    if (!photoContext) {
      setCaptureStatus("error");
      return;
    }

    photoContext.save();
    photoContext.translate(outputWidth, 0);
    photoContext.scale(-1, 1);
    photoContext.drawImage(
      video,
      cropX,
      cropY,
      cropWidth,
      cropHeight,
      0,
      0,
      outputWidth,
      outputHeight,
    );
    if (effectEnabledRef.current) {
      photoContext.drawImage(
        overlayCanvas,
        cropX,
        cropY,
        cropWidth,
        cropHeight,
        0,
        0,
        outputWidth,
        outputHeight,
      );
    }
    photoContext.restore();

    photoCanvas.toBlob((blob) => {
      if (!blob || !mountedRef.current) {
        if (mountedRef.current) setCaptureStatus("error");
        return;
      }

      const safeProductName = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = `${safeProductName}-${selectedShade.code}-try-on.jpg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      setCaptureStatus("saved");
      if (captureTimerRef.current !== null) window.clearTimeout(captureTimerRef.current);
      captureTimerRef.current = window.setTimeout(() => setCaptureStatus("idle"), 1800);
    }, "image/jpeg", 0.94);
  }


  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      void startTryOn();
    });
    return () => window.cancelAnimationFrame(frame);
    // Opening the product try-on is the user action that starts the camera flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      aria-label={`${productName} virtual try-on`}
      aria-modal="true"
      className={`virtual-tryon ${isClosing ? "closing" : ""} ${isFullscreen ? "fullscreen" : ""}`}
      ref={tryOnRef}
      role="dialog"
    >
      <header className="tryon-header">
        <nav className="tryon-floating-nav" aria-label="Virtual try-on controls">
          <div className="tryon-ratio-selector" aria-label="Camera ratio">
            {(["9:16", "4:5"] as CameraRatio[]).map((ratio) => (
              <button
                aria-pressed={cameraRatio === ratio}
                key={ratio}
                onClick={() => setCameraRatio(ratio)}
                type="button"
              >
                {ratio}
              </button>
            ))}
          </div>
          <button
            aria-label={isZoomed ? copy.zoomOut : copy.zoomIn}
            aria-pressed={isZoomed}
            className="tryon-icon-control"
            onClick={() => setIsZoomed((zoomed) => !zoomed)}
            type="button"
          >
            {isZoomed ? "1×" : "+"}
          </button>
          <button
            aria-label={isFullscreen ? copy.exitFullscreen : copy.fullscreen}
            aria-pressed={isFullscreen}
            className="tryon-icon-control"
            onClick={toggleFullscreen}
            type="button"
          >
            {isFullscreen ? "↙" : "↗"}
          </button>
          <button aria-label={copy.close} className="tryon-close" onClick={requestClose} type="button">
            X
          </button>
        </nav>
      </header>

      <div className={`tryon-stage ${status} ratio-${cameraRatio.replace(":", "-")} ${isZoomed ? "zoomed" : ""}`}>
        {/* The existing local product thumbnail is a decorative camera-stage backdrop. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="tryon-product-backdrop" src={productImage} alt="" aria-hidden="true" />
        <video ref={videoRef} className="tryon-video" muted playsInline />
        <canvas ref={canvasRef} className="tryon-canvas" aria-hidden="true" />

        {status === "idle" || status === "loading" ? (
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

        {status === "running" ? (
          <button
            aria-label={copy.capture}
            className={`tryon-capture-button ${captureStatus}`}
            onClick={capturePhoto}
            type="button"
          >
            <i aria-hidden="true" />
            <span aria-live="polite">
              {captureStatus === "saved"
                ? copy.captured
                : captureStatus === "error"
                  ? copy.captureError
                  : copy.capture}
            </span>
          </button>
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
          <div className="tryon-intensity-steps" aria-label={copy.intensity}>
            {INTENSITY_LEVELS.map((level) => (
              <button
                aria-label={`${level.label}, ${Math.round(level.value * 100)}%`}
                aria-pressed={intensity === level.value}
                key={level.value}
                onClick={() => changeIntensity(level.value)}
                type="button"
              >
                <strong>{level.label}</strong>
              </button>
            ))}
          </div>
          <button aria-pressed={effectEnabled} onClick={toggleEffect} type="button">
            {effectEnabled ? copy.effectOn : copy.effectOff}
          </button>
        </div>

        <p>{copy.approximation}</p>
      </div>
    </section>
  );
}
