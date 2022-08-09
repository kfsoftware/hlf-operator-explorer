import { useParams } from "react-router-dom";
import { useGetCaQuery } from "../operations";

export default function CADetail() {
  const { name, namespace } = useParams();
  const { data, error, loading } = useGetCaQuery({
    variables: {
      input: {
        name: name!,
        namespace: namespace!,
      },
    },
  });
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Certificate Authority
            </h2>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <pre>{JSON.stringify(data, null, 4)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
