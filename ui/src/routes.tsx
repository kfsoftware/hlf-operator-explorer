import { BrowserRouter, Route, Routes as ReactRoutes } from "react-router-dom";
import App from "./App";
import CADetail from "./pages/CADetail";
import CAList from "./pages/CAList";
import ChannelDetail from "./pages/ChannelDetail";
import ChannelList from "./pages/Channels";
import NotFound from "./pages/NotFound";
import OrdererDetail from "./pages/OrdererDetail";
import OrdererList from "./pages/OrdererList";
import PeerDetail from "./pages/PeerDetail";
import PeerList from "./pages/PeerList";
export default function Routes() {
  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route path="/" element={<App />}>
          <Route index element={<PeerList />} />
          <Route path="peers" element={<PeerList />} />
          <Route path="peers/:namespace/:name" element={<PeerDetail />} />
          {/* <Route path="peers/create" element={<PeerCreate />} /> */}
          <Route path="orderers" element={<OrdererList />} />
          <Route path="orderers/:namespace/:name" element={<OrdererDetail />} />
          <Route path="cas" element={<CAList />} />
          <Route path="cas/:namespace/:name" element={<CADetail />} />
          <Route path="channels" element={<ChannelList />} />
          <Route path="channels/:name/*" element={<ChannelDetail />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </ReactRoutes>
    </BrowserRouter>
  );
}
