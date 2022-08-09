import { FolderAddIcon, PlusIcon } from '@heroicons/react/outline';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface ChecksEmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onClick?: () => void;
  icon?: React.FC<any>;
  className?: string;
}
export default function EmptyState({
  onClick,
  actionText,
  title,
  className = "",
  description,
  icon: Icon = FolderAddIcon,
}: ChecksEmptyStateProps) {
  return (
    <div className={`h-full text-center ${className}`}>
      <Icon
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        stroke="currentColor"
        aria-hidden="true"
      />
      {/* <h3 className="mt-2 text-sm font-medium text-gray-900">No checks setup</h3> */}
      {/* <p className="mt-1 text-sm text-gray-500">Get started by creating a new check.</p> */}
      <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {onClick && actionText ? (
        <div className="mt-6">
          <button
            onClick={() => onClick()}
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            {actionText}
          </button>
        </div>
      ) : null}
    </div>
  );
}
