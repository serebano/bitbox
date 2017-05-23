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
        return Reflect.get(obj, key)
    }, object)
}

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

export function bitbox(path, target, observer, ...args) {
    if (!path.length) {
        const $observable = observable(target)

        let result
        const $observer = observe(function box() {
            if (is.func(observer)) {
                const changes = $observer ? $observer.changes : []
                !$observer && console.log("REGISTER", observer.displayName || observer.name, args)
                result = observer.apply(this, [$observable, ...args])
            }
        })
        $observer.name = observer && observer.name
        //operators.print({ path, target, observer, args, $observable, $observer, context: this })
        return is.func(result) ? result : $observable
    }

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
    }

    return target
}
