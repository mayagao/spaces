"use client";

import { FC } from "react";
import { ThreeBarsIcon, MarkGithubIcon } from "@primer/octicons-react";
import { Breadcrumb } from "./Breadcrumb";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export const LeftSection: FC = () => {
  return (
    <div className="flex items-center gap-4">
      <Button variant="outline" className="w-8 h-8">
        <ThreeBarsIcon size={16} />
      </Button>

      <Link href="/" className="text-fg-default">
        <MarkGithubIcon size={32} />
      </Link>

      <Breadcrumb />
    </div>
  );
};
