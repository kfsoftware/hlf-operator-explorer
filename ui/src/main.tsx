import React, { useMemo } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import App from "./App";
import "./index.css";

const RouteAdapter: React.FC = ({ children }: any) => {
  const navigate = useNavigate();
  const location = useLocation();
  const adaptedHistory = useMemo(
    () => ({
      replace(location: Location) {
        navigate(location, { replace: true });
      },
      push(location: Location) {
        navigate(location, {
          replace: false,
        });
      },
    }),
    [navigate, location]
  );
  return children({ history: adaptedHistory, location });
};
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryParamProvider ReactRouterRoute={RouteAdapter}>
        <App />
      </QueryParamProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
