import bitbox from "./bitbox"
import create from "./create"
import resolve from "./resolve"
import observable from "./observer/observable"
import observe from "./observer/observe"

function construct(target, box, ...args) {
    const instance = Reflect.construct(target, [create.proxy(box.$, true, true), ...args])

    return create.proxy([instance])
}

export default construct
