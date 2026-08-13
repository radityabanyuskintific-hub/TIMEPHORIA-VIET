"use client";

/* The try-on backdrop is an existing product asset whose crop is controlled by CSS. */
/* eslint-disable @next/next/no-img-element */

import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef, useState } from "react";
import { createBanubaSession, isBanubaConfigured, type BanubaSession } from "../features/try-on/banuba";
import { createMakeupRenderer, type MakeupRenderer } from "../features/try-on/makeup-renderer";
import { acquireFaceLandmarker, type FaceLandmarkerLease } from "../features/try-on/mediapipe";
import type { TryOnPreset } from "../features/try-on/try-on-presets";
import type { LipTryOnShade } from "../lip-try-on-shades";
import type { Language } from "../features/catalog/types";

type TryOnStatus = "loading" | "running" | "error";
type CaptureStatus = "idle" | "saved" | "error";
type CameraRatio = "9:16" | "4:5";
type CameraFacing = "environment" | "user";

const INTENSITY_LEVELS = [0.2, 0.28, 0.38] as const;

type VirtualTryOnProps = {
  language: Language;
  onClose: () => void;
  preset: TryOnPreset;
  productFinish: string;
  productImage: string;
  productName: string;
};

const COPY: Record<Language, {
  approximation: string;
  backCamera: string;
  cameraHint: string;
  capture: string;
  captured: string;
  close: string;
  effectOff: string;
  effectOn: string;
  error: string;
  flipCamera: string;
  frontCamera: string;
  fullscreen: string;
  intensity: string;
  loading: string;
  retry: string;
  shade: string;
  swipes: string[];
  title: string;
}> = {
  id: {
    approximation: "Visualisasi warna. Hasil aktual dapat berbeda karena pencahayaan dan layar.",
    backCamera: "Kamera belakang aktif",
    cameraHint: "Izinkan akses kamera saat browser memintanya.",
    capture: "AMBIL FOTO",
    captured: "FOTO TERSIMPAN",
    close: "Tutup virtual try-on",
    effectOff: "LIHAT TANPA EFEK",
    effectOn: "HASIL AKTIF",
    error: "Virtual try-on belum dapat dimulai. Periksa koneksi dan izin kameramu.",
    flipCamera: "Ganti kamera depan atau belakang",
    frontCamera: "Kamera depan aktif",
    fullscreen: "Ubah layar penuh",
    intensity: "INTENSITAS",
    loading: "MENYIAPKAN TRY-ON...",
    retry: "COBA LAGI",
    shade: "WARNA",
    swipes: ["1 SAPUAN", "2 SAPUAN", "3 SAPUAN"],
    title: "COBA PRODUK DI WAJAHMU",
  },
  en: {
    approximation: "Shade visualization only. Results vary with lighting and screen settings.",
    backCamera: "Back camera active",
    cameraHint: "Allow camera access when your browser asks.",
    capture: "CAPTURE",
    captured: "PHOTO SAVED",
    close: "Close virtual try-on",
    effectOff: "VIEW WITHOUT EFFECT",
    effectOn: "EFFECT ON",
    error: "Virtual try-on could not start. Check your connection and camera permission.",
    flipCamera: "Switch front or back camera",
    frontCamera: "Front camera active",
    fullscreen: "Toggle fullscreen",
    intensity: "INTENSITY",
    loading: "PREPARING TRY-ON...",
    retry: "TRY AGAIN",
    shade: "SHADE",
    swipes: ["1 SWIPE", "2 SWIPES", "3 SWIPES"],
    title: "TRY IT ON YOUR FACE",
  },
  es: {
    approximation: "Visualización del tono. El resultado puede variar según la luz y la pantalla.",
    backCamera: "Cámara trasera activa",
    cameraHint: "Permite el acceso a la cámara cuando tu navegador lo solicite.",
    capture: "TOMAR FOTO",
    captured: "FOTO GUARDADA",
    close: "Cerrar prueba virtual",
    effectOff: "VER SIN EFECTO",
    effectOn: "EFECTO ACTIVO",
    error: "No se pudo iniciar la prueba virtual. Revisa la conexión y los permisos de cámara.",
    flipCamera: "Cambiar cámara frontal o trasera",
    frontCamera: "Cámara frontal activa",
    fullscreen: "Cambiar pantalla completa",
    intensity: "INTENSIDAD",
    loading: "PREPARANDO LA PRUEBA...",
    retry: "INTENTAR DE NUEVO",
    shade: "TONO",
    swipes: ["1 PASADA", "2 PASADAS", "3 PASADAS"],
    title: "PRUÉBALO EN TU ROSTRO",
  },
  "zh-tw": {
    approximation: "色彩為模擬效果，實際結果可能因光線與螢幕而異。",
    backCamera: "後置鏡頭已啟用",
    cameraHint: "瀏覽器詢問時，請允許使用鏡頭。",
    capture: "拍照",
    captured: "照片已儲存",
    close: "關閉虛擬試妝",
    effectOff: "查看原始畫面",
    effectOn: "試妝效果開啟",
    error: "無法啟動虛擬試妝，請檢查連線與鏡頭權限。",
    flipCamera: "切換前後鏡頭",
    frontCamera: "前置鏡頭已啟用",
    fullscreen: "切換全螢幕",
    intensity: "顯色濃度",
    loading: "正在準備虛擬試妝...",
    retry: "再試一次",
    shade: "色號",
    swipes: ["1 次塗抹", "2 次塗抹", "3 次塗抹"],
    title: "在臉上即時試妝",
  },
};

export default function VirtualLipTryOn({
  language,
  onClose,
  preset,
  productFinish,
  productImage,
  productName,
}: VirtualTryOnProps) {
  const shades = preset.shades;
  const initialShade = shades[0];
  const copy = COPY[language];
  const tryOnRef = useRef<HTMLElement>(null);
  const banubaContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<MakeupRenderer | null>(null);
  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const landmarkerLeaseRef = useRef<FaceLandmarkerLease | null>(null);
  const pendingLeaseRef = useRef<Promise<FaceLandmarkerLease> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const banubaSessionRef = useRef<BanubaSession | null>(null);
  const rafRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const captureTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const facingRef = useRef<CameraFacing>("user");
  const shadeRef = useRef(initialShade);
  const intensityRef = useRef<number>(INTENSITY_LEVELS[0]);
  const effectEnabledRef = useRef(true);

  const [status, setStatus] = useState<TryOnStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedShade, setSelectedShade] = useState(initialShade);
  const [intensity, setIntensity] = useState<number>(INTENSITY_LEVELS[0]);
  const [intensityOpen, setIntensityOpen] = useState(false);
  const [effectEnabled, setEffectEnabled] = useState(true);
  const [faceDetected, setFaceDetected] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<CaptureStatus>("idle");
  const [cameraRatio, setCameraRatio] = useState<CameraRatio>("4:5");
  const [cameraFacing, setCameraFacing] = useState<CameraFacing>("user");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [engine, setEngine] = useState<"banuba" | "mediapipe">("mediapipe");
  const isGlossProduct = productFinish === "GLOSS IT BETTER" || /GLOSS|GLOSSY|VINYL|BALM|VELVET-SHINE/i.test(productName);

  const stopEverything = useCallback(() => {
    if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    const pending = pendingLeaseRef.current;
    pendingLeaseRef.current = null;
    if (pending) void pending.then((lease) => lease.release()).catch(() => undefined);
    landmarkerLeaseRef.current?.release();
    landmarkerLeaseRef.current = null;
    landmarkerRef.current = null;
    const banubaSession = banubaSessionRef.current;
    banubaSessionRef.current = null;
    if (banubaSession) void banubaSession.destroy().catch(() => undefined);
  }, []);

  const requestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    closeTimerRef.current = window.setTimeout(onClose, reducedMotion ? 0 : 420);
  }, [isClosing, onClose]);

  function beginRenderLoop() {
    let lastDetectionAt = 0;
    let lastVideoTime = -1;
    const renderFrame = (timestamp: number) => {
      if (!mountedRef.current) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;
      if (video && canvas && landmarker && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA && !document.hidden && timestamp - lastDetectionAt >= 1000 / 24 && video.currentTime !== lastVideoTime) {
        if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }
        const context = canvas.getContext("2d");
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
          const points = landmarker.detectForVideo(video, performance.now()).faceLandmarks[0];
          setFaceDetected(Boolean(points));
          if (points && effectEnabledRef.current) {
            rendererRef.current ??= createMakeupRenderer();
            rendererRef.current.draw(context, points, canvas.width, canvas.height, {
              intensity: intensityRef.current,
              isGloss: isGlossProduct,
              preset,
              shadeHex: shadeRef.current.hex,
              time: timestamp,
            });
          }
        }
        lastDetectionAt = timestamp;
        lastVideoTime = video.currentTime;
      }
      rafRef.current = window.requestAnimationFrame(renderFrame);
    };
    rafRef.current = window.requestAnimationFrame(renderFrame);
  }

  async function startMediaPipe(facingMode: CameraFacing) {
    const leasePromise = acquireFaceLandmarker();
    pendingLeaseRef.current = leasePromise;
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 1920 } },
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
    const lease = await leasePromise;
    pendingLeaseRef.current = null;
    if (!mountedRef.current) {
      lease.release();
      return;
    }
    landmarkerLeaseRef.current = lease;
    landmarkerRef.current = lease.landmarker;
    setEngine("mediapipe");
    setStatus("running");
    beginRenderLoop();
  }

  async function startTryOn(facingMode: CameraFacing = facingRef.current) {
    stopEverything();
    setStatus("loading");
    setErrorMessage("");
    setFaceDetected(false);
    try {
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) throw new Error("unsupported");
      if (isBanubaConfigured && banubaContainerRef.current) {
        try {
          const session = await createBanubaSession(banubaContainerRef.current, facingMode);
          if (!mountedRef.current) {
            await session.destroy();
            return;
          }
          banubaSessionRef.current = session;
          await session.applyPreset(preset, shadeRef.current.hex, intensityRef.current);
          setEngine("banuba");
          setFaceDetected(true);
          setStatus("running");
          return;
        } catch (error) {
          console.warn("Banuba initialization failed; using the on-device fallback.", error);
        }
      }
      await startMediaPipe(facingMode);
    } catch (error) {
      stopEverything();
      const errorName = error instanceof DOMException ? error.name : "";
      const message = errorName === "NotAllowedError"
        ? language === "id" ? "Akses kamera ditolak. Izinkan kamera di pengaturan browser lalu coba lagi." : language === "es" ? "Se rechazó el acceso a la cámara. Permítelo en la configuración del navegador." : language === "zh-tw" ? "鏡頭存取遭拒，請在瀏覽器設定中允許鏡頭。" : "Camera access was denied. Allow it in browser settings, then try again."
        : copy.error;
      if (mountedRef.current) {
        setErrorMessage(message);
        setStatus("error");
      }
    }
  }

  useEffect(() => {
    mountedRef.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => void startTryOn());
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") requestClose(); };
    const handleFullscreenChange = () => setIsFullscreen(document.fullscreenElement === tryOnRef.current);
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      mountedRef.current = false;
      document.body.style.overflow = previousOverflow;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current);
      if (captureTimerRef.current !== null) window.clearTimeout(captureTimerRef.current);
      stopEverything();
    };
    // Opening the panel is the user action that starts the camera flow.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const session = banubaSessionRef.current;
    if (session) void session.applyPreset(preset, selectedShade.hex, effectEnabled ? intensity : 0).catch(console.warn);
  }, [effectEnabled, intensity, preset, selectedShade]);

  function selectShade(shade: LipTryOnShade) {
    shadeRef.current = shade;
    setSelectedShade(shade);
  }

  function selectIntensity(value: number) {
    intensityRef.current = value;
    setIntensity(value);
    setIntensityOpen(false);
  }

  async function switchCamera() {
    const nextFacing = facingRef.current === "user" ? "environment" : "user";
    facingRef.current = nextFacing;
    setCameraFacing(nextFacing);
    setStatus("loading");
    if (banubaSessionRef.current) {
      try {
        await banubaSessionRef.current.switchCamera(nextFacing);
        setStatus("running");
      } catch {
        await startTryOn(nextFacing);
      }
    } else {
      await startTryOn(nextFacing);
    }
  }

  async function toggleFullscreen() {
    const element = tryOnRef.current;
    if (!element) return;
    try {
      if (document.fullscreenElement === element) await document.exitFullscreen();
      else if (document.fullscreenEnabled) await element.requestFullscreen();
      else setIsFullscreen((value) => !value);
    } catch {
      setIsFullscreen((value) => !value);
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

  function saveBlob(blob: Blob) {
    const safeProductName = productName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${safeProductName}-${selectedShade.code}-try-on.jpg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setCaptureStatus("saved");
    if (captureTimerRef.current !== null) window.clearTimeout(captureTimerRef.current);
    captureTimerRef.current = window.setTimeout(() => setCaptureStatus("idle"), 1800);
  }

  async function capturePhoto() {
    try {
      if (banubaSessionRef.current) {
        saveBlob(await banubaSessionRef.current.capture());
        return;
      }
      const video = videoRef.current;
      const overlay = canvasRef.current;
      if (!video || !overlay || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) throw new Error("no frame");
      const outputWidth = 1080;
      const outputHeight = cameraRatio === "9:16" ? 1920 : 1350;
      const targetRatio = outputWidth / outputHeight;
      const sourceRatio = video.videoWidth / video.videoHeight;
      let sx = 0;
      let sy = 0;
      let sw = video.videoWidth;
      let sh = video.videoHeight;
      if (sourceRatio > targetRatio) {
        sw = video.videoHeight * targetRatio;
        sx = (video.videoWidth - sw) / 2;
      } else {
        sh = video.videoWidth / targetRatio;
        sy = (video.videoHeight - sh) / 2;
      }
      const photo = document.createElement("canvas");
      photo.width = outputWidth;
      photo.height = outputHeight;
      const context = photo.getContext("2d");
      if (!context) throw new Error("no canvas");
      if (cameraFacing === "user") {
        context.translate(outputWidth, 0);
        context.scale(-1, 1);
      }
      context.drawImage(video, sx, sy, sw, sh, 0, 0, outputWidth, outputHeight);
      if (effectEnabledRef.current) context.drawImage(overlay, sx, sy, sw, sh, 0, 0, outputWidth, outputHeight);
      photo.toBlob((blob) => blob ? saveBlob(blob) : setCaptureStatus("error"), "image/jpeg", 0.94);
    } catch {
      setCaptureStatus("error");
    }
  }

  return (
    <section
      aria-label={`${productName}, virtual try-on`}
      aria-modal="true"
      className={`virtual-tryon ${isClosing ? "closing" : ""} ${isFullscreen ? "fullscreen" : ""}`}
      ref={tryOnRef}
      role="dialog"
    >
      <div className={`tryon-stage ${status} ${cameraFacing === "environment" ? "back-camera" : "front-camera"}`}>
        <img className="tryon-product-backdrop" src={productImage} alt="" />
        <video aria-hidden="true" className={`tryon-video ${engine === "banuba" ? "hidden" : ""}`} muted playsInline ref={videoRef} />
        <canvas aria-hidden="true" className={`tryon-canvas ${engine === "banuba" ? "hidden" : ""}`} ref={canvasRef} />
        <div aria-hidden={engine !== "banuba"} className={`tryon-banuba ${engine === "banuba" ? "active" : ""}`} ref={banubaContainerRef} />

        <header className="tryon-floating-nav" aria-label="Virtual try-on controls">
          <button aria-pressed={cameraRatio === "9:16"} onClick={() => setCameraRatio("9:16")} type="button">9:16</button>
          <button aria-pressed={cameraRatio === "4:5"} onClick={() => setCameraRatio("4:5")} type="button">4:5</button>
          <button aria-label={copy.flipCamera} disabled={status !== "running"} onClick={() => void switchCamera()} title={cameraFacing === "user" ? copy.frontCamera : copy.backCamera} type="button">↻</button>
          <button aria-label={copy.fullscreen} aria-pressed={isFullscreen} onClick={() => void toggleFullscreen()} type="button">↗</button>
          <button aria-label={copy.close} className="tryon-close" onClick={requestClose} type="button">×</button>
        </header>

        {status === "loading" ? <div className="tryon-status-panel"><i /><strong>{copy.loading}</strong><span>{copy.cameraHint}</span></div> : null}
        {status === "error" ? <div className="tryon-status-panel error" role="alert"><strong>{errorMessage}</strong><button onClick={() => void startTryOn()} type="button">{copy.retry}</button></div> : null}
        {status === "running" && engine === "mediapipe" && !faceDetected ? <div className="tryon-face-guide"><i /></div> : null}

        {status === "running" ? (
          <div className="tryon-camera-ui">
            <div className="tryon-shade-list" aria-label={copy.shade}>
              {shades.map((shadeItem) => (
                <button aria-label={`${shadeItem.code} ${shadeItem.name}`} aria-pressed={selectedShade.code === shadeItem.code} className={selectedShade.code === shadeItem.code ? "selected" : ""} key={`${shadeItem.code}-${shadeItem.name}`} onClick={() => selectShade(shadeItem)} type="button">
                  <i style={{ backgroundColor: shadeItem.hex }} />
                </button>
              ))}
            </div>

            <div className="tryon-lower-controls">
              <button aria-pressed={effectEnabled} className="tryon-selected-shade" onClick={toggleEffect} type="button">
                <span>{copy.shade}</span>
                <strong>{selectedShade.code} {selectedShade.name}</strong>
                <small>{effectEnabled ? copy.effectOn : copy.effectOff}</small>
              </button>

              <button className={`tryon-capture-button ${captureStatus}`} onClick={() => void capturePhoto()} type="button">
                <i />
                <span>{captureStatus === "saved" ? copy.captured : copy.capture}</span>
              </button>

              <div className="tryon-intensity-menu">
                {intensityOpen ? (
                  <div className="tryon-intensity-options">
                    {[2, 1, 0].map((index) => (
                      <button aria-pressed={intensity === INTENSITY_LEVELS[index]} key={INTENSITY_LEVELS[index]} onClick={() => selectIntensity(INTENSITY_LEVELS[index])} type="button">{copy.swipes[index]}</button>
                    ))}
                  </div>
                ) : null}
                <button aria-expanded={intensityOpen} className="tryon-intensity-trigger" onClick={() => setIntensityOpen((open) => !open)} type="button">
                  <span>{copy.intensity}</span>
                  <strong>{copy.swipes[INTENSITY_LEVELS.indexOf(intensity as typeof INTENSITY_LEVELS[number])]} <b>⌃</b></strong>
                </button>
              </div>
            </div>
            <p className="tryon-approximation">{copy.approximation}{preset.shimmer ? " ✦" : ""}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
