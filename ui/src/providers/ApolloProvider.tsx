import {
    ApolloClient,
    ApolloProvider as OriginalApolloProvider,
    createHttpLink,
    InMemoryCache
} from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import { onError } from "apollo-link-error";
import fetch from "cross-fetch";
import React, { useMemo, useState } from "react";
interface AuthorizedApolloProviderProps {
  url: string;
  children: JSX.Element;
}
export const ApolloProvider = ({
  children,
  url,
}: AuthorizedApolloProviderProps) => {
  const [errorMsg, setErrorMsg] = useState("");
  const httpLink = createHttpLink({
    uri: url,
    credentials: "same-origin",
    fetch,
  });

  const retryLink = new RetryLink({
    delay: {
      initial: 300,
      max: Infinity,
      jitter: true,
    },
    attempts: {
      max: 0,
      retryIf: (error, _operation) => !!error,
    },
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, path }) =>
        console.error(
          `[GraphQL error]: Message: ${message}, Operation: ${operation.operationName}, Path: ${path}`
        )
      );
    }
    if (networkError) console.error(`[Network error]: ${networkError}`);
  });
  const apolloClient = useMemo(
    () =>
      new ApolloClient({
        link: (errorLink as any).concat(retryLink).concat(httpLink),
        cache: new InMemoryCache(),
        connectToDevTools: true,
        defaultOptions: {
          watchQuery: {
            fetchPolicy: "no-cache",
            errorPolicy: "ignore",
          },
          query: {
            fetchPolicy: "no-cache",
            errorPolicy: "all",
          },
        },
      }),
    [errorLink, httpLink, retryLink]
  );

  return <OriginalApolloProvider client={apolloClient}>{children}</OriginalApolloProvider>;
};
