"use client";

import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createLipRenderer,
  type LipRenderer,
} from "../features/try-on/lip-renderer";
import {
  acquireFaceLandmarker,
  type FaceLandmarkerLease,
} from "../features/try-on/mediapipe";
import type { LipTryOnShade } from "../lip-try-on-shades";

type Language = "en" | "id";
type TryOnStatus = "idle" | "loading" | "running" | "error";
type CaptureStatus = "idle" | "saved" | "error";
type CameraRatio = "9:16" | "4:5";

const INTENSITY_LEVELS = [
  { label: "1 SWIPE", value: 0.2 },
  { label: "2 SWIPES", value: 0.28 },
  { label: "3 SWIPES", value: 0.38 },
] as const;

type VirtualLipTryOnProps = {
  language: Language;
  onClose: () => void;
  productFinish: string;
  productImage: string;
  productName: string;
  shades: LipTryOnShade[];
};

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
  const lipRendererRef = useRef<LipRenderer | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const landmarkerLeaseRef = useRef<FaceLandmarkerLease | null>(null);
  const pendingLandmarkerLeaseRef =
    useRef<Promise<FaceLandmarkerLease> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const captureTimerRef = useRef<number | null>(null);
  const isClosingRef = useRef(false);
  const mountedRef = useRef(true);
  const faceDetectedRef = useRef(false);
  const shadeRef = useRef(initialShade);
  const intensityRef = useRef(0.2);
  const effectEnabledRef = useRef(true);

  const [status, setStatus] = useState<TryOnStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedShade, setSelectedShade] = useState(initialShade);
  const [intensity, setIntensity] = useState(0.2);
  const [effectEnabled, setEffectEnabled] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>("idle");
  const [cameraRatio, setCameraRatio] = useState<CameraRatio>("4:5");
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

    const pendingLandmarkerLease = pendingLandmarkerLeaseRef.current;
    pendingLandmarkerLeaseRef.current = null;
    if (pendingLandmarkerLease) {
      void pendingLandmarkerLease
        .then((lease) => lease.release())
        .catch(() => undefined);
    }

    landmarkerLeaseRef.current?.release();
    landmarkerLeaseRef.current = null;
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
            if (!lipRendererRef.current) {
              lipRendererRef.current = createLipRenderer();
            }
            lipRendererRef.current.draw(
              context,
              points,
              canvas.width,
              canvas.height,
              {
                shadeHex: shadeRef.current.hex,
                intensity: intensityRef.current,
                isGloss: isGlossProduct,
              },
            );
          }
        }

        lastDetectionAt = timestamp;
        lastVideoTime = video.currentTime;
      }

      rafRef.current = window.requestAnimationFrame(renderFrame);
    }

    rafRef.current = window.requestAnimationFrame(renderFrame);
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

      const landmarkerLeasePromise = acquireFaceLandmarker();
      pendingLandmarkerLeaseRef.current = landmarkerLeasePromise;
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: "user" },
          width: { ideal: 1280 },
        },
      });

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        stopEverything();
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const landmarkerLease = await landmarkerLeasePromise;
      if (pendingLandmarkerLeaseRef.current === landmarkerLeasePromise) {
        pendingLandmarkerLeaseRef.current = null;
      }
      if (!mountedRef.current) {
        landmarkerLease.release();
        stopEverything();
        return;
      }

      landmarkerLeaseRef.current = landmarkerLease;
      landmarkerRef.current = landmarkerLease.landmarker;
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
