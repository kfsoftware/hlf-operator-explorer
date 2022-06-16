import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  useChannelQuery,
  useChannelsQuery,
  useGetCAsQuery,
  useGetOrderersQuery,
  useGetPeersQuery,
} from "../operations";

export default function ChannelDetail() {
  const { name } = useParams();
  const { data, error, loading } = useChannelQuery({
    variables: {
      channelID: name!,
    },
  });
  const navigate = useNavigate();
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Channel
            </h2>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {data?.channel ? (
          <pre>{JSON.stringify(data?.channel, null, 4)}</pre>
        ) : null}
      </div>
    </div>
  );
}
