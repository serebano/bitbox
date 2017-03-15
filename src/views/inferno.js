import View from "react";
import { getChangedProps } from "../utils";

/**
 * Component Provider
 */

class Provider extends View.Component {
    getChildContext() {
        return {
            store: this.props.store
        };
    }
    render() {
        return this.props.children;
    }
}

/**
 * Create Component
 * @param {Object} target       [dependencies map]
 * @param {Function} component  [component to render]
 */

function Component(target, component) {
    class CW extends View.Component {
        componentWillMount() {
            const listener = changes => this.update(this.props, changes);
            listener.displayName = component.name;
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
            return View.createElement(component, this.conn.get(this.props));
        }
    }

    return CW;
}

Component.Provider = Provider;

export default Component;
