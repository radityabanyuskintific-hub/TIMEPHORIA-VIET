import type { NextConfig } from "next";
import {
  MEDIAPIPE_BROWSER_CACHE_CONTROL,
  MEDIAPIPE_VERSIONED_BASE_PATH,
} from "./app/features/try-on/mediapipe-config";
import { BANUBA_VERSIONED_BASE_PATH } from "./app/features/try-on/banuba-config";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: `${BANUBA_VERSIONED_BASE_PATH}/:asset*`,
        headers: [
          { key: "Cache-Control", value: MEDIAPIPE_BROWSER_CACHE_CONTROL },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: `${MEDIAPIPE_VERSIONED_BASE_PATH}/:asset*`,
        headers: [
          {
            key: "Cache-Control",
            value: MEDIAPIPE_BROWSER_CACHE_CONTROL,
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
