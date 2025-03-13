import { FC } from "react";

interface ChatInputDisplayProps {
  content: string;
}

export const ChatInputDisplay: FC<ChatInputDisplayProps> = ({ content }) => {
  return (
    <div className="flex justify-end">
      <div className="max-w-[85%] bg-gray-50 dark:bg-gray-800/20 rounded-lg p-4">
        <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
};
