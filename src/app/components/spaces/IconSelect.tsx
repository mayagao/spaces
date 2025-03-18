"use client";

import { useState } from "react";
import { SPACE_ICONS, getIconComponent, type SpaceIcon } from "../../lib/icons";

interface IconSelectProps {
  value: SpaceIcon;
  onChange: (icon: SpaceIcon) => void;
  color: string;
}

export function IconSelect({ value, onChange, color }: IconSelectProps) {
  const IconComponent = getIconComponent(value);

  return (
    <div className="relative">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{ backgroundColor: color }}
      >
        {IconComponent && <IconComponent size={20} className="text-white" />}
      </div>
    </div>
  );
}
