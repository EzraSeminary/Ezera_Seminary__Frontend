import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/user/ErrorPage.js";
import { getGoogleWebClientId } from "@/config/authProviders";

axios.defaults.baseURL = "https://ezrabackend.online/";
axios.defaults.headers.common["Content-Type"] = "application/json";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={getGoogleWebClientId()}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
