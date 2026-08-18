import type { NextConfig } from "next";
import {
  MEDIAPIPE_BROWSER_CACHE_CONTROL,
  MEDIAPIPE_VERSIONED_BASE_PATH,
} from "./app/features/try-on/mediapipe-config";
import { BANUBA_VERSIONED_BASE_PATH } from "./app/features/try-on/banuba-config";
import { SECURITY_HEADERS } from "./security-headers";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
      },
      {
        source: `${BANUBA_VERSIONED_BASE_PATH}/:asset*`,
        headers: [
          { key: "Cache-Control", value: MEDIAPIPE_BROWSER_CACHE_CONTROL },
        ],
      },
      {
        source: `${MEDIAPIPE_VERSIONED_BASE_PATH}/:asset*`,
        headers: [
          {
            key: "Cache-Control",
            value: MEDIAPIPE_BROWSER_CACHE_CONTROL,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
