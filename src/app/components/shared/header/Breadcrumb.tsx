"use client";

import { FC } from "react";
import { ChevronRightIcon } from "@primer/octicons-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface BreadcrumbItemProps {
  text: string;
  href?: string;
  isLast?: boolean;
}

const BreadcrumbItem: FC<BreadcrumbItemProps> = ({ text, href, isLast }) => {
  const content = (
    <span
      className={`${
        isLast ? "text-fg-default" : "text-fg-muted hover:text-fg-default"
      }`}
    >
      {text}
    </span>
  );

  return (
    <>
      {href ? <Link href={href}>{content}</Link> : content}
      {!isLast && <ChevronRightIcon size={16} className="mx-2 text-fg-muted" />}
    </>
  );
};

export const Breadcrumb: FC = () => {
  const pathname = usePathname();

  // Define breadcrumb items based on the current path
  let items = [{ text: "Copilot", href: "/" }];

  if (pathname === "/spaces") {
    items.push({ text: "Spaces", href: "/spaces" });
  } else if (pathname === "/pipes") {
    items.push({ text: "Pipies", href: "/pipes" });
  }

  return (
    <div className="flex items-center">
      {items.map((item, index) => (
        <BreadcrumbItem
          key={item.href}
          text={item.text}
          href={index === items.length - 1 ? undefined : item.href}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
};
