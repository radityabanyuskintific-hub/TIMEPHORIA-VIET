import type { FaceLandmarker } from "@mediapipe/tasks-vision";

const MEDIAPIPE_RUNTIME_PATH = "/vendor/mediapipe";
const FACE_LANDMARKER_MODEL_PATH =
  "/vendor/mediapipe/face_landmarker.task";

export async function createFaceLandmarker(): Promise<FaceLandmarker> {
  const { FaceLandmarker, FilesetResolver } = await import(
    "@mediapipe/tasks-vision"
  );
  const fileset = await FilesetResolver.forVisionTasks(
    MEDIAPIPE_RUNTIME_PATH,
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
