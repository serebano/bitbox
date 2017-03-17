import View from "react";
import { getChangedProps } from "../utils";

export function Provider(store, component, props, children) {
    window.store = store;
    return createElement(Container, { store }, createElement(component, props, children));
}

export function Component(component, store, ...args) {
    if (store) {
        return Provider(store, component, ...args);
    }

    const target = component.connect;
    const comp = props => component(props, createElement);

    class CW extends View.Component {
        componentWillMount() {
            const listener = changes => this.update(this.props, changes);
            listener.displayName = component.displayName || component.name;
            this.conn = this.context.store.connect(target, listener, this.props);
        }
        componentWillReceiveProps(nextProps) {
            const changes = getChangedProps(this.props, nextProps);

            if (changes.length) this.update(nextProps, changes);
        }
        componentWillUnmount() {
            this._isUnmounting = true;
            this.conn.remove();
        }

        shouldComponentUpdate() {
            return false;
        }
        update(props, changes) {
            this.conn.update(props);
            this.forceUpdate();
        }
        render() {
            return View.createElement(comp, this.conn.get(this.props));
        }
    }

    CW.displayName = `${component.displayName || component.name}_Component`;
    CW.contextTypes = {
        store: View.PropTypes.object
    };

    return CW;
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
    if (typeof arg === "function" && arg.connect) return _createElement(Component(arg), ...args);

    return _createElement(arg, ...args);
};

export function createElement(arg, ...rest) {
    if (typeof arg === "function" && arg.connect)
        return View.createElement(Component(arg), ...rest);

    return View.createElement(arg, ...rest);
}
