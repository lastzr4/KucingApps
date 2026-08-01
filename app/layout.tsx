import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/layout/BottomNav";

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
    <html lang="ms">
      <body>
        <div className="max-w-md mx-auto min-h-screen bg-slate-950 relative shadow-2xl">
          {children}
        </div>
        <BottomNav />
      </body>
    </html>
  );
}
