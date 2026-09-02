import type { NextConfig } from "next";
import {
  MEDIAPIPE_BROWSER_CACHE_CONTROL,
  MEDIAPIPE_STATIC_VERSIONED_BASE_PATH,
  MEDIAPIPE_VERSIONED_BASE_PATH,
} from "./app/features/try-on/mediapipe-config";
import { SECURITY_HEADERS } from "./security-headers";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: `${MEDIAPIPE_VERSIONED_BASE_PATH}/:asset*`,
          destination: `${MEDIAPIPE_STATIC_VERSIONED_BASE_PATH}/:asset*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async headers() {
    return [
      {
        source: "/",
        headers: SECURITY_HEADERS,
      },
      {
        source: "/:path*",
        headers: SECURITY_HEADERS,
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
