import { BrowserRouter, Routes as ReactRoutes, Route } from "react-router-dom";
import App from "./App";
import CAList from "./pages/CAList";
import NotFound from "./pages/NotFound";
import OrdererList from "./pages/OrdererList";
import PeerCreate from "./pages/PeerCreate";
import PeerList from "./pages/PeerList";
export default function Routes() {
  return (
    <BrowserRouter>
      <ReactRoutes>
        <Route path="/" element={<App />}>
          <Route index element={<PeerList />} />
          <Route path="peers" element={<PeerList />} />
          <Route path="peers/create" element={<PeerCreate />} />
          <Route path="orderers" element={<OrdererList />} />
          <Route path="cas" element={<CAList />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </ReactRoutes>
    </BrowserRouter>
  );
}
