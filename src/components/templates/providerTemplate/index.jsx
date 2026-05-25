import { Helmet, HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "../../../redux/store";

const ProviderTemplate = ({ children }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Template provider</title>
      </Helmet>
      <h2>Provider Template</h2>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </HelmetProvider>
  );
};

export default ProviderTemplate;
