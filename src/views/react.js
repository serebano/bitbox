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
            const c = this;
            this.name = component.name;
            this.target = bit({
                get props() {
                    return c.props;
                },
                state: this.context.store.state,
                signals: this.context.store.signals
            });
            this.mapped = new BBMap(this.target, component.map);

            const observer = () => this.update({ ...this.mapped });
            observer.displayName = `${component.displayName || component.name}`;

            this.observer = box(observer);
        }
        componentWillReceiveProps(nextProps) {
            const changes = getChangedProps(this.props, nextProps);
            if (changes.length) {
                //this.target.props = nextProps;
                this.update(nextProps, changes);
            }
        }
        componentWillUnmount() {
            this._isUnmounting = true;
            this.observer.unobserve();
        }
        shouldComponentUpdate() {
            return false;
        }
        update(props, changes) {
            if (this._isUnmounting) return;
            this.forceUpdate();
        }
        getProps() {
            const $observer = this.observer
                ? {
                      ...this.observer,
                      name: this.observer.fn.displayName,
                      keys: this.observer.keys.length,
                      changes: this.observer.changes.slice(),
                      paths: this.observer.paths.map(path => path.map(String).join("."))
                  }
                : {};
            return Object.assign(
                {
                    $observer
                },
                this.props,
                this.mapped
            );
        }
        render() {
            return View.createElement(comp, this.getProps());
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
