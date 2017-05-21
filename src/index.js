import is from "./is"
import factory from "./factory"
import resolve from "./resolve"
import project from "./project"
import observe from "./observe"
import observable from "./observable"

export { default as is } from "./is"
export { default as box } from "./box"
export { default as factory } from "./factory"
export { default as resolve } from "./resolve"
export { default as project } from "./project"
export { default as observe } from "./observe"
export { default as observable } from "./observable"

export default factory(bitbox)

function bitbox(path, ...args) {
    const [bit, box] = args

    if (!path.length) {
        if (is.func(bit)) {
            return observe(obj => bit(obj, ...[arguments].slice(1)), observable())
        }

        const obj = observable(bit)

        if (is.func(box)) observe(box, obj)

        return obj
    }

    if (is.object(bit)) {
        const obj = observable(bit)

        if (is.func(box)) {
            observe(box, resolve(obj, path))
            return obj
        }
        if (is.object(box)) return project(obj, box)
        return obj
    }

    if (is.undefined(bit)) {
        const obj = resolve(observable(), path)

        if (is.func(box)) {
            observe(box, obj)

            return obj
        }

        return observable()
    }

    if (is.func(bit)) {
        const obj = resolve(observable(), path)

        observe(bit, obj)

        return obj
    }

    return resolve(observable(), path)
}
