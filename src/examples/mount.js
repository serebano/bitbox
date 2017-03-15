import React from "react";
import { render } from "react-dom";
import component, { Container } from "../views/react";

const createElement = React.createElement;

React.createElement = (tag, ...args) => {
    if (typeof tag === "function" && tag.connect) return createElement(component(tag), ...args);

    return createElement(tag, ...args);
};

function mount(App, store, selector) {
    window.App = App;
    window.store = store;
    console.info("mount", App.name, { App, store });
    render(
        <Container store={store}>
            <App />
        </Container>,
        document.querySelector(selector)
    );
}

export default mount;
