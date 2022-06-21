import { useEffect, useState } from "react";
import "./App.css";

interface AppConfig {
  apiUrl: string;
}
function App({
  children,
}: {
  children: ({ appConfig }: { appConfig: AppConfig }) => any;
}) {
  console.log(children);
  
  const [appConfig, setAppConfig] = useState<AppConfig>({
    apiUrl: "",
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
  return error ? (
    <div>{error}</div>
  ) : loading ? (
    <div>Loading...</div>
  ) : (
    children ? children({ appConfig }) : "not children"
  );
}

export default App;
