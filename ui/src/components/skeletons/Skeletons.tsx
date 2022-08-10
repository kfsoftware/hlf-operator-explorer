import React, { Fragment, useState } from 'react';

interface SkeletonTextProps {
  className?: string;
}
export function SkeletonText({ className = "" }: SkeletonTextProps) {
  return (
    <>
      <div className={`animate-pulse rounded bg-gray-400 ${className}`}></div>
    </>
  );
}

export function SkeletonAvatar({ className }: any) {
  return (
    <>
      <div
        className={`animate-pulse rounded-full bg-gray-400 ${className}`}
      ></div>
    </>
  );
}
