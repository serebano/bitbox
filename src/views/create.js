import bitbox from "../bitbox"
import { map } from "../operators"
import Debug from "./debug"

function create(View, component) {
    const mapping = map(component.map)

    if (!View.observe) {
        function Component(props, context) {
            return component(mapping(Object.assign({ props }, context.store)), View.createElement)
        }
        Component.displayName = `Component(${component.displayName || component.name})`

        return Component
    }

    return class extends View.Component {
        static displayName = `Component(${component.displayName || component.name})`
        componentWillMount() {
            const props = mapping(Object.assign({ props: this.props }, this.context.store))
            this.observer = bitbox.observe(
                render =>
                    (render
                        ? component(props, View.createElement)
                        : this.observer && this.forceUpdate())
            )
        }
        componentWillUnmount() {
            this.observer.unobserve()
        }
        shouldComponentUpdate() {
            return false
        }
        render() {
            return View.debug === true
                ? Debug(this.observer, View.createElement)
                : this.observer.run(true)
        }
    }
}

export default create
