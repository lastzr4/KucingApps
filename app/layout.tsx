import type { Metadata, Viewport } from "next";
import { Orbitron } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "KucingApps",
  description: "Rekod, pantau & uruskan populasi kucing komuniti apartment - gamified!",
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ms" className={orbitron.variable}>
      <body>
        <div className="max-w-md mx-auto min-h-screen bg-app-gradient relative shadow-2xl overflow-x-hidden">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
