"use client";

import "./globals.css";
import { Sidebar } from "./components/shared/Sidebar";
import { GeistSans } from "geist/font/sans";
import { Header } from "./components/shared/header";
import { SecondaryHeader } from "./components/shared/SecondaryHeader";
import { SidebarProvider } from "./contexts/SidebarContext";
import { useSidebar } from "./contexts/SidebarContext";

function MainLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed, toggleSidebar } = useSidebar();

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleSidebar}
        />
        <div className="flex flex-col flex-1">
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
    <html lang="en" className={GeistSans.className}>
      <body className="antialiased">
        <SidebarProvider>
          <MainLayout>{children}</MainLayout>
        </SidebarProvider>
      </body>
    </html>
  );
}
