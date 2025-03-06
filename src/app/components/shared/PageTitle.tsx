"use client";

import * as Icons from "@primer/octicons-react";

interface PageTitleProps {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageTitle({
  icon,
  title,
  description,
  action,
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
    <div className="flex items-start justify-between mb-8">
      <div className="flex items-start gap-4">
        {IconComponent && (
          <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <IconComponent size={28} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {title}
          </h1>
          {description && (
            <p className="text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
