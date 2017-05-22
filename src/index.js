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

const get = (object, path) => path.reduce((obj, key) => Reflect.get(obj, key), object)

const create = (object = {}, path = [], value) => {
    path.reduce((obj, key, index) => {
        if (index === path.length - 1) Reflect.set(obj, key, value)
        else if (!Reflect.has(obj, key)) Reflect.set(obj, key, {})

        return Reflect.get(obj, key)
    }, object)
    return object
}

function bitbox(path, ...args) {
    let target = {}

    if (!is.object(args[0]) && !is.func(args[0])) {
        const value = args.shift()
        if (!path.length) path.push("value")

        target = observable(create({}, path, value))
    } else if (is.object(args[0])) {
        const object = args.shift()
        target = observable(object)
    }

    if (is.func(args[0])) {
        const observer = args.shift()
        observe(() => observer(get(target, path), ...args))
    }

    return target

    args = args.reduce((arr, key, idx) => {
        if (is.func(key))
            return arr.concat(key(get(target, path.slice(1)), ...args.splice(idx + 1)))

        return arr.concat(key)
    }, [])

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
