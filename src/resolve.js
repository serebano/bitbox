import { is } from "./utils"
import create from "./create"

/**
 * bitbox.resolve
 *
 * @param  {Object} target
 * @param  {Function|Array} box
 * @param  {Function} method
 * @return {Any}
 */

const proxyMap = (resolve.proxies = new WeakMap())

function proxy(target, mapping) {
    if (proxyMap.has(mapping)) return proxyMap.get(mapping)

    if (is.func(mapping.init) && !mapping.initiated) {
        //proxyMap.set(mapping, proxyObj)
        mapping.initiated = true
        const po = proxy(mapping.init.apply(mapping, [target]), mapping)
        proxyMap.set(mapping, po)
        return po
    }

    const proxyObj = new Proxy(mapping, {
        get(map, key, receiver) {
            //if (key === "$") return { target, mapping }
            if (Reflect.has(map, key, receiver)) {
                const value = Reflect.get(map, key, receiver)
                if (is.box(value)) return resolve(target, value)
                if (is.object(value)) return proxy(target, value)

                return is.object(target) && Reflect.has(target, key)
                    ? Reflect.get(target, key)
                    : value
            }
        },
        set(map, key, value, receiver) {
            if (Reflect.has(map, key, receiver)) {
                const box = Reflect.get(map, key, receiver)
                if (is.box(box)) return resolve(target, box, value)

                return is.object(target)
                    ? Reflect.set(target, key, value)
                    : Reflect.set(map, key, value, receiver)
            }

            return Reflect.set(map, key, value, receiver)
        }
    })

    return proxyObj
}

function construct(target, args) {
    const instance = Reflect.construct(target, [create.proxy([], true, true), ...args])

    return instance
}

function resolve(target, box, ...args) {
    if (is.object(box)) return proxy(target, box)
    if (is.box(box)) return resolve(target, Array.from(box), ...args)
    if (is.func(box)) return resolve(target, construct(box, args))

    const [method, ...rest] = args
    const isSet = !is.func(method) || is.box(method)

    return box.reduce((value, key, index, path) => {
        if (is.box(key)) return resolve(value, key)
        if (is.func(key)) return key(value)
        if (is.array(key)) key = resolve(target, key)
        if (is.object(key)) return proxy(value, key)
        //xif (is.undefined(value)) return

        if (args.length && (!path.length || index === path.length - 1)) {
            if (!is.string(key) && !is.number(key)) {
                throw new Error(
                    `[resolve] Invalid key type "${typeof key}" for method "${args[0].name}" [${path.join(".")}]`
                )
            }

            if (isSet) return Reflect.set(value, key, toValue(target)(method))

            return method(value, key, ...rest.map(toValue(target)))
        }

        if (isSet && index < path.length - 1 && !Reflect.has(value, key))
            Reflect.set(value, key, {})

        return Reflect.get(value, key)
    }, target || {})
}

function toValue(target) {
    return arg => (is.box(arg) ? resolve(target, arg) : arg)
}

export default resolve
