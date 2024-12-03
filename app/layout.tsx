import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import RootProvider from "@/provider/RootProviders";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Balanci",
  description: "L'application qui aide à équilibrer ses finances",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="light" style={{ colorScheme: "light" }}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <RootProvider>{children}</RootProvider>
          <Toaster richColors position="bottom-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}
