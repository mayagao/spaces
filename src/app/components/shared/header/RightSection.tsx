import { FC } from "react";
import {
  SearchIcon,
  PlusIcon,
  InboxIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
} from "@primer/octicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export const RightSection: FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search or jump to..."
          className="pl-8"
        />
        <SearchIcon
          size={16}
          className="absolute left-2 top-2.5 text-gray-500"
        />
      </div>

      <Button variant="outline" className="hidden md:flex w-8 h-8">
        <PlusIcon size={16} />
      </Button>

      <Button variant="outline" className="hidden md:flex w-8 h-8">
        <InboxIcon size={16} />
      </Button>

      <Button variant="outline" className="hidden md:flex w-8 h-8">
        <IssueOpenedIcon size={16} />
      </Button>

      <Button variant="outline" className="hidden md:flex w-8 h-8">
        <GitPullRequestIcon size={16} />
      </Button>

      <button className="ml-2 relative w-8 h-8">
        <Image
          src="/maya.jpeg"
          alt="User maya is a genius"
          className="rounded-full border border-gray-200"
          fill
          sizes="32px"
        />
      </button>
    </div>
  );
};
