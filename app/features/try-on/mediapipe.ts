import type { FaceLandmarker } from "@mediapipe/tasks-vision";
import { MEDIAPIPE_VERSIONED_BASE_PATH } from "./mediapipe-config";

const FACE_LANDMARKER_MODEL_PATH =
  `${MEDIAPIPE_VERSIONED_BASE_PATH}/face_landmarker.task`;
const LANDMARKER_IDLE_TIMEOUT_MS = 90_000;

export type FaceLandmarkerLease = {
  landmarker: FaceLandmarker;
  release: () => void;
};

let sharedLandmarker: FaceLandmarker | null = null;
let sharedLandmarkerPromise: Promise<FaceLandmarker> | null = null;
let activeLeaseCount = 0;
let idleTimer: ReturnType<typeof setTimeout> | null = null;

function clearIdleTimer() {
  if (idleTimer !== null) {
    clearTimeout(idleTimer);
    idleTimer = null;
  }
}

function scheduleIdleDisposal() {
  clearIdleTimer();
  if (activeLeaseCount > 0 || !sharedLandmarker) return;

  idleTimer = setTimeout(() => {
    idleTimer = null;
    if (activeLeaseCount > 0 || !sharedLandmarker) return;

    sharedLandmarker.close();
    sharedLandmarker = null;
    sharedLandmarkerPromise = null;
  }, LANDMARKER_IDLE_TIMEOUT_MS);
}

async function initializeFaceLandmarker(): Promise<FaceLandmarker> {
  const { FaceLandmarker, FilesetResolver } = await import(
    "@mediapipe/tasks-vision"
  );
  const fileset = await FilesetResolver.forVisionTasks(
    MEDIAPIPE_VERSIONED_BASE_PATH,
  );
  const options = {
    baseOptions: {
      modelAssetPath: FACE_LANDMARKER_MODEL_PATH,
      delegate: "GPU" as const,
    },
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
      baseOptions: {
        modelAssetPath: FACE_LANDMARKER_MODEL_PATH,
        delegate: "CPU",
      },
    });
  }
}

function loadSharedLandmarker() {
  if (!sharedLandmarkerPromise) {
    sharedLandmarkerPromise = initializeFaceLandmarker()
      .then((landmarker) => {
        sharedLandmarker = landmarker;
        return landmarker;
      })
      .catch((error: unknown) => {
        sharedLandmarkerPromise = null;
        throw error;
      });
  }

  return sharedLandmarkerPromise;
}

export async function acquireFaceLandmarker(): Promise<FaceLandmarkerLease> {
  clearIdleTimer();
  activeLeaseCount += 1;

  try {
    const landmarker = await loadSharedLandmarker();
    let released = false;

    return {
      landmarker,
      release() {
        if (released) return;
        released = true;
        activeLeaseCount = Math.max(0, activeLeaseCount - 1);
        scheduleIdleDisposal();
      },
    };
  } catch (error) {
    activeLeaseCount = Math.max(0, activeLeaseCount - 1);
    throw error;
  }
}
