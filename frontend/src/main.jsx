// src/main.jsx
// React entry point — mounts the App into the DOM.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

// Bootstrap CSS + Icons
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

// Bootstrap JS (needed for mobile navbar collapse toggle)
import "bootstrap/dist/js/bootstrap.bundle.min.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
