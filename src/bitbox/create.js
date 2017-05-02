import Mapping from "./mapping"
import resolve from "./resolve"
import * as operators from "../operators"
import { is, toPrimitive, toJSON, toArray } from "../utils"

export const symbol = {
    path: Symbol("bitbox.path")
}
/** primitive key transfer */
let __keys, __key
const primitive = keys => {
    __keys = keys
    return () => __key = toPrimitive(keys)
}
const identity = () => "bitbox"
const keyTypes = ["string", "number", "function", "symbol", "object"]
const iterator = keys => Array.prototype[Symbol.iterator].bind(keys)
const validate = key => {
    if (keyTypes.includes(typeof key)) return key
    throw new Error(`Invalid key "${String(key)}" type "${typeof key}"`)
}

/** create operator */
const operator = (operator, args) => {
    if (!is.func(operator)) throw new Error(`Operator must be a function: ${typeof operator}`)
    const argsMap = operator.args || []

    argsMap.slice(1).forEach((arg, idx) => {
        const [label, ...fns] = arg
        if (!fns.some(fn => fn(args[idx])))
            throw new Error(
                `${operator.name} argument [#${idx} ${label}] not valid: ${fns.map(fn => fn.name)}`
            )
    })

    function box(target) {
        return operator.apply(
            operator,
            [target].concat(args).map(arg => (is.box(arg) ? arg(target) : arg))
        )
    }

    box.function = operator
    box.args = args
    box.displayName = `${operator.name}(${toPrimitive(args)})`
    box.toString = () =>
        `function box.${operator.name}(${argsMap.map(([label]) => label).join(", ")}) { [box api] }`

    return box
}

function keysReducer(arr, key, idx, keys) {
    if (is.object(key)) return arr.concat(new Mapping(key))
    validate(key)

    if (is.string(key) && key.startsWith("$"))
        return arr.concat(operator(operators[key.substr(1)], keys.splice(idx + 1)))

    if (is.array(key)) {
        const pk = key[0]
        if (is.func(pk)) return arr.concat(operator(pk, key.splice(1)))
        if (is.string(pk) && pk.startsWith("$"))
            return arr.concat(operator(operators[pk.substr(1)], key.splice(1)))
    }

    if (is.box(key)) return arr.concat(key(...keys.splice(idx + 1)))
    if (is.func(key)) return arr.concat(operator(key, keys.splice(idx + 1)))

    arr.push(key)

    return arr
}

function create(keys) {
    return createProxy(Array.from(keys).reduce(keysReducer, []))
}

function createProxy(keys, isRoot = true) {
    const root = keys
    const bitbox = () => {}

    const proxy = new Proxy(bitbox, {
        apply(target, thisArg, args) {
            if (isRoot) keys = root.slice(0)

            if (args.length && is.complexObject(args[0])) {
                const [target, ...rest] = args
                return resolve(target, keys, ...rest)
            }

            return args.length ? createProxy(args.reduce(keysReducer, keys)) : createProxy(keys)
        },
        get(box, key) {
            if (isRoot) keys = root.slice(0)
            const currentKey = keys[keys.length - 1]

            if (key === "$") return toArray(keys)
            if (key === "apply") return Reflect.get(box, key)
            if (key === "toJSON") return () => toJSON(keys)
            if (key === "displayName") return toPrimitive(keys)
            if (key === Symbol.isConcatSpreadable) return false
            if (key === Symbol.iterator) return iterator(keys)
            if (key === Symbol.toPrimitive) return primitive(keys)
            if (key === Symbol.toStringTag) return identity
            if (currentKey instanceof Mapping) return Reflect.get(currentKey, key)

            keys.push(!is.undefined(__keys) && key === __key ? __keys : key)

            __keys = undefined
            __key = undefined

            return isRoot ? createProxy(keys, false) : proxy
        },
        has(box, key) {
            return true
        }
    })

    return proxy
}

export default create
