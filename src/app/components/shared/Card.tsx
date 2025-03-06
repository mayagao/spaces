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
      className="group block p-6 bg-gray-50 dark:bg-gray-800 rounded-lg dark:border-gray-700 hover:bg-gray-100 dark:hover:shadow-gray-700 transition-colors"
    >
      <div className="">
        <div
          className="w-8 h-8 mb-2 border border-opacity-20 border-gray-100 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconColor }}
        >
          {IconComponent && <IconComponent size={16} className="text-white" />}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {title}
        </h3>
      </div>
      {description && (
        <p className="text-sm line-clamp-2 text-gray-500 dark:text-gray-400">
          {description}
        </p>
      )}
    </Link>
  );
}
