import { Suspense } from "react";
import Router from "./routes";
import ProviderTemplate from "./components/templates/providerTemplate";

function App() {
  return (
    <ProviderTemplate>
      <Suspense fallback={<h1>Loading</h1>}>
        <Router />
      </Suspense>
    </ProviderTemplate>
  );
}

export default App;
