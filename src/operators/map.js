import curry from "../curry"
import type from "./type"

export function mapObj(fn, functor) {
    return Object.keys(functor).reduce((acc, key) => {
        acc[key] = fn(functor[key], key)
        return acc
    }, {})
}

export function mapArr(fn, functor) {
    let idx = 0
    let len = functor.length
    let result = Array(len)

    while (idx < len) {
        result[idx] = fn(functor[idx])
        idx += 1
    }

    return result
}

export default curry(function map(fn, functor) {
    return type(functor) === "Object" ? mapObj(fn, functor) : mapArr(fn, functor)
})

// export default curry(function map(fn, functor) {
//     switch (Object.prototype.toString.call(functor)) {
//         case "[object Function]":
//             return function mapFn() {
//                 return fn.call(this, functor.apply(this, arguments))
//             }
//         case "[object Object]":
//             return Object.keys(functor).reduce(function(acc, key) {
//                 acc[key] = fn(functor[key], key)
//                 return acc
//             }, {})
//         default:
//             return _map(fn, functor)
//     }
// })
//
// function _map(fn, functor) {
//     var idx = 0
//     var len = functor.length
//     var result = Array(len)
//     while (idx < len) {
//         result[idx] = fn(functor[idx])
//         idx += 1
//     }
//     return result
// }
