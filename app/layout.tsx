import React from 'react';
import { Metadata } from 'next';
import { DM_Sans } from "next/font/google";
import "./globals.css";

// Define the font
const inter = DM_Sans({
  subsets: ["latin"],
  display: 'swap',
});

// Define metadata
export const metadata: Metadata = {
  title: "MongoDB Collections Visualizer",
  description: "Visualize MongoDB collections and their relationships.",
  keywords: "MongoDB, database, collections, visualization, relationships, mongoose, schema, openai",
  authors: [{ name: "Kimani Kiragu" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <main className="min-h-screen bg-green-50">
          {children}
        </main>
      </body>
    </html>
  );
}