import View from "react";
import { is, getChangedProps } from "../utils";
import { observe } from "../observer";

Component.debug = false;

export default function Component(component, store, ...args) {
    if (store) return Provider(store, component, ...args);

    const comp = props => component(props, createElement);
    comp.displayName = `${component.displayName || component.name}_Component`;

    class CW extends View.Component {
        componentWillMount() {
            const getters = {
                props: this.props,
                state: this.context.store.state,
                signals: this.context.store.signals
            };

            this.observer = observe(() => {
                this.__props = Object.assign(
                    {},
                    this.props,
                    Object.keys(component.map).reduce(
                        (map, key) => {
                            const value = component.map[key];
                            map[key] = is.box(value) || is.compute(value) ? value(getters) : value;
                            return map;
                        },
                        {}
                    )
                );

                this.update();
            });

            this.observer.name = component.displayName || component.name;
        }
        componentWillReceiveProps(nextProps) {
            const changes = getChangedProps(this.props, nextProps);
            if (changes.length) {
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
        render() {
            if (Component.debug === true) {
                return View.createElement(
                    "div",
                    {},
                    View.createElement(comp, this.__props),
                    View.createElement(boxdebug, this.observer)
                );
            }
            return View.createElement(comp, this.__props);
        }
    }

    CW.displayName = `${component.displayName || component.name}_Component`;
    CW.contextTypes = {
        store: View.PropTypes.object
    };

    return CW;
}

function boxdebug(observer) {
    return View.createElement(
        "pre",
        {
            className: observer.name,
            style: {
                fontSize: 12,
                padding: 8,
                margin: 0,
                color: `#555`,
                background: `#f4f4f4`,
                borderTop: `1px solid #aaa`
            }
        },
        JSON.stringify(
            {
                name: observer.name,
                changes: observer.changes.map(String),
                changed: observer.changed,
                paths: observer.paths.map(path => path.map(String).join("."))
            },
            null,
            2
        )
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
