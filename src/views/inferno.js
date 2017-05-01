import bitbox, { map } from "../bitbox"
import { is } from "../utils"
import CreateElement from "inferno-create-element"
import Component from "inferno-component"
import Inferno from "inferno"

export function createElement(tag, ...rest) {
    return is.array(tag)
        ? CreateElement(createComponent(tag), ...rest)
        : is.func(tag) && is.undefined(tag.prototype.render)
              ? CreateElement(props => tag(props, createElement), ...rest)
              : CreateElement(tag, ...rest)
}

export function createComponent([mapping, comp]) {
    const component = bitbox(
        map(mapping, {
            props: ["props"],
            state: ["context", "state"],
            signals: ["context", "signals"],
            observer: ["observer"]
        }),
        props => comp(props, createElement)
    )

    const Component = HOC.observable ? statefull(component) : stateless(component)
    Component.displayName = `Component(${comp.displayName || comp.name})`

    return Component
}

function stateless(component) {
    return function(props, context) {
        return component({ props, context })
    }
}

function statefull(component) {
    return class extends Component {
        componentWillMount() {
            this.observer = bitbox.observe((target, render) => {
                return render ? component(target) : target.observer && target.forceUpdate()
            }, this)
        }
        componentWillUnmount() {
            this.observer.off()
        }
        shouldComponentUpdate() {
            return false
        }
        render() {
            return HOC.debug === true
                ? Debug(this.observer, createElement)
                : this.observer.run(true)
        }
    }
}

function HOC(component, target) {
    if (target) {
        return createElement(
            class extends Component {
                getChildContext() {
                    return {
                        state: bitbox.observable(this.props.state),
                        signals: this.props.signals
                    }
                }
                render() {
                    return this.props.children
                }
            },
            target,
            createElement(component, target.props)
        )
    }

    return createComponent(component)
}

export const render = (component, selector) =>
    Inferno.render(component, document.querySelector(selector))

HOC.debug = false
HOC.observable = true
HOC.createElement = createElement
HOC.createComponent = createComponent
HOC.render = render

export default HOC
