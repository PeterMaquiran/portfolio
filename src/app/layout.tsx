import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Portfolio & CV | Peter Maquiran — Full-Stack Developer",
  description:
    "Full-stack web and mobile developer skilled in  Angular, Vue, Flutter, NestJS, Docker, and OpenTelemetry. Explore my portfolio, CV, and self-hosted DevOps projects.",
  keywords: [
    "Peter Maquiran",
    "Full Stack Developer",
    "Software Engineer",
    "Angular Developer",
    "Vue Developer",
    "NestJS",
    "Node.js",
    "Docker",
    "Nginx",
    "OpenTelemetry",
    "Prometheus",
    "Grafana",
    "Next.js Portfolio",
    "Web Developer",
    "Mobile Developer",
    "Ionic",
    "Flutter"
  ],
  openGraph: {
    title: "Portfolio & CV | Peter Maquiran — Full-Stack Developer",
    description:
      "Discover projects, skills, and DevOps expertise from Peter Maquiran — a full-stack developer passionate about observability and performance.",
    url: "https://petermaquiran.xyz",
    siteName: "Peter Maquiran Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peter Maquiran — Portfolio & CV",
    description:
      "Full-stack web and mobile developer specializing in Angular, Vue, Flutter, Docker, and OpenTelemetry.",
    creator: "@PeterMaquiran",
  },
  metadataBase: new URL("https://petermaquiran.xyz"),
  alternates: {
    canonical: "https://petermaquiran.xyz",
  },
  // icons: {
  //   icon: "/favicon.ico",
  // },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
