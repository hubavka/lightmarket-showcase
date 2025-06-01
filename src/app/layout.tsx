import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/components/NotificationProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LightMarket - Digital Assets Marketplace",
  description: "Buy and sell digital assets with instant Bitcoin Lightning payments. Fast, cheap, and global.",
  keywords: ["digital assets", "marketplace", "bitcoin", "lightning", "payments", "instant"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}
