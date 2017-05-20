import is from "./is"
import observe from "./observe"
import project from "./project"

/**
 * bitbox.resolve
 *
 * @param  {Object} target
 * @param  {Function|Array} box
 * @param  {Function} method
 * @return {Any}
 */

function resolve(target, args, value) {
    return Array.from(args).reduce((object, key, index, path) => {
        if (is.array(key)) key = resolve(target, key)
        if (is.object(key)) return project(object, key)
        if (is.box(key)) return resolve(object, key)
        if (is.func(key)) return key(object)

        if (arguments.length === 3 && index === path.length - 1)
            return Reflect.set(object, key, value)

        if (!Reflect.has(object, key) && index < path.length - 1) Reflect.set(object, key, {})

        return Reflect.get(object, key)
    }, target)
}

export default resolve

// function proxy(target = {}, mapping, path) {
//     return new Proxy(mapping, {
//         get(map, key, receiver) {
//             if (key === "$") return { path, target, mapping, isObservable: is.observable(target) }
//
//             if (is.string(key) && key.startsWith("$")) {
//                 return fn => {
//                     const k = key.substr(1)
//                     const mapK = Reflect.get(map, k, receiver)
//                     if (is.box(mapK)) return observe(() => fn(resolve(target, mapK)))
//                     return observe(() => fn(Reflect.get(target, k)))
//                 }
//             }
//
//             const targetValue = Reflect.get(target, key)
//
//             if (is.undefined(targetValue)) {
//                 const mapValue = Reflect.get(map, key, receiver)
//
//                 if (is.box(mapValue)) return resolve(target, mapValue)
//                 if (is.object(mapValue)) return proxy(target, mapValue, path)
//
//                 return mapValue
//             }
//
//             return targetValue
//         },
//         set(mapping, key, value) {
//             if (Reflect.has(mapping, key)) {
//                 const mapValue = Reflect.get(mapping, key)
//                 if (is.box(mapValue)) return resolve(target, mapValue, value)
//             }
//
//             Reflect.set(target, key, value)
//
//             return Reflect.set(mapping, key, value)
//         }
//     })
// }
