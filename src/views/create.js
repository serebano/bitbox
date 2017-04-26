import bitbox from "../bitbox"
import Debug from "./debug"

function create(View, component) {
    if (!View.observe) {
        return function Component(props, context) {
            return component(
                bitbox.map(Object.assign({ props }, context.store), component.map, View.app),
                View.createElement
            )
        }
    }

    return class Component extends View.Component {
        componentWillMount() {
            const target = Object.assign({ props: this.props }, this.context.store)

            this.observer = target.observer = bitbox.observe(
                bitbox.map(target, component.map, View.app),
                (props, render) => {
                    return render
                        ? component(props, View.createElement)
                        : !this._isUnmounting && this.observer && this.forceUpdate()
                }
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
