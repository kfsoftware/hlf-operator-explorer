import { Route, Routes as ReactRoutes } from "react-router-dom";
import Base from "./Base";
import CACreate from "./pages/CACreate";
import CADetail from "./pages/CADetail";
import CAList from "./pages/CAList";
import ChannelDetail from "./pages/ChannelDetail";
import ChannelList from "./pages/Channels";
import NotFound from "./pages/NotFound";
import OrdCreate from "./pages/OrdCreate";
import OrdererDetail from "./pages/OrdererDetail";
import OrdererList from "./pages/OrdererList";
import PeerCreate from "./pages/PeerCreate";
import PeerDetail from "./pages/PeerDetail";
import PeerList from "./pages/PeerList";
export default function Routes() {
  return (
      <ReactRoutes>
        <Route path="/" element={<Base />}>
          <Route index element={<PeerList />} />
          <Route path="peers" element={<PeerList />} />
          <Route path="peers/create" element={<PeerCreate />} />
          <Route path="peers/:namespace/:name" element={<PeerDetail />} />
          <Route path="orderers" element={<OrdererList />} />
          <Route path="orderers/create" element={<OrdCreate />} />
          <Route path="orderers/:namespace/:name" element={<OrdererDetail />} />
          <Route path="cas" element={<CAList />} />
          <Route path="cas/create" element={<CACreate />} />
          <Route path="cas/:namespace/:name" element={<CADetail />} />
          <Route path="channels" element={<ChannelList />} />
          <Route path="channels/:name/*" element={<ChannelDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </ReactRoutes>
  );
}
