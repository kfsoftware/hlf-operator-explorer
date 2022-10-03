import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  SearchIcon
} from "@heroicons/react/solid";
import {
  Column,
  TableInstance,
  TableOptions,
  TableState,
  usePagination,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  UseSortByColumnOptions,
  useTable
} from "react-table";
import TimeAgo from "timeago-react";
import {
  Block,
  TransactionType,
  useGetBlockByTxidLazyQuery,
  useGetBlockLazyQuery, useGetBlocksQuery
} from "../operations";
import { Table } from "./table";

interface BlockListProps {
  channel: string;
}
const colorSwitch: { [key: string]: string } = {
  [TransactionType.ChaincodePackage]: "bg-gray-100 text-gray-800",
  [TransactionType.Config]: "bg-red-100 text-red-800",
  [TransactionType.ConfigUpdate]: "bg-yellow-100 text-yellow-800",
  [TransactionType.DeliverSeekInfo]: "bg-green-100 text-green-800",
  [TransactionType.EndorserTransaction]: "bg-blue-100 text-blue-800",
  [TransactionType.Message]: "bg-indigo-100 text-indigo-800",
  [TransactionType.OrdererTransaction]: "bg-purple-100 text-purple-800",
};
export default function BlockList({ channel }: BlockListProps) {
  const [pageSize, setPageSize] = useState(10);
  const [pageCount, setPageCount] = useState(5);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const columns = useMemo(
    () =>
      [
        {
          Header: "Block #",
          accessor: "blockNumber",
          Cell: function Cell({ row: { original } }) {
            return (
              <div className="flex items-center">{original.blockNumber}</div>
            );
          },
        },
        {
          Header: "TX Count",
          accessor: "numTransactions",
          Cell: function Cell({ row: { original } }) {
            return (
              <div className="flex items-center">
                {original.numTransactions}
              </div>
            );
          },
        },
        {
          Header: "Transactions",
          accessor: "transactions",
          Cell: function Cell({ row: { original } }) {
            return (
              <div className="flex items-center">
                <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:space-x-4">
                  {original.transactions?.map((tx) => (
                    <span
                      key={tx.txID}
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                        colorSwitch[tx.type]
                      }`}
                    >
                      {tx.type}
                    </span>
                  ))}
                </div>
              </div>
            );
          },
        },
        {
          Header: "Created",
          accessor: "createdAt",
          Cell: function Cell({ row: { original } }) {
            return (
              <div className="flex items-center">
                <TimeAgo
                  title={original.createdAt}
                  datetime={original.createdAt}
                />
              </div>
            );
          },
        },
      ] as (Column<Block> & UseSortByColumnOptions<Block>)[],
    []
  );
  const table = useTable(
    {
      data: blocks,
      columns: columns,
      manualPagination: true,
      pageCount: pageCount,
      initialState: {
        pageIndex: 0,
        pageSize: pageSize,
        pageOptions: [5, 10],
      } as TableState<Block> & UsePaginationState<Block>,
    } as TableOptions<Block> & UsePaginationOptions<Block>,
    usePagination
  ) as TableInstance<Block> & UsePaginationInstanceProps<Block>;
  const state = table.state as UsePaginationState<Block> & TableState<Block>;
  const { data, loading, error } = useGetBlocksQuery({
    variables: {
      channelID: channel,
      from: state.pageIndex * state.pageSize,
      to: state.pageIndex * state.pageSize + state.pageSize,
      reverse: true,
    },
    skip: !channel,
  });
  const [search, setSearch] = useState("");
  const [getBlock] = useGetBlockLazyQuery();
  const [getBlockByTXID] = useGetBlockByTxidLazyQuery();
  const fetchAndNavigateToBlock = useCallback(async () => {
    if (search.length === 64) {
      const { data } = await getBlockByTXID({
        variables: {
          channelID: channel,
          txID: search,
        },
      });
      if (data?.block.blockNumber) {
        await navigate(`/channels/${channel}/blocks/${data.block.blockNumber}`);
      }
    } else {
      const blockNumber = parseInt(search);
      if (!isNaN(blockNumber)) {
        const { data } = await getBlock({
          variables: {
            blockNumber,
            channelID: channel,
          },
        });
        if (data?.block.blockNumber) {
          await navigate(
            `/channels/${channel}/blocks/${data.block.blockNumber}`
          );
        }
      }
    }
  }, [search]);
  useEffect(() => {
    setBlocks((data?.blocks.blocks as Block[]) || []);
    setPageCount(Math.floor(data?.blocks?.height! / pageSize) + 1);
  }, [data]);
  const navigate = useNavigate();
  return (
    <>
      <div className="pb-5 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Blocks</h3>
        <div className="mt-3 sm:mt-0 sm:ml-4 max-w-2xl w-full">
          <label htmlFor="mobile-search-candidate" className="sr-only">
            Search
          </label>
          <label htmlFor="desktop-search-candidate" className="sr-only">
            Search
          </label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchAndNavigateToBlock();
            }}
          >
            <div className="flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  name="mobile-search-block"
                  id="mobile-search-block"
                  onKeyPress={(key) => {
                    if (key.key === "Enter") {
                      fetchAndNavigateToBlock();
                    }
                  }}
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-r-md rounded-l-md pl-10 sm:hidden border-gray-300"
                  placeholder="Search"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(key) => {
                    if (key.key === "Enter") {
                      fetchAndNavigateToBlock();
                    }
                  }}
                  name="desktop-search-block"
                  id="desktop-search-block"
                  className="hidden focus:ring-indigo-500 focus:border-indigo-500 w-full rounded-r-md rounded-l-md pl-10 sm:block sm:text-sm border-gray-300"
                  placeholder="Search by tx or block number"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      <Table
        error={error}
        loading={loading}
        table={table}
        onRowClick={(block: Block) => {
          navigate(`/channels/${channel}/blocks/${block.blockNumber}`);
        }}
      />
    </>
  );
}
