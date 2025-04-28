import { ThemeProvider } from "@/components/theme-provider";
import Provider from "@/provider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { Geist as Geist_Sans } from "next/font/google";
import "./globals.css";

const geist = Geist_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
});

export const metadata = {
  title: "EmailChef",
  description: "Email workflows powered by convex and AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geist.className} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <Provider>{children}</Provider>
          </ThemeProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
