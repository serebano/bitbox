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

function bitbox(bit, box) {
    if (arguments.length === 2) {
        const obj = observable(bit)
        const obs = observe(() => box(obj))

        return { obj, obs }
    }

    if (arguments.length === 1) {
        if (is.func(bit)) {
            const obj = observable()
            const obs = observe(() => bit(obj))

            return { obj, obs }
        }
    }

    if (is.object(bit)) {
        return observable(bit)
    }

    return observable()
}

export default factory(function bb(path, ...args) {
    if (!path.length) return bitbox(...args)

    const [bit, box] = args

    if (is.object(bit)) {
        const obj = observable(bit)
        if (is.func(box)) {
            const obs = observe(() => box(resolve(obj, path)))
            return { obj, obs }
        }
        return { obj }
    }

    if (is.undefined(bit)) {
        const obj = resolve(observable(), path)
        if (is.func(box)) {
            const obs = observe(() => box(obj))
            return { obj, obs }
        }
        return { obj }
    }

    if (is.func(bit)) {
        const obj = resolve(observable(), path)
        const obs = observe(() => bit(obj))

        return { obj, obs }
    }

    return resolve(observable(), path)
})
