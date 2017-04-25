import bitbox from "../bitbox"
import Debug from "./debug"

function create(View, component) {
    if (!View.observe) {
        function Component(props, context) {
            return component(
                bitbox.map(Object.assign({ props }, context.store), component.map, View.app),
                View.createElement
            )
        }

        Component.displayName = `Component(${component.displayName || component.name})`

        return Component
    }

    return class extends View.Component {
        static displayName = `Component(${component.displayName || component.name})`

        componentWillMount() {
            const target = bitbox.map(
                Object.defineProperties(Object.assign({ props: this.props }, this.context.store), {
                    observer: {
                        get: () => this.observer
                    }
                }),
                component.map,
                View.app
            )

            this.observer = bitbox.observe(target, (props, render) => {
                return render
                    ? component(props, View.createElement)
                    : !this._isUnmounting && this.observer && this.forceUpdate()
            })
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
