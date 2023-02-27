import React from "react";

interface SubmitButtonProps {
  children: any;
  loading: boolean;
  disabled: boolean;
  className: string;
  onClick?: () => any;
}
export default function SubmitButton({
  onClick,
  children,
  loading,
  disabled,
  className = "",
}: SubmitButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      onClick={onClick}
      type="submit"
      className={`
      ${className}
      ml-4 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
    >
      {loading ? (
        <svg
          className="text-center animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
}
