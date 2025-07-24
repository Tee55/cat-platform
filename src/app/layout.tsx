// app/layout.tsx
import "@/styles/globals.css";
import "@radix-ui/themes/styles.css";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>{children}</body>
    </html>
  );
}
