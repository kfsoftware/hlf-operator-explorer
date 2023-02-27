import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ChevronDownIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Fragment, useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { parse, stringify } from "yaml";
import * as yup from "yup";
import CertificateDetail from "../components/CertificateDetail";
import TextField from "../components/inputs/TextField";
import JSONModal from "../components/overlays/JSONModal";
import ModalForm from "../components/overlays/ModalForm";
import PageSkeleton from "../components/skeletons/PageSkeleton";
import { classNames } from "../components/utils";
import {
  Orderer,
  useGetChannelLazyQuery,
  useGetOrdererQuery,
  useGetUpdatedChannelMutation,
  useRenewOrdererCertificatesMutation,
  useUpdateChannelMutation,
} from "../operations";
import base64 from "base-64";
import SubmitButton from "../components/SubmitButton";
import Button from "../components/Button";

interface OrdererDetailProps {
  orderer: any;
}
function OrdererDetailCard({ orderer }: OrdererDetailProps) {
  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Orderer Information
          </h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {orderer.metadata.name}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Namespace</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {orderer.metadata.namespace}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Istio hosts</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc">
                  {orderer.spec.istio.hosts.map((host: string, idx: number) => {
                    return <li key={idx}>{host}</li>;
                  })}
                </ul>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Admin API hosts
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc">
                  {orderer.spec.adminIstio.hosts.map(
                    (host: string, idx: number) => {
                      return <li key={idx}>{host}</li>;
                    }
                  )}
                </ul>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                TLS Cert Orderer
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <CertificateDetail certificate={orderer.status.tlsCert} />
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Sign Cert Orderer
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <CertificateDetail certificate={orderer.status.signCert} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}
export const joinOrdererSchema = yup.object().shape({
  name: yup.string().required(),
});

export const addConsenterSchema = yup.object().shape({
  channel: yup.string().required(),
});
export const removeConsenterSchema = yup.object().shape({
  channel: yup.string().required(),
});
export default function OrdererDetail() {
  const { name, namespace } = useParams();
  const { data, error, loading } = useGetOrdererQuery({
    variables: {
      input: {
        name: name!,
        namespace: namespace!,
      },
    },
  });
  const parsedOrderer = useMemo(() => {
    if (data?.orderer && data?.orderer.yaml) {
      const parsedFabricOrdererYaml = parse(data.orderer.yaml);
      return parsedFabricOrdererYaml;
    }
    return null;
  }, [data]);
  const parsedOrdererCleaned = useMemo(() => {
    if (parsedOrderer) {
      const newParsedOrderer = { ...parsedOrderer };
      newParsedOrderer.metadata = {
        name: parsedOrderer.metadata.name,
        namespace: parsedOrderer.metadata.namespace,
      };

      return stringify(newParsedOrderer);
    }
    return stringify({});
  }, [parsedOrderer]);
  const [renewCertificatesOpen, setRenewCertificatesOpen] = useState(false);
  const [joinChannelOpen, setJoinChannelOpen] = useState(false);
  const [leaveChannelOpen, setLeaveChannelOpen] = useState(false);
  const [addConsenterLoading, setAddConsenterLoading] = useState(false);
  const [removeConsenterLoading, setRemoveConsenterLoading] = useState(false);
  const [addConsenterOpen, setAddConsenterOpen] = useState(false);
  const [removeConsenterOpen, setRemoveConsenterOpen] = useState(false);
  const [updateChannel, updateChannelData] = useUpdateChannelMutation();
  const [getUpdatedChannel, getUpdatedChannelData] =
    useGetUpdatedChannelMutation();
  const [getChannel, getChannelData] = useGetChannelLazyQuery();

  const [showRawConfiguration, setShowRawConfiguration] = useState(false);
  return (
    <>
      {/* <OrdererLeaveChannelModal
        onLeave={() => {
          setLeaveChannelOpen(false);
        }}
        open={leaveChannelOpen}
        orderer={data?.orderer! as Orderer}
        setOpen={setLeaveChannelOpen}
      />
      <OrdererJoinChannelModal
        onJoined={() => {
          setJoinChannelOpen(false);
        }}
        open={joinChannelOpen}
        orderer={data?.orderer! as Orderer}
        setOpen={setJoinChannelOpen}
      />*/}
      {data?.orderer && (
        <RenewOrdererCertificatesModal
          onRenewed={() => {
            setRenewCertificatesOpen(false);
          }}
          open={renewCertificatesOpen}
          orderer={data?.orderer! as Orderer}
          setOpen={setRenewCertificatesOpen}
        />
      )}
      <ModalForm
        title="Add orderer as consenter"
        loading={addConsenterLoading}
        onError={console.error}
        defaultValues={{}}
        onSubmit={async (values, methods) => {
          setAddConsenterLoading(true);
          try {
            const ordererHost = parsedOrderer.spec.istio.hosts[0];
            const ordererPort = parsedOrderer.spec.istio.port;
            const clientTlsCertB64 = base64.encode(
              parsedOrderer.status.tlsCert
            );
            const serverTlsCertB64 = base64.encode(
              parsedOrderer.status.tlsCert
            );
            console.log(ordererHost, ordererPort, clientTlsCertB64, serverTlsCertB64)
            const { data: getUpdatedChannelResponse } = await getUpdatedChannel(
              {
                variables: {
                  input: {
                    channelID: values.channel,
                    application: {
                      policies: [],
                      acls: [],
                      capabilities: [],
                      addOrgs: [],
                      delOrgs: [],
                    },
                    orderer: {
                      etcdRaft: {
                        addConsenters: [
                          {
                            address: {
                              port: ordererPort,
                              host: ordererHost,
                            },
                            clientTlsCert: clientTlsCertB64,
                            serverTlsCert: serverTlsCertB64,
                          },
                        ],
                      },
                    },
                    channel: {},
                  },
                },
              }
            );
            const block =
              getUpdatedChannelResponse?.getUpdateChannelBlock?.block!;
            const { data: updateChannelData } = await updateChannel({
              variables: {
                input: {
                  block: block,
                  name: values.channel,
                  mspSignatures: [
                    {
                      mspID: "OrdererMSP",
                    },
                  ],
                },
              },
            });
            setAddConsenterOpen(false);
          } catch (e) {
            setAddConsenterLoading(false);
          } finally {
            setAddConsenterLoading(false);
          }
        }}
        open={addConsenterOpen}
        setOpen={setAddConsenterOpen}
        schema={addConsenterSchema}
      >
        {({ methods }) => (
          <div className="space-y-4">
            <TextField
              label="Channel name"
              name="channel"
              autoFocus={true}
              options={{}}
              register={methods.register}
            />
          </div>
        )}
      </ModalForm>
      <ModalForm
        title="Remove orderer as consenter"
        loading={removeConsenterLoading}
        onError={console.error}
        defaultValues={{}}
        onSubmit={async (values, methods) => {
          setRemoveConsenterLoading(true);
          try {
            // const orderer = data.orderer!;
            const ordererHost = parsedOrderer.spec.istio.hosts[0];
            const ordererPort = parsedOrderer.spec.istio.port;
            console.log(ordererHost, ordererPort);
            // const ordererHost = orderer.host;
            // const ordererPort = orderer.port;
            const { data: channelData } = await getChannel({
              variables: {
                channelID: values.channel,
              },
            });
            const consenter =
              channelData?.channel?.orderer.etcdDraft.consenters?.find(
                (i) =>
                  i.address.host === ordererHost &&
                  i.address.port === ordererPort
              );
            console.log(consenter);
            if (consenter) {
              const clientTlsCertB64 = base64.encode(consenter.clientTlsCert);
              const serverTlsCertB64 = base64.encode(consenter.serverTlsCert);
              const { data: getUpdatedChannelResponse } =
                await getUpdatedChannel({
                  variables: {
                    input: {
                      channelID: values.channel,
                      application: {
                        policies: [],
                        acls: [],
                        capabilities: [],
                        addOrgs: [],
                        delOrgs: [],
                      },
                      orderer: {
                        etcdRaft: {
                          delConsenters: [
                            {
                              address: {
                                port: ordererPort,
                                host: ordererHost,
                              },
                              clientTlsCert: clientTlsCertB64,
                              serverTlsCert: serverTlsCertB64,
                            },
                          ],
                        },
                      },
                      channel: {},
                    },
                  },
                });
              const block =
                getUpdatedChannelResponse?.getUpdateChannelBlock?.block!;
              console.log(
                JSON.parse(
                  getUpdatedChannelResponse?.getUpdateChannelBlock.configUpdate!
                )
              );
              await updateChannel({
                variables: {
                  input: {
                    block: block,
                    name: values.channel,
                    mspSignatures: [
                      {
                        mspID: "OrdererMSP",
                      },
                    ],
                  },
                },
              });
            }
            setRemoveConsenterOpen(false);
          } catch (e) {
            console.log(e);
          } finally {
            setRemoveConsenterLoading(false);
          }
        }}
        open={removeConsenterOpen}
        setOpen={setRemoveConsenterOpen}
        schema={removeConsenterSchema}
      >
        {({ methods }) => (
          <div className="space-y-4">
            <TextField
              label="Channel name"
              name="channel"
              autoFocus={true}
              options={{}}
              register={methods.register}
            />
          </div>
        )}
      </ModalForm>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                Orderer
              </h2>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Menu as="div" className="relative inline-block text-left">
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
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setLeaveChannelOpen(true)}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm w-full text-left"
                            )}
                          >
                            Leave channel
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setAddConsenterOpen(true)}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm w-full text-left"
                            )}
                          >
                            Add as a consenter
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => setRemoveConsenterOpen(true)}
                            className={classNames(
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700",
                              "block px-4 py-2 text-sm w-full text-left"
                            )}
                          >
                            Remove as a consenter
                          </button>
                        )}
                      </Menu.Item>
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
            data={parsedOrdererCleaned}
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
                  ) : parsedOrderer ? (
                    <>
                      <div>
                        <OrdererDetailCard orderer={parsedOrderer} />
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
interface RenewOrdererCertificatesModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  orderer: Orderer;
  onRenewed: () => void;
}
function RenewOrdererCertificatesModal({
  onRenewed,
  open,
  orderer,
  setOpen,
}: RenewOrdererCertificatesModalProps) {
  const [renewCertificates, renewCertificatesData] =
    useRenewOrdererCertificatesMutation({});

  const submit = useCallback(async () => {
    await renewCertificates({
      variables: {
        input: {
          name: orderer.name,
          namespace: orderer.namespace,
          force: false,
        },
      },
    });
    await onRenewed();
  }, [renewCertificates, onRenewed]);
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
                        {orderer.name}.{orderer.namespace}
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
                <Button
                  buttonType="action"
                  className="mt-3 w-full inline-flex"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
