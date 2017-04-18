import { observable, observe } from "../observer"
import resolve from "./resolve"
import create from "./create"
import map from "./map"
import is from "../utils/is"

const symbol = {
    path: Symbol("bitbox.path"),
    handler: Symbol("bitbox.handler")
}

/**
 * bitbox
 * Create new box
 * @param  {Array}
 * @return {Function}
 */

export default function bitbox() {
    return create(Array.from(arguments))
}

/**
 * Handler methods
 * bitbox[ get, set, has, keys, delete, define ]
 *
 * @param  {Object} target
 * @param  {Function|Array} path
 * @return {Any}
 */

bitbox.get = function get(target, box) {
    return bitbox.resolve(target, box, Reflect.get)
}

bitbox.set = function set(target, box, value) {
    return bitbox.resolve(target, box, Reflect.set, value)
}

bitbox.has = function has(target, box) {
    return bitbox.resolve(target, box, Reflect.has)
}

bitbox.keys = function keys(target, box) {
    return Reflect.ownKeys(bitbox.get(target, box))
}

bitbox.delete = function deleteProperty(target, box) {
    return bitbox.resolve(target, box, Reflect.deleteProperty)
}

bitbox.define = function defineProperty(target, box, descriptor) {
    return bitbox.resolve(target, box, Reflect.defineProperty, descriptor)
}

/**
 * bitbox.path
 * Get array path
 * @param  {Function} box
 * @return {Array}
 */

bitbox.path = function path(box) {
    return is.array(box) ? box : Reflect.get(box, symbol.path)
}

/**
 * Create root
 * @return {Function}
 */

bitbox.root = function root() {
    return new Proxy(create(Array.from(arguments)), {
        get(target, key) {
            return target(key)
        }
    })
}

bitbox.observable = observable
bitbox.observe = observe
bitbox.resolve = resolve
bitbox.map = map

export { map, resolve, observable, observe, symbol }

/* ... */
