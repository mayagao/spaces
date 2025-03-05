import { FC } from "react";
import { LeftSection } from "./LeftSection";
import { RightSection } from "./RightSection";

interface HeaderProps {
  currentPage: string;
}

export const Header: FC<HeaderProps> = ({ currentPage }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white text-gray-700 border-b border-gray-200">
      <LeftSection currentPage={currentPage} />
      <RightSection />
    </header>
  );
};

export default Header;
