import resolve from "./resolve"
import is from "./is"
import { getArgNames, toPrimitive } from "./utils"
import __, { placeholder } from "./__"
import { first, last, has, get, apply, pipe, compose } from "./operators"
import curry from "./curry"

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}

function box(object) {
    function executor(fn, keys, currentKey) {
        const eProxy = new Proxy(fn, {
            apply(fn, ctx, args) {
                if (!args.length) return eProxy
                if (currentKey) args.unshift(currentKey)

                const argsLen = args.length
                const fnLen = fn.length
                const placeholders = args.filter(is.placeholder)
                const placeholdersLen = placeholders.length

                console.group(fn.displayName || fn.name, fn.argNames)

                keys.map((key, idx) => console.log(`[%c KEY #${idx}%c ]`, `color:lightblue`, "", key))
                args.map((arg, idx) =>
                    console.log(
                        `[%c ARG %c#${idx}%c ]`,
                        `color:grey`,
                        `color:${is.placeholder(arg) ? "red" : "green"}`,
                        "",
                        arg
                    )
                )

                if (!placeholdersLen && argsLen >= fnLen) {
                    if (!keys.length) {
                        console.groupEnd()
                        return fn.apply(ctx, args)
                    }

                    const target = args.pop()
                    const result = fn.apply(ctx, args)

                    const rkeys = keys.concat(result)
                    const r = pipe(rkeys)(target)

                    console.log(`[R-KEYS]`, rkeys)
                    args.map((arg, idx) => console.log(`[%c ARG %c#${idx}%c ]`, `color:grey`, "color:lime", "", arg))
                    console.warn(`[resolve]`, r)
                    console.groupEnd()

                    return r
                }

                const result = fn.apply(ctx, args)

                console.log(`[%c RETURN%c ]`, `color:magenta`, "", result, result && result.length)
                console.groupEnd()

                return executor(result, keys)
            },
            get(fn, key) {
                if (key === "$") return fn
                if (key === Symbol.toPrimitive) return () => fn.toString()

                console.log(`[%cRUN%c/GET]`, `color:orange`, "", currentKey, key, keys)
                if (Reflect.has(fn, key)) return Reflect.get(fn, key)
                if (currentKey) return getter(keys.concat(get(currentKey)))[key]
                return getter(keys.concat(fn))[key]
            },
            has(fn, key) {
                return Reflect.has(fn, key)
            }
        })
        return eProxy
    }

    function getter(keys = [], currentKey) {
        const proxy = new Proxy(object, {
            get(target, key) {
                if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].apply(keys)
                if (key === Symbol.toPrimitive) return () => keys.map(key => key.toString()).join(".")

                if (key === "$") return keys
                if (key === "curry") return executor(curry, keys)
                if (key === "__") return executor(__, keys)

                if (Reflect.has(target, key)) {
                    const fn = Reflect.get(target, key)
                    console.log(`[%cGET%c]`, "color: #61afef;", "", fn)

                    if (!is.func(fn)) return fn
                    if (is.placeholder(fn)) return fn

                    return executor(fn, keys)
                }

                const nextKey = !is.undefined(primitive.__keys) && key === primitive.__key ? primitive.__keys : key

                delete primitive.__key
                delete primitive.__keys

                console.log(`[%cGET%c]`, "color: #61afef;", "", nextKey)

                return executor(get(nextKey), keys)
                //return executor(get, keys, nextKey)
            },
            has(target, key) {
                if (key === "curry") return true
                if (key === "__") return true
                return Reflect.has(target, key)
            },
            set(target, key, value) {
                if (is.func(value)) {
                    return Reflect.set(target, key, curry(value))
                }
            }
        })

        return proxy
    }

    return getter()
}

export default box

/*
g
    .add(__(add(20)),__(3))
    .add(30)
    .as('num')
    .tap(set('num', add(2)))
    .observable
    .tap(observe(log))
    (null).num++
*/

// const log = curry(a => console.log(a))
// const pairArgs = (idxs, args) => idxs.map(i => args[i])
// const c2 = (f, arr = []) => (...args) => (a => (a.length === f.length ? f(...a) : c2(f, a)))([...arr, ...args])
//
// function c1(f, ...args) {
//     if (args.length >= f.length) return f(...args)
//     return (...next) => c1(f, ...args, ...next)
// }
//
// const f = c1(c1((a, b, c) => a + b * c))
// console.log(f(1)(2)(3))
//
// function newFn(displayName, argNames, targetFn) {
//     const fn = (...args) => targetFn(...args)
//     fn.displayName = displayName
//     fn.argNames = argNames
//     fn.toString = () => `${displayName}(${argNames}) => (${targetFn})(${argNames})`
//     return curry.to(argNames.length, fn, argNames)
// }
//
// function mapArgs(fn, idxs) {
//     const argNames = idxs.map(idx => fn.argNames[idx])
//     const fx = (...args) => fn(...idxs.map(idx => args[idx]))
//     fx.toString = () => `(${argNames}) => ${fn.toString([], true)}`
//     print({ idxs, argNames, fnArgNames: fn.argNames })
//     return curry.to(fn.length, fx, argNames)
// }
//
// function func(fn, ...args) {
//     const fnArgNames = fn.argNames || getArgNames(fn)
//     const length = args.length
//     const fArgNames = []
//     const tArgNames = []
//     const tArgIdx = []
//
//     const map = args.reduce((obj, name, index) => {
//         let tName = name
//         if (is.array(name)) {
//             tName = name[0]
//             name = name[1]
//         }
//
//         const tArgIndex = fnArgNames.includes(tName)
//             ? fnArgNames.indexOf(tName)
//             : tArgIdx.length ? args.length - sum(tArgIdx) : 0
//
//         const tArgName = fnArgNames[index]
//         fArgNames[index] = name
//         tArgNames[tArgIndex] = name
//         tArgIdx[tArgIndex] = index
//
//         obj[index] = {
//             name,
//             tName,
//             tArgName,
//             tArgIndex
//         }
//         return obj
//     }, [])
//
//     console.group(`box.from(%c${fn.displayName || fn.name || fn}%c)`, `color:#61afef`, ``)
//     console.log(...args)
//
//     map.map((a, i) =>
//         console.log(
//             `[%c${i}%c] %c${a.name}%c %c(${a.tArgName})%c %c->%c [%c${a.tArgIndex}%c]%c${a.tName}%c`,
//             `color:#d19a66`,
//             ``,
//             `color:#e06c75`,
//             ``,
//             `color:#aaa;opacity:0.3`,
//             ``,
//             `color:#c678dd`,
//             ``,
//             `color:#d19a66`,
//             ``,
//             `color:#e06c75`,
//             ``
//         )
//     )
//     console.groupEnd()
//     function fx(...args) {
//         const $args = pairArgs(tArgIdx, args)
//         //log(arguments)
//         //console.group(`%c${fx.displayName}%c${fx}`, `color:#61afef`, ``)
//         // log(fArgNames)
//         // log(tArgNames)
//         // log(fnArgNames)
//         // map.map((a, i) =>
//         //     console.log(
//         //         `[%c${i}%c] %c${a.name}%c %c(${a.tArgName})%c %c->%c [%c${a.tArgIndex}%c]%c${a.tName}%c`,
//         //         `color:#d19a66`,
//         //         ``,
//         //         `color:#e06c75`,
//         //         ``,
//         //         `color:#aaa;opacity:0.3`,
//         //         ``,
//         //         `color:#c678dd`,
//         //         ``,
//         //         `color:#d19a66`,
//         //         ``,
//         //         `color:#e06c75`,
//         //         ``
//         //     )
//         // )
//
//         console.group(`apply`)
//         console.log(fx.displayName, args)
//         console.log(fn.displayName, $args)
//
//         const res = fn.apply(this, $args)
//         //console.log(`input(${"%o".repeat(length)}) %c=>%c`, ...arguments, `color:#c678dd`, ``)
//         console.log(res)
//         //console.groupEnd()
//
//         console.groupEnd()
//
//         return res
//     }
//
//     fx.displayName = "$" + (fn.displayName || fn.name)
//     fx.toString = () => `(${map.map(a => a.name).join(", ")}) => ${fn.displayName}(${tArgNames.join(", ")})`
//
//     //print(map)
//     // console.log(`${fx.displayName}`, ...pair)
//     // log(tArgNames)
//     // log(fnArgNames)
//     // log(tArgIdx)
//
//     const f = curry.to(length, fx, map.map(a => a.name))
//
//     f._ = {
//         fn,
//         displayName: fx.displayName,
//         get target() {
//             return fn._
//         },
//         map,
//         tArgIdx,
//         tArgNames,
//         fnArgNames
//     }
//     Object.defineProperty(f, "d", {
//         get: () => {
//             print(f._)
//             log(f._)
//         }
//     })
//
//     return f
// }
//
// function debug(fn) {
//     const o = {
//         length: fn.length,
//         name: fn.name,
//         displayName: fn.displayName,
//         isCurryable: is.curryable(fn),
//         argNames: fn.argNames || getArgNames(fn),
//         received: fn.args,
//         expected: fn.rest
//     }
//     print(o)
//     console.log(o)
// }
//
// curry.func = func
// curry.d = debug
//
// export default curry
