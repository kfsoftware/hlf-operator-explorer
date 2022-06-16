import React from "react";

interface PaginationProps {
  text: React.ReactNode;
  onNext?: (() => void) | null;
  onPrevious: (() => void) | null;
}
export default function Pagination({
  onNext,
  onPrevious,
  text,
}: PaginationProps) {
  return (
    <nav
      className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
      aria-label="Pagination"
    >
      <div className="hidden sm:block">{text}</div>
      <div className="flex-1 flex justify-between sm:justify-end">
        <button
          onClick={() => onPrevious && onPrevious()}
          disabled={!onPrevious}
          className={` ${
            !onPrevious ? "opacity-50 cursor-not-allowed" : ""
          } relative `}
        >
          Previous
        </button>
        <button
          onClick={() => onNext && onNext()}
          disabled={!onNext}
          className={`${
            !onNext ? "opacity-50 cursor-not-allowed" : ""
          } ml-3 relative`}
        >
          Next
        </button>
      </div>
    </nav>
  );
}
