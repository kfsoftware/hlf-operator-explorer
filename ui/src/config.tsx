import React, { createContext, useContext } from "react";
import { useNetworkConfigEnabledQuery } from "./operations";

interface ConfigState {
  apiUrl: string;
  oidcAuthority: string;
  oidcClientId: string;
  oidcScope: string;
  logoUrl: string;
}
const ConfigContext = createContext<ConfigState>({
  apiUrl: "",
  logoUrl: "",
  oidcAuthority: "",
  oidcClientId: "",
  oidcScope: "",
});

export function useConfig() {
  const config = useContext(ConfigContext);
  if (config === undefined) {
    throw new Error(
      "ConfigContext value is undefined. Make sure you use the ConfigProvider before using the config."
    );
  }
  return config;
}

interface ConfigProviderProps {
  children: React.ReactNode;
  apiUrl: string;
  oidcAuthority: string;
  oidcClientId: string;
  oidcScope: string;
  logoUrl: string;
}

export function ConfigProvider({
  children,
  apiUrl,
  logoUrl,
  oidcAuthority,
  oidcClientId,
  oidcScope,
}: ConfigProviderProps) {
  return (
    <ConfigContext.Provider
      value={{
        apiUrl,
        logoUrl,
        oidcAuthority,
        oidcClientId,
        oidcScope,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}
