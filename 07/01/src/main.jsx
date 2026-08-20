import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { FormDraftProvider } from "./context/FormDraftContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FormDraftProvider>
        <App />
      </FormDraftProvider>
    </BrowserRouter>
  </StrictMode>
);
