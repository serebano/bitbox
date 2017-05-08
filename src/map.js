import create from "./create"
import mapping from "./mapping"
import observable from "./observer/observable"
import is from "./operators/is"
import * as operators from "./operators"

function map(target, mapping, ...args) {
    if (arguments.length === 1) return construct(target)
    return resolve(construct(mapping, ...args), {
        get(mapping, key) {
            if (Reflect.has(mapping, key)) {
                const value = Reflect.get(mapping, key)
                return is.box(value)
                    ? value(target)
                    : Reflect.has(target, key) ? Reflect.get(target, key) : value
            }
            return Reflect.get(target, key)
        },
        set(mapping, key, value) {
            if (Reflect.has(mapping, key)) {
                const box = Reflect.get(mapping, key)
                return is.box(box) ? box(target, value) : Reflect.set(target, key, value)
            }
            return Reflect.set(target, key, value)
        }
    })
}

function box(input, ...args) {
    const mapping = map.construct(input, ...args)
    return new Proxy(
        function mapbox(target, ...args) {
            return map.resolve(target, mapping)
        },
        {
            get(box, key) {
                return Reflect.get(mapping, key)
            },
            set(box, key, value) {
                return Reflect.set(mapping, key, value)
            }
        }
    )
}

function resolve(target, mapping) {
    return new Proxy(mapping, {
        get(mapping, key) {
            if (Reflect.has(mapping, key)) {
                const value = Reflect.get(mapping, key)
                return is.box(value)
                    ? value(target)
                    : Reflect.has(target, key) ? Reflect.get(target, key) : value
            }
            return Reflect.get(target, key)
        },
        set(mapping, key, value) {
            if (Reflect.has(mapping, key)) {
                const box = Reflect.get(mapping, key)
                return is.box(box) ? box(target, value) : Reflect.set(target, key, value)
            }
            return Reflect.set(target, key, value)
        }
    })
}

function construct(input, ...args) {
    if (mapping.has(input)) {
        const map = mapping.get(input)
        return map
    }
    if (is.func(input)) {
        const map = input(create([]), ...args)
        mapping.set(input, map)
        return map
    }
    mapping.set(input, input)
    return input
}

map.box = box
map.resolve = resolve
map.construct = construct

export default map
