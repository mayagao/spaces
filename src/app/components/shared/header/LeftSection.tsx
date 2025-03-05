import { FC } from "react";
import { ThreeBarsIcon, MarkGithubIcon } from "@primer/octicons-react";
import { Breadcrumb } from "./Breadcrumb";

export const LeftSection: FC = () => {
  return (
    <div className="flex items-center gap-4">
      <button className="p-1 hover:bg-action-hover rounded-md">
        <ThreeBarsIcon size={24} />
      </button>

      <a href="/" className="text-fg-default">
        <MarkGithubIcon size={32} />
      </a>

      <Breadcrumb />
    </div>
  );
};
