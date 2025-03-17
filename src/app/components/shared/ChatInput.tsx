"use client";

import { PaperAirplaneIcon, PaperclipIcon } from "@primer/octicons-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  placeholder?: string;
  showAttachment?: boolean;
  onSubmit: (value: string) => void;
  onAttachmentClick?: () => void;
  initialValue?: string;
}

export function ChatInput({
  placeholder = "Ask anything...",
  showAttachment = true,
  onSubmit,
  onAttachmentClick,
  initialValue = "",
}: ChatInputProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Update value when initialValue changes
  useEffect(() => {
    setValue(initialValue);
    if (initialValue && inputRef.current) {
      inputRef.current.focus();
    }
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <div className="flex items-center gap-2 pl-3 pr-2 py-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus-winthin:border-none focus-within:ring-2 bg-white focus-within:ring-blue-500">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent focus:outline-none"
      />
      <div className="flex items-center">
        {showAttachment && (
          <Button variant="ghost" size="icon" onClick={onAttachmentClick}>
            <PaperclipIcon size={16} />
          </Button>
        )}
        <Button variant="ghost" size="icon" onClick={handleSubmit}>
          <PaperAirplaneIcon size={16} />
        </Button>
      </div>
    </div>
  );
}
