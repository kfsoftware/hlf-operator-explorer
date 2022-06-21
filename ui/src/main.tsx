import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ApolloProvider } from "./providers/ApolloProvider";
import Routes from "./routes";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        {({ appConfig }) => (
          <ApolloProvider url={appConfig.apiUrl}>
            <Routes />
          </ApolloProvider>
        )}
      </App>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
