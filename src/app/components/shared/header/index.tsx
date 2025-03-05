"use client";

import { FC } from "react";
import { LeftSection } from "./LeftSection";
import { RightSection } from "./RightSection";

export const Header: FC = () => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white text-gray-700 border-b border-gray-200">
      <LeftSection />
      <RightSection />
    </header>
  );
};

export default Header;
