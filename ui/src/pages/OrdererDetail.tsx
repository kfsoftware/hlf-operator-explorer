import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { parse, stringify } from "yaml";
import CertificateDetail from "../components/CertificateDetail";
import JSONModal from "../components/overlays/JSONModal";
import PageSkeleton from "../components/skeletons/PageSkeleton";
import { useGetCaQuery, useGetOrdererQuery } from "../operations";

interface OrdererDetailProps {
  ca: any;
}
function OrdererDetailCard({ ca }: OrdererDetailProps) {
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
              <dt className="text-sm font-medium text-gray-500">Istio hosts</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc">
                  {ca.spec.istio.hosts.map((host: string, idx: number) => {
                    return <li key={idx}>{host}</li>;
                  })}
                </ul>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Admin API hosts</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="list-disc">
                  {ca.spec.adminIstio.hosts.map((host: string, idx: number) => {
                    return <li key={idx}>{host}</li>;
                  })}
                </ul>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">TLS Cert Orderer</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <CertificateDetail certificate={ca.status.tlsCert} />
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Sign Cert Orderer
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <CertificateDetail certificate={ca.status.signCert} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </>
  );
}

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

  const [showRawConfiguration, setShowRawConfiguration] = useState(false);
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Orderer
            </h2>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setShowRawConfiguration(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              View full resource
            </button>
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
                      <OrdererDetailCard ca={parsedOrderer} />
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
