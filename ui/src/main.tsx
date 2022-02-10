import React from "react";
import ReactDOM from "react-dom";
import Routes from "./routes";
import App from "./App";
import "./index.css";
import {ApolloProvider} from "./providers/ApolloProvider";

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider url="http://localhost:8003/graphql" >
      <Routes />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
