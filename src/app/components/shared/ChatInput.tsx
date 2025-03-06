"use client";

import { PaperAirplaneIcon } from "@primer/octicons-react";
import { useState } from "react";

interface ChatInputProps {
  placeholder?: string;
  onSubmit: (value: string) => void;
}

export function ChatInput({
  placeholder = "Ask anything...",
  onSubmit,
}: ChatInputProps) {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value);
      setValue("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 p-4 border-t border-gray-200 dark:border-gray-800"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
      <button
        type="submit"
        disabled={!value.trim()}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <PaperAirplaneIcon size={16} />
      </button>
    </form>
  );
}
