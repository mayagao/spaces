import { FC } from "react";
import {
  SearchIcon,
  PlusIcon,
  InboxIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
} from "@primer/octicons-react";

export const RightSection: FC = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search or jump to..."
          className="pl-8 pr-3 py-1 bg-white border border-gray-300 rounded-md w-64 text-gray-900 placeholder:text-gray-500 hover:border-gray-400 focus:border-blue-500 focus:outline-none"
        />
        <SearchIcon size={16} className="absolute left-2 top-2 text-gray-500" />
      </div>

      <button className="p-1 hover:bg-action-hover rounded-md">
        <PlusIcon size={16} />
      </button>

      <button className="p-1 hover:bg-action-hover rounded-md">
        <InboxIcon size={16} />
      </button>

      <button className="p-1 hover:bg-action-hover rounded-md">
        <IssueOpenedIcon size={16} />
      </button>

      <button className="p-1 hover:bg-action-hover rounded-md">
        <GitPullRequestIcon size={16} />
      </button>

      <button className="ml-2">
        <img
          src="/avatar-placeholder.png"
          alt="User avatar"
          className="w-8 h-8 rounded-full"
        />
      </button>
    </div>
  );
};
