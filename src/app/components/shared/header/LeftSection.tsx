"use client";

import { FC } from "react";
import { ThreeBarsIcon, MarkGithubIcon } from "@primer/octicons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const LeftSection: FC = () => {
  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <Button variant="outline" className="w-8 h-8">
        <ThreeBarsIcon size={16} />
      </Button>

      <Link href="/" className="text-fg-default flex items-center gap-2">
        <MarkGithubIcon size={24} />
        <span className="text-sm font-medium">Copilot</span>
      </Link>
    </div>
  );
};
