import CreateElement from "inferno-create-element"
import Component from "inferno-component"
import create from "./create"
import { is } from "../utils"

HOC.observe = true
HOC.debug = false

function createElement(arg, ...rest) {
    return is.function(arg) && arg.map
        ? CreateElement(HOC(arg), ...rest)
        : CreateElement(arg, ...rest)
}

function HOC(component, store, app) {
    if (store) {
        HOC.app = app
        class Container extends Component {
            static displayName = HOC.observe ? `Observable` : `Static`
            getChildContext() {
                return {
                    store: this.props.store
                }
            }
            render() {
                return this.props.children
            }
        }

        return createElement(Container, { store }, createElement(component))
    }

    return create(
        {
            Component,
            createElement,
            observe: HOC.observe,
            debug: HOC.debug,
            app: HOC.app
        },
        component
    )
}

export default HOC
