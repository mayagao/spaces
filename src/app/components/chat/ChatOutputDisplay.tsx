import { FC } from "react";
import { CopilotIcon } from "@primer/octicons-react";

interface ChatOutputDisplayProps {
  content: string;
}

export const ChatOutputDisplay: FC<ChatOutputDisplayProps> = ({ content }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-5 h-5 rounded-full flex text-gray-500 items-center justify-center flex-shrink-0">
        <CopilotIcon size={20} />
      </div>
      <div className="flex-1">
        <div className="text-gray-800 dark:text-gray-200  leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};
