"use client";

import Link from "next/link";
import * as Icons from "@primer/octicons-react";

interface CardProps {
  href: string;
  icon: string;
  iconColor: string;
  title: string;
  description?: string;
}

export function Card({ href, icon, iconColor, title, description }: CardProps) {
  // Convert icon name to PascalCase and append 'Icon'
  const iconName =
    icon
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("") + "Icon";

  // Get the icon component
  const IconComponent = Icons[iconName as keyof typeof Icons];

  return (
    <Link
      href={href}
      className="group block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          {IconComponent && <IconComponent size={24} className="text-white" />}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {title}
        </h3>
      </div>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </Link>
  );
}
