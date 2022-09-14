/* eslint-disable comma-dangle */
import React from "react";
import { createRoot } from "react-dom/client";
import PrimeReact from "primereact/api";
import "./index.css";
import { MemoryRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import App from "./App";
import "primereact/resources/themes/md-light-indigo/theme.css"; // theme
import "primereact/resources/primereact.min.css"; // core css
import "primeicons/primeicons.css"; // icons
import "primeflex/primeflex.css";

PrimeReact.inputStyle = "outlined";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>
);
