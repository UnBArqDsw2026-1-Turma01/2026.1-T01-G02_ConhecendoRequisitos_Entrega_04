import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import { useAuth } from "./hooks/useAuth";

function AppWrapper() {
    const { restoreSession } = useAuth();

  useEffect(() => {
    // Restaurar sessão ao carregar a aplicação
    restoreSession();
  }, [restoreSession]);

  return <App />;
}

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    </StrictMode>
);