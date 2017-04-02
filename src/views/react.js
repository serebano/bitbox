import View from "react";
import { getChangedProps } from "../utils";
import bit from "../bit";
import box from "../box";
import BBMap from "../map";

export default function Component(component, store, ...args) {
    if (store) return Provider(bit(store), component, ...args);

    const comp = props => component(props, createElement);
    comp.displayName = `${component.displayName || component.name}_Component`;

    class CW extends View.Component {
        componentWillMount() {
            this.name = component.name;
            this.renderCount = 0;

            const obs = map => this.update(Object.assign({}, map));
            obs.displayName = `${component.displayName || component.name}`;
            obs.toString = () => `${obs.displayName}_Component`;

            this.map = new BBMap(this.context.store, component.map, this.props);

            //console.log(`this.map`, this.map);

            this.conn = box(obs, this.map);

            //this.context.store.components.add(this);
        }
        componentWillReceiveProps(nextProps) {
            const changes = getChangedProps(this.props, nextProps);
            if (changes.length) {
                //this.context.store.props = nextProps;
                this.update(nextProps, changes);
            }
        }
        componentWillUnmount() {
            this._isUnmounting = true;
            this.conn.unobserve();
            //this.context.store.components.delete(this);
            //delete bit.state.renders.get(this.context.store)[this.props.cid];
        }
        shouldComponentUpdate() {
            return false;
        }
        update(props, changes) {
            //console.log(`update`, this, props, changes);
            if (this._isUnmounting) {
                return;
            }
            //if (this.conn)
            //console.log(`update`, this.conn.changed, this.conn.changes, this.conn.paths);
            this._props = Object.assign({}, this.props, props);
            this.forceUpdate();
        }
        render() {
            //bit.state.renders[this.props.cid].set(this.context.store, c => (c || 0) + 1);

            this.renderCount++;
            return View.createElement(comp, this._props);
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

export function Provider(store, component, props, children) {
    window.store = store;
    return createElement(
        Container,
        { store },
        createElement(Component(component), props, children)
    );
}

const _createElement = View.createElement;

View.createElement = (arg, ...args) => {
    if (typeof arg === "function" && arg.map) return _createElement(Component(arg), ...args);

    return _createElement(arg, ...args);
};

export function createElement(arg, ...rest) {
    if (typeof arg === "function" && arg.map) return View.createElement(Component(arg), ...rest);

    return View.createElement(arg, ...rest);
}
