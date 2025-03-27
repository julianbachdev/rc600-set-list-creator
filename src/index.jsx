import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AppProviders from "./contexts/AppProviders.js";

const root = createRoot(document.getElementById("app"));
root.render(
  <React.StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </React.StrictMode>
);
