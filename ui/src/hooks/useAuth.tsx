import {
  AuthContextProps,
  useAuth as useOriginalAuth,
} from "react-oidc-context";
import { useConfig } from "../config";
export default function useAuth() {
  const config = useConfig();
  let auth: AuthContextProps | null = null;
  if (config.oidcAuthority && config.oidcClientId && config.oidcScope) {
    auth = useOriginalAuth();
  } else {
    const voidFunc: any = () => {};
    // try to mock the AuthContextProps
    auth = {
      isAuthenticated: false,
      user: null,
      isLoading: false,
      signinPopup: voidFunc,
      clearStaleState: voidFunc,
      signinRedirect: voidFunc,
    } as any;
  }
  return auth;
}
