import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Montserrat, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import "./features/try-on/try-on.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  weight: ["300", "400", "500", "600", "700", "800"],
  preload: false,
});

const isVercelDeployment = process.env.VERCEL === "1";

export const metadata: Metadata = {
  title: "Timephoria Product Universe",
  description:
    "Khám phá sản phẩm Timephoria và thử màu trang điểm trực tuyến.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={`${montserrat.variable} ${notoSansTC.variable} antialiased`}>
        {children}
        {isVercelDeployment ? (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        ) : null}
      </body>
    </html>
  );
}
