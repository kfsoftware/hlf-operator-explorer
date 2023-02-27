import React, { ReactNode } from "react";
interface IButtonProps {
  text?: string;
  type?: "submit" | "reset" | "button" | undefined;
  buttonType?: string;
  className?: string;
  onClick?: Function;
  style?: Object;
  children?: ReactNode;
  disabled?: boolean;
}

export default function Button({
  text,
  type,
  buttonType,
  className,
  onClick,
  style,
  children,
  disabled,
}: IButtonProps) {
  let buttonClass = "btn-base";

  switch (buttonType) {
    case "action":
      buttonClass = `${buttonClass} bg-teal text-white`;
      break;

    case "cancel":
      buttonClass = `${buttonClass} bg-white text-grey-700`;
      break;

    default:
      buttonClass = `${buttonClass} border-gray-100 bg-white hover:bg-gray-50 text-grey-700`;
      break;
  }

  buttonClass = `${buttonClass} ${className}`;

  return (
    <button
      type={type || "button"}
      style={style}
      disabled={disabled || false}
      onClick={(params) => onClick && onClick(params)}
      className={buttonClass}
    >
      {text || children}
    </button>
  );
}
