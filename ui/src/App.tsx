import { useEffect, useMemo, useState } from "react";
import { AuthProvider } from "react-oidc-context";
import { useNavigate } from "react-router-dom";
import { StringParam, useQueryParam } from "use-query-params";
import "./App.css";
import { ApolloProvider } from "./providers/ApolloProvider";
import Routes from "./routes";

interface AppConfig {
  apiUrl: string;
  oidcAuthority: string;
  oidcClientId: string;
  oidcScope: string;
}
function App({}: {}) {
  const [appConfig, setAppConfig] = useState<AppConfig>({
    apiUrl: "",
    oidcAuthority: "",
    oidcClientId: "",
    oidcScope: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadConfig() {
      setLoading(true);
      try {
        const res = await fetch("/config.json");
        const config = await res.json();
        setAppConfig(config);
      } catch (e) {
        setError((e as Error).toString());
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);
  const redirectUri = useMemo(() => `${location.origin}/`, []);
  const [callbackUri] = useQueryParam("callback_uri", StringParam);
  const navigate = useNavigate();
  return error ? (
    <div>{error}</div>
  ) : loading ? (
    <div>Loading...</div>
  ) : appConfig.oidcAuthority &&
    appConfig.oidcClientId &&
    appConfig.oidcScope ? (
    <AuthProvider
      loadUserInfo={true}
      authority={appConfig.oidcAuthority}
      client_id={appConfig.oidcClientId}
      onSigninCallback={() => {
        if (callbackUri) {
          navigate(callbackUri, { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }}
      scope={appConfig.oidcScope}
      redirect_uri={redirectUri}
    >
      <ApolloProvider url={appConfig.apiUrl}>
        <Routes />
      </ApolloProvider>
    </AuthProvider>
  ) : (
    <ApolloProvider url={appConfig.apiUrl}>
      <Routes />
    </ApolloProvider>
  );
}

export default App;
