import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../../../redux/store";
import type { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { SessionTimeoutManager } from "@/components/organisms/sessionTimeoutManager/SessionTimeoutManager";

const ProviderTemplate = ({ children }: { children: ReactNode }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>RTA Graduation</title>
      </Helmet>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Toaster />
          <SessionTimeoutManager />
          {children}
        </PersistGate>
      </Provider>
    </HelmetProvider>
  );
};

export default ProviderTemplate;
