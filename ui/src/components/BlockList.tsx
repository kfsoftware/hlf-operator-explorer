import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Column,
  TableInstance,
  TableOptions,
  TableState,
  usePagination,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  UsePaginationState,
  useSortBy,
  UseSortByColumnOptions,
  UseSortByState,
  useTable,
} from "react-table";

import TimeAgo from "timeago-react";
import { Block, TransactionType, useGetBlocksQuery } from "../operations";
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

  useEffect(() => {
    setBlocks((data?.blocks.blocks as Block[]) || []);
    setPageCount(Math.floor(data?.blocks?.height! / pageSize) + 1);
  }, [data]);
  const navigate = useNavigate();
  return (
    <>
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
