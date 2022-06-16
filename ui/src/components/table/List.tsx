import React from "react";
import { Link } from "react-router-dom";

import { CalendarIcon } from "@heroicons/react/solid";
import TimeAgo from "timeago-react";

interface ListProps {
  children: React.ReactNode;
}

const List = ({ children }: ListProps) => {
  return (
    <ul role="list" className="divide-y divide-gray-200">
      {children}
    </ul>
  );
}

interface ListItemProps {
  children?: React.ReactNode;
  linkTo?: string;
  title?: string;
  lastUpdated?: string;
  createdOn?: string;
  Badge?: React.ReactNode;
}

const Item = ({ children, linkTo, title, lastUpdated, createdOn, Badge }: ListItemProps) => {
  const ItemBody = (
    <li  className="py-4 px-4 sm:px-6">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm font-medium text-darker-blue truncate">
            {title}
          </p>
          <div>
            {children}
          </div>
        </div>
        <div className="mt-2 flex flex-col items-end text-sm text-gray-500 sm:mt-0">
          { Badge }
          { lastUpdated && 
          (<div className="flex flex-row">
            <CalendarIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <p>
              Last updated{" "}
              <time
                dateTime={lastUpdated}
                title={lastUpdated}
              >
                <TimeAgo datetime={lastUpdated} />
              </time>
            </p>      
          </div>)}
          { createdOn && 
          (<div className="flex flex-row">
            <CalendarIcon
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            <p>
              Created on{" "}
              <time
                dateTime={createdOn}
                title={createdOn}
              >
                <TimeAgo datetime={createdOn} />
              </time>
            </p>      
          </div>)}
        </div>
      </div>
    </li>
  );

  if(linkTo){
    return (
      <Link
        to={linkTo}
        className="block hover:bg-gray-50"
      >
        { ItemBody }
      </Link>
    )
  } else {
    return ItemBody
  }
}

List.Item = Item

export default List
