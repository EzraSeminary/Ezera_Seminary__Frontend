import React from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ErrorBoundary } from "react-error-boundary";
import ErrorPage from "./pages/user/ErrorPage.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
const ClientID =
  "772374983893-9j4rltjf7un83bo7qsvb6atd6piphpbd.apps.googleusercontent.com";

// axios.defaults.baseURL = "https://ezra-seminary.me";
axios.defaults.baseURL = "http://localhost:5100";
axios.defaults.headers.common["Content-Type"] = "application/json";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={ClientID}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Provider store={store}>
          <App />
        </Provider>
      </ErrorBoundary>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
