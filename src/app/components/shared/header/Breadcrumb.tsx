import { FC } from "react";
import { ChevronRightIcon } from "@primer/octicons-react";

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
      {href ? <a href={href}>{content}</a> : content}
      {!isLast && <ChevronRightIcon size={16} className="mx-2 text-fg-muted" />}
    </>
  );
};

export const Breadcrumb: FC = () => {
  // This could be made dynamic based on the current route
  return (
    <div className="flex items-center">
      <BreadcrumbItem text="Copilot" href="/copilot" />
      <BreadcrumbItem text="Spaces" isLast />
    </div>
  );
};
