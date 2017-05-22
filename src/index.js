import is from "./is"
import factory from "./factory"
import resolve from "./resolve"
import project from "./project"
import observe from "./observe"
import observable from "./observable"
import * as operators from "./operators"

export { default as is } from "./is"
export { default as box } from "./box"
export { default as factory } from "./factory"
export { default as resolve } from "./resolve"
export { default as project } from "./project"
export { default as observe } from "./observe"
export { default as observable } from "./observable"
export { observers } from "./observer/store"
export { operators }

export default factory(bitbox)

function get(object, path) {
    return path.reduce((obj, key, index) => {
        // if (index === path.length - 1) {
        //     return new Proxy(obj, {
        //         get(target, key) {
        //             return Reflect.get(target, key)
        //         }
        //     })
        // }
        return Reflect.get(obj, key)
    }, object)
}

// function proxy(target, mapping) {
//     return new Proxy(target, {
//         get(target, key, receiver) {
//             const value = Reflect.get(target, key, receiver)
//             if (!Reflect.has(target, key, receiver) && Reflect.has(mapping, key)) {
//                 return Reflect.get(mapping, key)
//             }
//
//             return value
//         },
//         set(target, key, value, receiver) {
//             return Reflect.set(target, key, value, receiver)
//         }
//         // has(target, key, receiver) {
//         //     return Reflect.has(target, key, receiver) || Reflect.has(mapping, key)
//         // }
//     })
// }

function create(object = {}, path = [], value) {
    path.reduce((obj, key, index) => {
        if (index === path.length - 1) {
            Reflect.set(obj, key, value)
        } else if (!Reflect.has(obj, key)) {
            const nextKey = path[index + 1]
            Reflect.set(obj, key, is.number(nextKey) ? [] : {})
        }

        return Reflect.get(obj, key)
    }, object)

    return object
}

/**
 * bitbox
 *
 * bitbox() -> observable { }
 * bitbox.count(0) -> observable { count: 0 }
 *
 * bitbox(console.log) -> observable { }
 *
 * @return {Object}
 */

function bitbox(path, ...args) {
    let target = {}

    if (!is.object(args[0]) && !is.func(args[0])) {
        const value = args.shift()
        if (!path.length) path = ["value"]

        target = create(target, path, value)
    } else if (is.object(args[0])) {
        const object = args.shift()

        target = is.func(args[0]) ? object : create(object, path, args.shift())
    }

    if (is.object(args[0])) {
        const mapping = args.shift()

        target = Object.assign(target, mapping)
    }

    target = observable(target)

    if (is.func(args[0])) {
        const observer = args.shift()
        function o() {
            observer.call(this, get(target, path), ...args)
        }
        o.displayName = observer.displayName || observer.name || String(observer)

        observe(o)

        //observe(observer, get(target, path), ...args)
    }

    return target
}
