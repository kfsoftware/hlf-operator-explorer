import React from "react";
interface BadgeProps {
  children: any;
  badgeType: string;
  className?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
}
export default function Badge({
  onClick,
  children,
  badgeType,
  className = "",
}: BadgeProps) {
  let bgColor;
  let textColor;
  switch (badgeType) {
    case "active":
    case "success":
      bgColor = "bg-teal-700";
      textColor = "text-white";
      break;

    case "inactive":
    case "error":
      bgColor = "bg-red-700";
      textColor = "text-white";
      break;

    case "pending":
    case "warning":
      bgColor = "bg-yellow-700";
      textColor = "text-grey-700";
      break;

    default:
      bgColor = "bg-grey-700";
      textColor = "text-white";
      break;
  }

  return (
    <span
      onClick={onClick}
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-md ${bgColor} ${textColor} ${className}`}
    >
      {children}
    </span>
  );
}
