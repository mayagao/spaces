"use client";

import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

interface SidebarContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  isFloatingSidebar: boolean;
}

export const SidebarContext = createContext<SidebarContextType>({
  sidebarCollapsed: false,
  toggleSidebar: () => {},
  isFloatingSidebar: false,
});

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFloatingSidebar, setIsFloatingSidebar] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Add effect to handle window resize
  useEffect(() => {
    // Function to check window width and set sidebar state
    const handleResize = () => {
      // Consider medium screens to be less than 1024px (typical md breakpoint)
      const isMediumScreen = window.innerWidth < 1024;
      setSidebarCollapsed(isMediumScreen);
      setIsFloatingSidebar(isMediumScreen);
    };

    // Set initial state based on window size
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{ sidebarCollapsed, toggleSidebar, isFloatingSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => useContext(SidebarContext);
