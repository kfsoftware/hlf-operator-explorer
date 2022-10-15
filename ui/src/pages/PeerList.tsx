import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TableInstance,
  TableOptions,
  TableState,
  usePagination,
  UsePaginationInstanceProps,
  UsePaginationOptions,
  useSortBy,
  useTable,
} from "react-table";
import TimeAgo from "timeago-react";
import { parse } from "yaml";
import Badge from "../components/Badge";
import { Table } from "../components/table";
import { Peer, useGetPeersQuery } from "../operations";
interface PeerWithYaml extends Peer {
  yamlData: any;
}
export default function PeerList() {
  const navigate = useNavigate();
  const { data, error, loading } = useGetPeersQuery();

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "yamlData.metadata.name",
        Cell: function Cell({ row: { original } }: any) {
          return (
            <div className="flex items-center">
              {original.yamlData.metadata.name}
            </div>
          );
        },
      },
      {
        Header: "Namespace",
        accessor: "yamlData.metadata.namespace",
        Cell: function Cell({ row: { original } }: any) {
          return (
            <div className="flex items-center">
              {original.yamlData.metadata.namespace}
            </div>
          );
        },
      },
      {
        Header: "MSP ID",
        accessor: "yamlData.spec.mspID",
        Cell: function Cell({ row: { original } }: any) {
          return (
            <div className="flex items-center">
              {original.yamlData.spec.mspID}
            </div>
          );
        },
      },
      {
        Header: "Created",
        id: "createdAt",
        accessor: "yamlData.metadata.creationTimestamp",
        Cell: ({ row: { original } }: any) => {
          return (
            <div className="flex items-center">
              <TimeAgo
                datetime={original.yamlData.metadata.creationTimestamp}
                title={original.yamlData.metadata.creationTimestamp}
                live={true}
              />
            </div>
          );
        },
      },
      {
        Header: "Status",
        accessor: "yamlData.status.status",
        Cell: ({ row: { original } }: any) => {
          return original.yamlData.status.status === "PENDING" ? (
            <Badge badgeType="pending">Pending</Badge>
          ) : original.yamlData.status.status !== "FAILED" ? (
            <Badge badgeType="success">{original.yamlData.status.status}</Badge>
          ) : (
            <Badge badgeType="error">Failed</Badge>
          );
        },
      },
    ],
    // as (Column<PeerWithYaml> & UseSortByColumnOptions<PeerWithYaml>)[],
    []
  );
  const peers = useMemo(() => {
    return (
      data?.peers?.map((ca) => ({
        name: ca.name,
        yamlData: parse(ca.yaml),
        namespace: ca.namespace,
        yaml: ca.yaml,
      })) || []
    );
  }, [data]);

  const table = useTable(
    {
      columns: columns,
      data: peers,
      initialState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [
          {
            id: "createdAt",
            desc: true,
          },
        ],
      } as TableState<PeerWithYaml>,
    } as TableOptions<PeerWithYaml> & UsePaginationOptions<PeerWithYaml>,
    useSortBy,
    usePagination
  ) as TableInstance<PeerWithYaml> & UsePaginationInstanceProps<PeerWithYaml>;
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Peers
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <Link
              to="/peers/create"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Create
            </Link>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <Table
                    table={table}
                    loading={loading}
                    error={error}
                    onRowClick={(peer: PeerWithYaml) => {
                      navigate(`/peers/${peer.namespace}/${peer.name}`);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
