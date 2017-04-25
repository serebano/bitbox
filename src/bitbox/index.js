import * as observer from "./observer"
import resolve from "./resolve"
import create from "./create"
import Mapping from "./map"
import is from "../utils/is"

export const symbol = {
    path: Symbol("bitbox.path")
}

/**
 * bitbox
 * Create new box
 * @param  {Array}
 * @return {Function}
 */

export default function bitbox() {
    return create(arguments)
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
    return Reflect.ownKeys(bitbox.resolve(target, box))
}

bitbox.delete = function deleteProperty(target, box) {
    return bitbox.resolve(target, box, Reflect.deleteProperty)
}

bitbox.define = function defineProperty(target, box, descriptor) {
    return bitbox.resolve(target, box, Reflect.defineProperty, descriptor)
}

bitbox.apply = function apply(target, box, args) {
    return Reflect.apply(bitbox.resolve(target, box), target, args)
}

/**
 * bitbox.map
 * @param  {Object} target
 * @param  {Object} map
 * @param  {Object|Function} root
 * @return {Object}
 */

bitbox.map = function map(target, map, root) {
    return new Proxy(new Mapping(map, root), {
        get(mapping, key) {
            if (Reflect.has(mapping, key)) return bitbox.resolve(target, Reflect.get(mapping, key))
            if (Reflect.has(mapping, "*"))
                return bitbox.resolve(target, Reflect.get(mapping, "*")(key))
        },
        set(mapping, key, value) {
            if (Reflect.has(mapping, key))
                return bitbox.resolve(target, Reflect.get(mapping, key), Reflect.set, value)
            if (Reflect.has(mapping, "*"))
                return bitbox.resolve(target, Reflect.get(mapping, "*")(key), Reflect.set, value)
        }
    })
}

bitbox.observable = function observable(target) {
    return observer.observable(target)
}

bitbox.observe = function observe(target, box) {
    return observer.observe(box, target)
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
    return new Proxy(create(arguments), {
        get(box, key) {
            return box(key)
        }
    })
}

bitbox.resolve = resolve

/* ... */
