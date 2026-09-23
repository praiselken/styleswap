import type { NextConfig } from "next";

const useEmulators = process.env.NEXT_PUBLIC_FIREBASE_EMULATORS === "true";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/**",
      },
      // The Storage emulator serves photos from localhost, so next/image needs
      // to allow it too — but only when we're actually pointed at the emulator.
      ...(useEmulators
        ? ([
            {
              protocol: "http",
              hostname: "127.0.0.1",
              port: "9199",
              pathname: "/v0/b/**",
            },
          ] as const)
        : []),
    ],
  },
};

export default nextConfig;
