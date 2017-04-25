import observable from "../observer/observable"
import observe from "../observer/observe"
import resolve from "./resolve"
import create from "./create"
import proxy from "./proxy"
import map from "./map"
import is from "../utils/is"

const symbol = {
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
    return Reflect.apply(
        bitbox.resolve(target, box),
        target,
        args.map(arg => (is.box(arg) ? arg(target) : arg))
    )
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

bitbox.observable = observable
bitbox.observe = observe
bitbox.resolve = resolve
bitbox.map = map
bitbox.proxy = proxy

export { map, resolve, observable, observe, symbol }

/* ... */
