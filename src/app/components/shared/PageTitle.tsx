"use client";

import * as Icons from "@primer/octicons-react";

interface PageTitleProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  backgroundColor?: string;
}

export function PageTitle({
  icon,
  title,
  description,
  action,
  backgroundColor,
}: PageTitleProps) {
  // Convert icon name to PascalCase and append 'Icon'
  const iconName =
    icon
      ?.split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") + "Icon";

  // Get the icon component
  const IconComponent = iconName ? Icons[iconName as keyof typeof Icons] : null;

  return (
    <div className="flex items-end w-[100%] mb-5">
      <div className={`flex-1 ${action ? "" : "text-center"}`}>
        {IconComponent && (
          <div
            className={`${
              action ? "" : "mx-auto"
            } w-10 h-10 rounded-full flex items-center justify-center mb-4`}
            style={{ backgroundColor: backgroundColor || "rgb(243 244 246)" }}
          >
            <IconComponent
              size={16}
              className={backgroundColor ? "text-white" : ""}
            />
          </div>
        )}
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
          {title}
        </h1>
        {description && (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {description}
          </p>
        )}
      </div>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
