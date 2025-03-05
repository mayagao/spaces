import "./globals.css";
import { Sidebar } from "./components/shared/Sidebar";
import { GeistSans } from "geist/font/sans";
import { Header } from "./components/shared/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="antialiased">
        <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
          <Header currentPage="/" />
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
