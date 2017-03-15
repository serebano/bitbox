import React from "react";
import { render } from "react-dom";
import component, { Container } from "../../views/react";

import store from "./store";
import App from "./components/app";

const createElement = React.createElement;
React.createElement = (tag, ...args) => {
    if (typeof tag === "function" && tag.connect) return createElement(component(tag), ...args);

    return createElement(tag, ...args);
};

render(
    <Container store={store}>
        <App />
    </Container>,
    document.querySelector("#root")
);
