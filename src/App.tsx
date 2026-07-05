// import './App.css'
import { Suspense } from "react";
import ProviderTemplate from "./components/templates/providerTemplate";
import LayoutTemplate from "./components/templates/LayoutTemplate";
import Router from "./routes";
import Spinner from "./components/feedback/Spinner";

function App() {
  return (
    <ProviderTemplate>
      <LayoutTemplate>
        <Suspense
          fallback={
            <div className="w-full h-42 flex justify-center items-center">
              <Spinner />
            </div>
          }
        >
          <Router />
        </Suspense>
      </LayoutTemplate>
    </ProviderTemplate>
  );
}

export default App;
