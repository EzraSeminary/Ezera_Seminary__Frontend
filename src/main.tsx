import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import axios from "axios";
import { AuthContextProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import store from "./redux/store";

axios.defaults.baseURL = "https://ezra-seminary-api.onrender.com";
// axios.defaults.baseURL = "http://localhost:5100";
axios.defaults.headers.common["Content-Type"] = "multipart/form-data";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </Provider>
  </React.StrictMode>
);
