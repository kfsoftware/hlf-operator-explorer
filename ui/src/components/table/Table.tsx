import React from "react";
import {
  Cell,
  HeaderGroup,
  Row,
  TableInstance,
  UsePaginationInstanceProps,
  UsePaginationState,
  UseSortByColumnProps,
} from "react-table";

function range(start: number, end: number) {
  return Array(end - start + 1)
    .fill("")
    .map((_, idx) => start + idx);
}

interface ITableProp {
  table: TableInstance<any> & UsePaginationInstanceProps<any>;
  loading: boolean;
  error: any;
  onRowClick?: (record: any) => void;
}
const Table: React.FunctionComponent<ITableProp> = ({
  onRowClick,
  table,
  loading,
  error,
}) => {
  const {
    rows,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    setPageSize,
    previousPage,
    nextPage,
    canNextPage,
    canPreviousPage,
    state,
    pageCount,
  } = table;
  const { pageIndex, pageSize } = state as UsePaginationState<any>;
  const sizes: number[] = (state as any).pageOptions || [10, 20, 50, 100];
  const numOfColumns = headerGroups.flatMap((i: HeaderGroup) =>
    i.headers.map(() => 1)
  ).length;
  return (
    <>
      <table className={` min-w-full divide-y divide-gray-200`}>
        <thead className="bg-gray-50">
          {headerGroups.map((headerGroup: HeaderGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {(headerGroup.headers as any[]).map(
                (column: HeaderGroup<any> & UseSortByColumnProps<any>) => (
                  <th
                    {...column.getHeaderProps(
                      column.getSortByToggleProps
                        ? column.getSortByToggleProps()
                        : undefined
                    )}
                    scope="col"
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider 
                        ${
                          column.canSort
                            ? "cursor-pointer hover:bg-gray-200"
                            : ""
                        }
                        `}
                  >
                    <div className="flex ">
                      {column.render("Header")}
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <svg
                            className="ml-1 w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="ml-1 w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )
                      ) : null}
                    </div>
                  </th>
                )
              )}
            </tr>
          ))}
        </thead>
        <tbody
          {...getTableBodyProps()}
          className={`${
            loading ? "opacity-60" : ""
          } bg-white divide-y divide-gray-200`}
        >
          {loading && !rows.length ? (
            Array.apply(null, { length: 4 } as any).map((_, idx) => (
              <tr key={idx}>
                {range(0, numOfColumns - 1).map((i) => (
                  <td key={i} className="px-6 py-4 whitespace-nowrap">
                    <div className="animate-pulse flex space-x-4">
                      <div className="h-4 bg-gray-400 rounded w-3/4"></div>
                    </div>
                  </td>
                ))}
              </tr>
            ))
          ) : error ? (
            <tr>{JSON.stringify(error)}</tr>
          ) : (
            rows.map((row: Row) => {
              prepareRow(row);
              return onRowClick ? (
                <tr
                  key={row.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => onRowClick(row.original)}
                >
                  {row.cells.map((cell: Cell) => {
                    return (
                      <td
                        className={`px-6 py-4 whitespace-nowrap`}
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              ) : (
                <tr key={row.id}>
                  {row.cells.map((cell: Cell) => {
                    return (
                      <td
                        className="px-6 py-4 whitespace-nowrap"
                        {...cell.getCellProps()}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {canNextPage || canPreviousPage ? (
        <div className="">
          <nav
            className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
            aria-label="Pagination"
          >
            <div className="hidden sm:flex ">
              <p className="text-sm text-gray-700 my-auto">Rows per page</p>
              <div className="ml-2">
                <select
                  id="location"
                  name="location"
                  value={pageSize}
                  onChange={(e) => setPageSize(parseInt(e.target.value))}
                  className="block w-full pl-3 pr-10 leading-3  border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
                >
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <p className="ml-1 text-sm text-gray-700 my-auto">
                {`Page ${pageIndex + 1} ${
                  pageCount === -1 ? "" : `of ${pageCount}`
                }`}
              </p>
            </div>
            <div className="flex-1 flex justify-between sm:justify-end">
              {canPreviousPage ? (
                <button
                  onClick={previousPage}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
              ) : null}
              {canNextPage ? (
                <button
                  onClick={nextPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              ) : null}
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
};
export default Table;
