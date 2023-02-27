import { CalendarIcon, ScaleIcon } from "@heroicons/react/24/outline";
import React from "react";

import { SkeletonText } from "./skeletons";

const cards = [
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
];

export default function ListSkeleton() {
  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {cards.map((card, idx) => (
            <li key={idx}>
              <a href="" className="block hover:bg-gray-50">
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      <SkeletonText className="h-4 w-32" />
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <SkeletonText className="h-4 w-32 px-2 inline-flex text-xs leading-5 font-semibold rounded-full" />
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">&nbsp;</div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <CalendarIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <p>
                        <SkeletonText className="h-4 w-32" />
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
