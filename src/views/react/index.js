import bitbox from "../../bitbox"
import { Component, createElement } from "react"
import PropTypes from "prop-types"
import Container from "./container"
import h from "./h"
import Debug from "../debug"
import { is } from "../../utils"

function map(target, mapping) {
    return bitbox.map(target, is.function(mapping) ? mapping(bitbox.root()) : mapping)
}

function HOC(component, store, ...args) {
    if (store) return createElement(Container, { store }, createElement(HOC(component), ...args))

    return class extends Component {
        static displayName = `Component(${component.displayName || component.name})`
        static contextTypes = {
            store: PropTypes.object
        }
        componentWillMount() {
            const props = map(Object.assign({ props: this.props }, this.context.store), component.map)

            this.observer = bitbox.observe(render => (render ? component(props, h) : this.forceUpdate()))
        }
        componentWillUnmount() {
            this.observer.unobserve()
        }
        shouldComponentUpdate() {
            return false
        }
        render() {
            return HOC.debug === true ? Debug(this.observer, h) : this.observer.run(true)
        }
    }
}

HOC.debug = false

export default HOC
