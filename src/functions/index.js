import arity from "./arity"
import curryN from "./curryN"
import curry from "./curry"
import __ from "./__"
import map from "./map"
import rearg from "./rearg"
import filter from "./filter"
import invoker from "./invoker"
import methods from "./methods"

export { default as __ } from "./__"
export { default as arity } from "./arity"
export { default as curryN } from "./curryN"
export { default as curry } from "./curry"
export { default as map } from "./map"
export { default as filter } from "./filter"
export { default as methods } from "./methods"
export { default as rearg } from "./rearg"
export { default as invoker } from "./invoker"
export { default as type } from "./type"

export const prop = curry(function prop(key, obj) {
    return obj[key]
})

export const flip = rearg([1, 0])

export const mapFields = curry(function mapFields(keys, fn, obj) {
    for (var i = 0; i < keys.length; ++i) {
        obj[keys[i]] = fn(obj[keys[i]])
    }
    return obj
})

export const pipe = function pipe(functions) {
    return v => functions.reduce((v, fn) => fn(v), v)
}

export const apply = curry(function apply(fn, arr) {
    return fn.apply(this, arr)
})

export const omit = curry(function omit(keys, obj) {
    for (let i = 0; i < keys.length; ++i) {
        delete obj[keys[i]]
    }
    return obj
})

export const to = curry(function to(toMap, obj) {
    for (const key in toMap) {
        const f = toMap[key]
        obj[key] = Array.isArray(f) ? pipe(f)(obj) : f(obj)
    }
    return obj
})

export const mapTo = curry(function mapTo(fromToMap, obj) {
    map(function(to, fromKey) {
        const fromVal = obj[fromKey]
        map(function(fns, toKey) {
            obj[toKey] = Array.isArray(fns) ? pipe(fns)(fromVal) : fns(fromVal) // pipe(fns)(fromVal)
        }, to)
    }, fromToMap)
    return obj
})
