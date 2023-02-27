import { ScaleIcon } from "@heroicons/react/24/outline";
import React from "react";

import { SkeletonAvatar, SkeletonText } from "./Skeletons";

const cards = [
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  // More items...
];

export default function PageSkeleton() {
  return (
    <>
      <div className="py-6">
        <div>
          <h1>
            <SkeletonText className="h-6 w-64 text-2xl font-semibold text-gray-900" />
          </h1>
        </div>
        {/* Replace with your content */}
        <div>
          <div className="mt-8">
            <div className="mx-auto ">
              <SkeletonText className="h-6 w-48" />
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card */}
                {cards.map((card, idx) => (
                  <div
                    key={idx}
                    className="bg-white overflow-hidden shadow rounded-lg"
                  >
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <SkeletonAvatar className="h-6 w-6" />
                          {/* <card.icon className="h-6 w-6 text-gray-400" aria-hidden="true" /> */}
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">
                              <SkeletonText className="h-4 w-32" />
                              {/* {card.name} */}
                            </dt>
                            <dd>
                              <div className="text-lg font-medium text-gray-900">
                                <SkeletonText className="mt-2 h-5 w-24" />
                              </div>
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-5 py-3">
                      <div className="text-sm">
                        <SkeletonText className="h-4 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* /End replace */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8"></div>
        </div>
      </div>
    </>
  );
}
