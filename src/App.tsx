// import './App.css'
import { Suspense } from "react";
import ProviderTemplate from "./components/templates/providerTemplate";
import LayoutTemplate from "./components/templates/LayoutTemplate";
import Router from "./routes";

function App() {
  return (
    <ProviderTemplate>
      <LayoutTemplate>
        <Suspense fallback={<h1>Loading</h1>}>
          <Router />
        </Suspense>
      </LayoutTemplate>
    </ProviderTemplate>
  );
}

export default App;
