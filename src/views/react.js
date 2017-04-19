import React from "react"
import PropTypes from "prop-types"
import create from "./create"
import { is } from "../utils"

HOC.observe = true
HOC.debug = false

function createElement(arg, ...rest) {
    return is.function(arg) && arg.map
        ? React.createElement(HOC(arg), ...rest)
        : React.createElement(arg, ...rest)
}

function HOC(component, store, app) {
    if (store) {
        HOC.app = app
        class Container extends React.Component {
            static displayName = HOC.observe ? `Observable` : `Static`
            static propTypes = {
                store: PropTypes.object.isRequired,
                children: PropTypes.node.isRequired
            }
            static childContextTypes = {
                store: PropTypes.object.isRequired
            }
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

    const Component = create(
        {
            Component: React.Component,
            createElement,
            observe: HOC.observe,
            debug: HOC.debug,
            app: HOC.app
        },
        component
    )

    Component.displayName = `Component(${component.displayName || component.name})`
    Component.contextTypes = {
        store: PropTypes.object
    }

    return Component
}

export default HOC
