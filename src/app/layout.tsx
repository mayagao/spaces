"use client";

import "./globals.css";
import { Sidebar } from "./components/shared/Sidebar";
import { Inter } from "next/font/google";
import { Header } from "./components/shared/header";
import { SidebarProvider } from "./contexts/SidebarContext";
import { useSidebar } from "./contexts/SidebarContext";
import { cn } from "../lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, toggleSidebar, isFloatingSidebar } = useSidebar();

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        <div
          className={cn(
            "flex flex-col flex-1",
            // When sidebar is floating, don't reserve space for it
            !isFloatingSidebar && !sidebarCollapsed && ""
          )}
        >
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${inter.variable}`}>
      <body className="antialiased">
        <SidebarProvider>
          <MainLayout>{children}</MainLayout>
        </SidebarProvider>
      </body>
    </html>
  );
}
