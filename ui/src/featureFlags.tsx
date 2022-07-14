import React, { createContext, useContext } from "react";
import { useNetworkConfigEnabledQuery } from "./operations";

interface FeatureFlagsState {
  networkConfigEnabled: boolean;
}
const FeatureFlagsContext = createContext<FeatureFlagsState>({
  networkConfigEnabled: false,
});

export function useFeatureFlags() {
  const FeatureFlags = useContext(FeatureFlagsContext);
  if (FeatureFlags === undefined) {
    throw new Error(
      "FeatureFlagsContext value is undefined. Make sure you use the FeatureFlagsProvider before using the FeatureFlags."
    );
  }
  return FeatureFlags;
}

interface FeatureFlagsProviderProps {
  children: React.ReactNode;
}

export function FeatureFlagsProvider({ children }: FeatureFlagsProviderProps) {
  const { data: networkFeatureFlagsData } = useNetworkConfigEnabledQuery({
    fetchPolicy: "cache-and-network",
  });
  return (
    <FeatureFlagsContext.Provider
      value={{
        networkConfigEnabled:
          networkFeatureFlagsData?.networkConfigEnabled ?? false,
      }}
    >
      {children}
    </FeatureFlagsContext.Provider>
  );
}
