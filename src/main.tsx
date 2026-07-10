// import { StrictMode } from "react";
// import { store } from "./redux/store";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { setupAxiosInterceptors } from "./lib/axiosInterceptors";
import { setupAutoSync } from "./lib/syncService";

setupAxiosInterceptors();
setupAutoSync();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // <StrictMode>
  // </StrictMode>,
);
