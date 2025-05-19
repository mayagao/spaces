"use client";

import { FC } from "react";
import { RightSection } from "./RightSection";
import ReusableBreadcrumb from "./ReusableBreadcrumb";
import { Button } from "@/components/ui/button";
import { ThreeBarsIcon, MarkGithubIcon } from "@primer/octicons-react";
import Link from "next/link";

export const Header: FC = () => {
  return (
    <header className="flex items-center justify-between px-4 bg-gray-50 py-3 text-gray-700 border-b border-gray-200">
      <div className="flex items-center overflow-hidden">
        <div className="flex items-center gap-3 flex-shrink-0 mr-4">
          <Button variant="outline" className="w-8 h-8">
            <ThreeBarsIcon size={16} />
          </Button>
          <Link href="/" className="text-fg-default">
            <MarkGithubIcon size={24} />
          </Link>
        </div>
        <div className="overflow-hidden">
          <ReusableBreadcrumb
            displayMode="responsive"
            excludeConversationTitle={true}
          />
        </div>
      </div>
      <RightSection />
    </header>
  );
};

export default Header;
