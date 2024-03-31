import "@/styles/globals.css";

import { Inter } from "next/font/google";
import NextAuthProvider from "@/providers/NextAuthProvider";
import { SiteNav } from "@/components/main-nav";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/providers/StoreProvider";
import { Providers } from "@/redux/provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Data Flow",
  description: "Mange your data in new way.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} dark`}>
        <NextAuthProvider>
          <Providers>
            <SiteNav />
            {children}
            <Toaster expand={true} richColors />
          </Providers>
        </NextAuthProvider>
      </body>
    </html>
  );
}
