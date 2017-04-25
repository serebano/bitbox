import bitbox from "../bitbox"
import Debug from "./debug"

function create(View, component) {
    //console.log(`view-create`, component.map)
    const mapping = bitbox.map(component.map, View.app)

    if (!View.observe) {
        function Component(props, context) {
            return component(
                bitbox.proxy(Object.assign({ props }, props, context.store), mapping),
                View.createElement
            )
        }
        Component.displayName = `Component(${component.displayName || component.name})`

        return Component
    }

    return class extends View.Component {
        static displayName = `Component(${component.displayName || component.name})`
        componentWillMount() {
            const target = Object.assign({ props: this.props }, this.props, this.context.store)
            const props = bitbox.proxy(target, mapping)

            this.observer = target.observer = bitbox.observe(
                render =>
                    (render
                        ? component(props, View.createElement)
                        : !this._isUnmounting && this.observer && this.forceUpdate())
            )
        }
        componentWillUnmount() {
            this._isUnmounting = true
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
