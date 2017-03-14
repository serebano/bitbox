import View from "react";
import { compute } from "./tags";
import { getChangedProps } from "./utils";

export default function connectComponent(dependencies, component) {
    //const target = compute(dependencies);

    class Component extends View.Component {
        componentWillMount() {
            const componentListener = changes => this.update(this.props, changes);
            componentListener.displayName = component.name;

            this.conn = this.context.store.connect(dependencies, componentListener, this.props);
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

        // paths(props) {
        //     return this.context.store.resolve.paths(target, ["state"], props);
        // }

        update(props, changes) {
            this.conn.update(props);
            //this.conn.update(this.paths(props))
            this.forceUpdate();
        }

        render() {
            return View.createElement(component, this.conn.get(this.props));
            //return View.createElement(component, this.context.store.get(target, this.props));
        }
    }

    Component.displayName = `${component.displayName || component.name}_Component`;

    Component.contextTypes = {
        store: View.PropTypes.object
    };

    return Component;
}

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
