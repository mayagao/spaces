import { FC } from "react";
import { MarkGithubIcon } from "@primer/octicons-react";

interface ChatOutputDisplayProps {
  content: string;
}

export const ChatOutputDisplay: FC<ChatOutputDisplayProps> = ({ content }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full bg-black dark:bg-white flex items-center justify-center flex-shrink-0">
        <MarkGithubIcon size={12} className="text-white dark:text-black" />
      </div>
      <div className="flex-1">
        <div className="text-gray-800 dark:text-gray-200  leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};
