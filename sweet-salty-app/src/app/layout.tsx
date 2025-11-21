import type { Metadata } from "next";
import { Tajawal, Raleway } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { DirectionScript } from "@/components/shared/direction-script";

const tajawal = Tajawal({
  variable: "--font-primary",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const raleway = Raleway({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "حلو ومالح | Sweet & Salty",
  description:
    "Delicious fusion restaurant experience with meals, drinks, desserts, and sandwiches. Order, manage your profile, and explore offers.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" suppressHydrationWarning>
      <head>
        <DirectionScript />
      </head>
      <body
        className={`${tajawal.variable} ${raleway.variable} min-h-screen bg-slate-950 text-slate-100 antialiased`}
      >
        <SessionProvider>
          <div className="min-h-screen bg-slate-950">{children}</div>
        </SessionProvider>
      </body>
    </html>
  );
}
