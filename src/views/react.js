import View from "react";
import { getChangedProps } from "../utils";
import bit from "../bit";
import box from "../box";

export default function Component(component, store, ...args) {
    if (store) return Provider(bit(store), component, ...args);

    const comp = props => component(props, createElement);

    class CW extends View.Component {
        componentWillMount() {
            this.conn = box(map => this.update(map), component.map || {}, this.context.store);
        }
        componentWillReceiveProps(nextProps) {
            const changes = getChangedProps(this.props, nextProps);
            if (changes.length) this.update(nextProps, changes);
        }
        componentWillUnmount() {
            this._isUnmounting = true;
            this.conn.unobserve();
        }
        shouldComponentUpdate() {
            return false;
        }
        update(props, changes) {
            this.map = Object.assign({}, this.props, props);
            this.forceUpdate();
        }
        render() {
            return View.createElement(comp, this.map);
        }
    }

    CW.displayName = `${component.displayName || component.name}_Component`;
    CW.contextTypes = {
        store: View.PropTypes.object
    };

    return CW;
}

export function Provider(store, component, props, children) {
    window.$store = store;
    return createElement(
        Container,
        { store },
        createElement(Component(component), props, children)
    );
}

/**
 * Container
 */

export class Container extends View.Component {
    getChildContext() {
        return {
            store: this.props.store
        };
    }
    render() {
        return this.props.children;
    }
}

Container.propTypes = {
    store: View.PropTypes.object.isRequired,
    children: View.PropTypes.node.isRequired
};

Container.childContextTypes = {
    store: View.PropTypes.object.isRequired
};

const _createElement = View.createElement;

View.createElement = (arg, ...args) => {
    if (typeof arg === "function" && arg.map) return _createElement(Component(arg), ...args);

    return _createElement(arg, ...args);
};

export function createElement(arg, ...rest) {
    if (typeof arg === "function" && arg.map) return View.createElement(Component(arg), ...rest);

    return View.createElement(arg, ...rest);
}
