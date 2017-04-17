import { Component, createElement } from "react";
import PropTypes from "prop-types";
import Container from "./container";
import h from "./h";
import Debug from "../debug";
import { is } from "../../utils";
import bitbox, { observe } from "../../bitbox";

function map(mapping) {
    return bitbox(is.function(mapping) ? mapping(bitbox.root()) : mapping);
}

const root = bitbox(function root(target) {
    return target.context
        ? Object.assign({ props: target.props }, target.context.store)
        : Object.assign({ props: {} }, target);
});

function HOC(component, store, ...args) {
    if (store) {
        return createElement(Container, { store }, createElement(HOC(component), ...args));
    }

    return class extends Component {
        static displayName = `Component(${component.displayName || component.name})`;
        static contextTypes = {
            store: PropTypes.object
        };
        componentWillMount() {
            this.observer = observe((props, render) => {
                return render ? component(props, h) : this.forceUpdate();
            }, root(map(component.map), this));
        }
        componentWillUnmount() {
            this.observer.unobserve();
        }
        shouldComponentUpdate() {
            return false;
        }
        render() {
            if (HOC.debug === true) return Debug(this.observer, h);
            return this.observer.run(true);
        }
    };
}

HOC.debug = false;

export default HOC;
