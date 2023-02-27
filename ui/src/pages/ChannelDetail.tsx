import { Link, Route, Routes, useLocation, useParams } from "react-router-dom";
import {
  Column,
  TableInstance,
  usePagination,
  UsePaginationInstanceProps,
  UseSortByColumnOptions,
  useTable,
} from "react-table";
import {
  BlockWithPrivateData,
  Channel,
  ChannelOrg,
  LightChannel,
  TransactionWithPrivateData,
  useChannelQuery,
  useGetBlockWithPrivateDataQuery,
} from "../operations";

export default function ChannelDetail() {
  const { name, org } = useParams();
  const { data, error, loading } = useChannelQuery({
    variables: {
      channelID: name!,
    },
  });
  const location = useLocation();
  const isBlockActive = useMemo(
    () => location.pathname === `/channels/${name!}/blocks`,
    [location]
  );
  const isConfigActive = useMemo(
    () => location.pathname === `/channels/${name!}`,
    [location]
  );
  const [showRawConfiguration, setShowRawConfiguration] = useState(false);
  return (
    <>
      {showRawConfiguration ? (
        <JSONModal
          open={showRawConfiguration}
          setOpen={setShowRawConfiguration}
          data={data?.channel.rawConfig}
        />
      ) : null}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Channel {name!}
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setShowRawConfiguration(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View full resource
              </button>
              <Link
                to={`/channels/${name!}`}
                className={
                  isConfigActive
                    ? `ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
                    : `ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
                }
              >
                Config
              </Link>
              <Link
                to={`/channels/${name!}/blocks`}
                className={
                  isBlockActive
                    ? `ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
                    : `ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
                }
              >
                Blocks
              </Link>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mt-8">
          {loading ? (
            <>
              <PageSkeleton />
            </>
          ) : data?.channel ? (
            <>
              <Routes>
                <Route
                  path="ordererorg/:org"
                  element={<OrdererOrgDetail channel={data.channel as any} />}
                />
                <Route
                  path="peerorg/:org"
                  element={<PeerOrgDetail channel={data.channel as any} />}
                />
                <Route path="blocks" element={<BlockList channel={name!} />} />
                <Route
                  path="blocks/:blockNumber"
                  element={<BlockDetailPage />}
                />
                <Route
                  index
                  element={
                    <ChannelDetailComponent channel={data.channel as any} />
                  }
                />
              </Routes>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
function BlockDetailPage() {
  const { name, blockNumber } = useParams();
  const { data, loading, error } = useGetBlockWithPrivateDataQuery({
    variables: {
      blockNumber: parseInt(blockNumber!),
      channelID: name!,
    },
    skip: !name || !blockNumber,
  });
  return (
    <>
      {data?.block ? (
        <>
          <BlockDetailCard block={data.block!} />{" "}
          <div className="mt-8">
            <SectionHeading title="Transactions" />
            <TransactionList transactions={data.block.transactions!} />
          </div>
        </>
      ) : null}{" "}
    </>
  );
}

interface TransactionListProps {
  transactions: TransactionWithPrivateData[];
}
const SPLIT_KEY = "\u0000";
function splitHLFKey(key: string): string[] {
  return key.split(SPLIT_KEY).filter((i) => !!i);
}

function TransactionList({ transactions }: TransactionListProps) {
  const columns = useMemo(
    () =>
      [
        {
          accessor: "txID",
          Header: "ID #",
          Cell: function Cell({ row: { original } }) {
            return (
              <div className="flex items-center" title={original.txID}>
                {original.txID.substring(0, 8)}
              </div>
            );
          },
        },
        {
          accessor: "request",
          Header: "Request",
          Cell: function Cell({ row: { original } }) {
            return (
              <div className="flex items-center" title={original.request!}>
                {original.request}
              </div>
            );
          },
        },
        {
          accessor: "chaincode",
          Header: "Chaincode",
          Cell: function Cell({ row: { original } }) {
            return (
              <div className="flex items-center" title={original.chaincode}>
                {original.chaincode}
              </div>
            );
          },
        },
        {
          accessor: "writes",
          Header: "Writes",
          Cell: function Cell({ row: { original } }) {
            return (
              <div className="flex items-center">
                <ul>
                  {original.writes?.map((write) => {
                    let value = write.value;
                    try {
                      value = JSON.stringify(JSON.parse(write.value), null, 4);
                    } catch (e) {
                      // value not json
                      value = write.value;
                    }
                    return (
                      <li key={write.key}>
                        <pre>
                          Key = {write.key.replace(/\u0000/g, "|")}
                          <br />
                          Value = {value || `""`}
                          <br />
                          {write.deleted ? <>Deleted ={" Yes"}</> : null}
                        </pre>
                      </li>
                    );
                  })}

                  {original.pdcWrites?.map((write) => {
                    let value = write.value;
                    try {
                      value = JSON.stringify(JSON.parse(write.value), null, 4);
                    } catch (e) {
                      // value not json
                      value = write.value;
                    }
                    return (
                      <li key={write.key}>
                        <pre>
                          PDC Name = {write.collectionName}
                          <br />
                          Key = {write.key.replace(/\u0000/g, "|")}
                          <br />
                          Value = {value || `""`}
                          <br />
                          {write.deleted ? <>Deleted ={" Yes"}</> : null}
                        </pre>
                      </li>
                    );
                  })}
                  {!!original.pdcWriteHashes?.length ? (
                    <>
                      <h3 className="font-medium text-lg">PDC Write hashes</h3>
                      {original.pdcWriteHashes?.map((write) => {
                        return (
                          <li key={write.keyHash}>
                            <pre>
                              PDC Name = {write.pdcName}
                              <br />
                              Key = {write.keyHash}
                              <br />
                              Value = {write.valueHash}
                              {write.isDelete ? (
                                <>
                                  <br /> Deleted ={" Yes"}{" "}
                                </>
                              ) : null}
                              {write.isPurge ? (
                                <>
                                  {" "}
                                  <br /> Purged ={" Yes"}{" "}
                                </>
                              ) : null}
                              <br />
                              {write.rwSetHash}
                              <br />
                            </pre>
                          </li>
                        );
                      })}
                    </>
                  ) : null}
                </ul>
              </div>
            );
          },
        },
        {
          accessor: "reads",
          Header: "Reads",
          Cell: function Cell({ row: { original } }) {
            return (
              <div className="flex items-center">
                <ul>
                  {original.reads?.map((read) => {
                    return (
                      <li key={read.key}>
                        {" "}
                        {read.key}={read.txNumVersion} ({read.blockNumVersion})
                      </li>
                    );
                  })}
                  {original.pdcReads?.map((read) => {
                    return (
                      <li key={read.key}>
                        {read.key}={read.txNum} ({read.block})
                      </li>
                    );
                  })}
                  {!!original.pdcReadHashes?.length ? (
                    <>
                      <h3 className="font-medium text-lg">PDC Read hashes</h3>
                      {original.pdcReadHashes?.map((read) => {
                        return (
                          <li key={read.keyHash}>
                            <pre>
                              PDC Name = {read.pdcName}
                              <br />
                              Key = {read.keyHash}
                              <br />
                              {read.rwSetHash}
                              <br />
                              {read.version?.blockNum} / {read.version?.txNum}
                            </pre>
                          </li>
                        );
                      })}
                    </>
                  ) : null}
                </ul>
              </div>
            );
          },
        },
      ] as (Column<TransactionWithPrivateData> &
        UseSortByColumnOptions<TransactionWithPrivateData>)[],
    []
  );
  const table = useTable(
    {
      data: transactions,
      columns,
    },
    usePagination
  ) as TableInstance<TransactionWithPrivateData> &
    UsePaginationInstanceProps<TransactionWithPrivateData>;
  return <Table error={null} loading={false} table={table} />;
}
interface BlockDetailProps {
  block: BlockWithPrivateData;
}
function BlockDetailCard({ block }: BlockDetailProps) {
  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Block information
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Block number #
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {block.blockNumber}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Hash</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {block.dataHash}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Created at</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <TimeAgo title={block.createdAt} datetime={block.createdAt} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
function PeerOrgDetail({ channel }: { channel: Channel }) {
  const { org, name } = useParams();
  return (
    <>
      <OrgDetailCard
        channel={channel}
        org={channel.application?.organizations?.find((i) => i.mspID == org)!}
      />
    </>
  );
}
interface ChannelDetailComponentProps {
  channel: Pick<
    Channel,
    "name" | "peers" | "height" | "application" | "orderer"
  >;
}
function ChannelDetailComponent({ channel }: ChannelDetailComponentProps) {
  return (
    <>
      <div className="mt-8">
        <ChannelDetailCard channel={channel as any} />
      </div>
      <div className="mt-8">
        <PeerOrgList channel={channel as any} />
      </div>
      <div className="mt-8">
        <OrdererOrgList channel={channel as any} />
      </div>
      <div className="mt-8">
        <SectionHeading title="Channel peers" />
        <div className="mt-4">
          <PeerList channel={channel} />
        </div>
      </div>
    </>
  );
}

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, UsersIcon } from "@heroicons/react/24/solid";
import {
  EllipsisVerticalIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/20/solid";
import { Fragment, useMemo, useState } from "react";
import TimeAgo from "timeago-react";
import BlockList from "../components/BlockList";
import PageSkeleton from "../components/skeletons/PageSkeleton";
import { Table } from "../components/table";
import CertificateDetail from "../components/CertificateDetail";
import JSONModal from "../components/overlays/JSONModal";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
/* This example requires Tailwind CSS v2.0+ */
function SectionHeading({ title }: { title: string }) {
  return (
    <div className="pb-5 border-b border-gray-200">
      <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
    </div>
  );
}

function OrdererOrgList({ channel }: { channel: Channel }) {
  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Orderer organizations
      </h2>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {channel.orderer.organizations?.map((org) => (
          <li key={org.mspID} className="col-span-1 flex shadow-sm rounded-md">
            <div
              className={classNames(
                "bg-purple-500",
                "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
              )}
            >
              {org.mspID.substring(0, 2)}
            </div>
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <Link
                  to={`/channels/${channel.name}/ordererorg/${org.mspID}`}
                  className="text-gray-900 font-medium hover:text-gray-600"
                >
                  {org.mspID}
                </Link>
                <p className="text-gray-500">
                  {org.ordererEndpoints?.length || 0} orderer endpoints
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PeerOrgList({ channel }: { channel: Channel }) {
  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Peer organizations
      </h2>
      <ul
        role="list"
        className="mt-3 grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {channel.application?.organizations?.map((org) => (
          <li key={org.mspID} className="col-span-1 flex shadow-sm rounded-md">
            <div
              className={classNames(
                "bg-pink-600",
                "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
              )}
            >
              {org.mspID.substring(0, 2)}
            </div>
            <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
              <div className="flex-1 px-4 py-2 text-sm truncate">
                <Link
                  to={`/channels/${channel.name}/peerorg/${org.mspID}`}
                  className="text-gray-900 font-medium hover:text-gray-600"
                >
                  {org.mspID}
                </Link>
                <p className="text-gray-500">
                  {org.anchorPeer?.length || 0} Anchor peers
                </p>
              </div>
              <div className="flex-shrink-0 pr-2">
                <button
                  type="button"
                  className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon
                    className="w-5 h-5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
function OrdererOrgDetail({ channel }: { channel: Channel }) {
  const { org, name } = useParams();
  return (
    <>
      <OrgDetailCard
        channel={channel}
        org={channel.orderer.organizations?.find((i) => i.mspID == org)!}
      />
    </>
  );
}
function OrgDetailCard({
  channel,
  org,
}: {
  channel: Channel;
  org: ChannelOrg;
}) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Organization Information
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">MSP ID</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {org.mspID}
            </dd>
          </div>
          {org.ordererEndpoints && org.ordererEndpoints.length > 0 && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Orderer endpoints
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul>
                  {org.ordererEndpoints?.map((ordEndpoint) => (
                    <li key={ordEndpoint} className="text-sm text-gray-900">
                      {ordEndpoint}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
          {org.anchorPeer && org.anchorPeer.length > 0 && (
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Anchor peers
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul>
                  {org.anchorPeer?.map((anchorPeer) => (
                    <li
                      key={`${anchorPeer.host}:${anchorPeer.port}`}
                      className="text-sm text-gray-900"
                    >
                      {anchorPeer.host}:{anchorPeer.port}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          )}
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Sign Certificates
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {org.msp?.rootCerts?.map((cert, idx) => (
                <CertificateDetail key={idx} certificate={cert} />
              ))}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              TLS Certificates
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {org.msp?.tlsRootCerts?.map((cert, idx) => (
                <CertificateDetail key={idx} certificate={cert} />
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

interface IChannelDetailCardProps {
  channel: Pick<Channel, "name" | "height" | "application" | "orderer">;
}
function ChannelDetailCard({ channel }: IChannelDetailCardProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Channel Information
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {channel.name}
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Height</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {channel.height}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

interface IPeerListProps {
  channel: Pick<Channel, "peers">;
}
function PeerList({ channel: { peers = [] } }: IPeerListProps) {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {peers?.map((peer) => (
          <li key={peer.url}>
            <a href="#" className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {peer.url}
                  </p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {peer.height}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <UsersIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      {peer.mspID}
                    </p>
                  </div>
                  {/* <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <CalendarIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <p>
                      Closing on{" "}
                      <time dateTime={peer.closeDate}>
                        {peer.closeDateFull}
                      </time>
                    </p>
                  </div> */}
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BlockListPage() {
  const { name } = useParams();
  return (
    <>
      <BlockList channel={name!} />
    </>
  );
}

interface ChannelSelectorProps {
  channels: LightChannel[];
  value: string;
  setValue: (value: string) => void;
}
function ChannelSelector({ channels, value, setValue }: ChannelSelectorProps) {
  return (
    <Listbox value={value} onChange={setValue}>
      {({ open }) => (
        <>
          <Listbox.Label className="block text-sm font-medium text-gray-700">
            Channel
          </Listbox.Label>
          <div className="mt-1 relative">
            <Listbox.Button className="relative w-full bg-white border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <span className="block truncate">{value}</span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {channels.map((channel) => (
                  <Listbox.Option
                    key={channel.name}
                    className={({ active }) =>
                      classNames(
                        active ? "text-white bg-indigo-600" : "text-gray-900",
                        "cursor-default select-none relative py-2 pl-8 pr-4"
                      )
                    }
                    value={channel.name}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={classNames(
                            selected ? "font-semibold" : "font-normal",
                            "block truncate"
                          )}
                        >
                          {channel.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 left-0 flex items-center pl-1.5"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
