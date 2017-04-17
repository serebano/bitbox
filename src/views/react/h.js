import { createElement } from "react";
import Component from ".";

function h(arg, ...rest) {
    if (typeof arg === "function" && arg.map) return createElement(Component(arg), ...rest);

    return createElement(arg, ...rest);
}

export default h;
