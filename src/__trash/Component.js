import View from "react";
import { getChangedProps } from "./utils";

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

    CW.displayName = `${component.displayName || component.name}_Component`;
    CW.contextTypes = {
        store: View.PropTypes.object
    };

    return CW;
}

export default Component;

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
