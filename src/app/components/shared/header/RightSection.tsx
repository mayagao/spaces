import { FC, useState, useRef, useEffect } from "react";
import {
  SearchIcon,
  PlusIcon,
  InboxIcon,
  IssueOpenedIcon,
  GitPullRequestIcon,
  XIcon,
} from "@primer/octicons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";

export const RightSection: FC = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  // Handle clicks outside of the search input to collapse it on mobile
  useEffect(() => {
    if (!isSearchExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        isMobile
      ) {
        setIsSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchExpanded, isMobile]);

  // Focus the input when expanded
  useEffect(() => {
    if (isSearchExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchExpanded]);

  return (
    <div className="flex items-center gap-2">
      {/* Desktop search input or mobile expanded search */}
      {!isMobile || isSearchExpanded ? (
        <div className="relative transition-all duration-200 ease-in-out">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search or jump to..."
            className="pl-8 transition-all duration-200 ease-in-out"
          />
          <SearchIcon
            size={16}
            className="absolute left-2 top-2.5 text-gray-500"
          />
          {isSearchExpanded && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-6 w-6"
              onClick={toggleSearch}
            >
              <XIcon size={12} />
            </Button>
          )}
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="w-8 h-8 transition-all duration-200 ease-in-out"
          onClick={toggleSearch}
        >
          <SearchIcon size={16} />
        </Button>
      )}

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
