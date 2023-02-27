import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon, ExclamationTriangleIcon,
  XMarkIcon
} from "@heroicons/react/24/solid";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { parse, stringify } from "yaml";
import CertificateDetail from "../components/CertificateDetail";
import JSONModal from "../components/overlays/JSONModal";
import PageSkeleton from "../components/skeletons/PageSkeleton";
import SubmitButton from "../components/SubmitButton";
import { classNames } from "../components/utils";
import {
  Peer, useGetPeerQuery,
  useRenewPeerCertificatesMutation
} from "../operations";

interface PeerDetailProps {
  ca: any;
}
function PeerDetailCard({ ca }: PeerDetailProps) {
  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Peer Information
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {ca.metadata.name}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Namespace</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {ca.metadata.namespace}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Hosts</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc">
                  {ca.spec.hosts.map((host: string, idx: number) => {
                    return <li key={idx}>{host}</li>;
                  })}
                </ul>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                TLS Cert Peer
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <CertificateDetail certificate={ca.status.tlsCert} />
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Sign Cert Peer
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <CertificateDetail certificate={ca.status.signCert} />
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Status message
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {ca.status.message}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}

interface RenewPeerCertificatesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  peer: Peer;
  onRenewed: () => void;
}
function RenewPeerCertificatesModal({
  onRenewed,
  open,
  peer,
  setOpen,
}: RenewPeerCertificatesModalProps) {
  const [renewCertificates, renewCertificatesData] =
    useRenewPeerCertificatesMutation({});
  const submit = useCallback(async () => {
    await renewCertificates({
      variables: {
        input: {
          name: peer.name,
          namespace: peer.namespace,
        },
      },
    });
    await onRenewed();
  }, [renewCertificates]);
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-50 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-yellow-400"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <Dialog.Title
                    as="h3"
                    className="text-lg leading-6 font-medium text-gray-900"
                  >
                    Renew certificates
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to renew the certificates of the
                      peer{" "}
                      <b>
                        {peer.name}.{peer.namespace}
                      </b>
                      ?
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <SubmitButton
                  onClick={() => submit()}
                  loading={renewCertificatesData.loading}
                  disabled={renewCertificatesData.loading}
                  className="w-full inline-flex justify-center"
                >
                  Renew
                </SubmitButton>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default function PeerDetail() {
  const { name, namespace } = useParams();
  const { data, error, loading } = useGetPeerQuery({
    variables: {
      input: {
        name: name!,
        namespace: namespace!,
      },
    },
  });
  const parsedPeer = useMemo(() => {
    if (data?.peer && data?.peer.yaml) {
      const parsedFabricPeerYaml = parse(data.peer.yaml);
      return parsedFabricPeerYaml;
    }
    return null;
  }, [data]);
  const parsedPeerCleaned = useMemo(() => {
    if (parsedPeer) {
      const newParsedPeer = { ...parsedPeer };
      newParsedPeer.metadata = {
        name: parsedPeer.metadata.name,
        namespace: parsedPeer.metadata.namespace,
      };

      return stringify(newParsedPeer);
    }
    return stringify({});
  }, [parsedPeer]);
  const [renewCertificatesOpen, setRenewCertificatesOpen] = useState(false);
  const [joinChannelOpen, setJoinChannelOpen] = useState(false);
  const [leaveChannelOpen, setLeaveChannelOpen] = useState(false);

  const [showRawConfiguration, setShowRawConfiguration] = useState(false);
  return (
    <>
      {data?.peer && (
        <RenewPeerCertificatesModal
          onRenewed={() => {
            setRenewCertificatesOpen(false);
          }}
          open={renewCertificatesOpen}
          peer={data?.peer! as Peer}
          setOpen={setRenewCertificatesOpen}
        />
      )}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Peer
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setShowRawConfiguration(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                View full resource
              </button>
              <Menu as="div" className="relative inline-block text-left ml-4">
                <div>
                  <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                    Options
                    <ChevronDownIcon
                      className="-mr-1 ml-2 h-5 w-5"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setJoinChannelOpen(true)}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm w-full text-left"
                            )}
                          >
                            Join channel
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setRenewCertificatesOpen(true)}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm w-full text-left"
                            )}
                          >
                            Renew certificates
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>
        {showRawConfiguration ? (
          <JSONModal
            open={showRawConfiguration}
            setOpen={setShowRawConfiguration}
            data={parsedPeerCleaned}
          />
        ) : null}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="py-4">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  {loading ? (
                    <PageSkeleton />
                  ) : error ? (
                    <div>Error: {error.message}</div>
                  ) : parsedPeer ? (
                    <>
                      <div>
                        <PeerDetailCard ca={parsedPeer} />
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
