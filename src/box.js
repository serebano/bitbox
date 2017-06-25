import resolve from "./resolve"
import is from "./is"
import { getArgNames } from "./utils"
import __, { placeholder } from "./__"
import { last, has, get, apply } from "./operators"

function box(object) {
    function executor(fn, keys, currentKey) {
        //console.log(`[%cexecutor%c]`, `color:#c00`, "", fn, keys, currentKey)
        return new Proxy(fn, {
            apply(fn, ctx, args) {
                const withKey = currentKey && fn.argNames && fn.argNames[0] === "key"
                const allArgs = withKey ? [currentKey].concat(args) : args
                const argsLen = allArgs.length
                const fnLen = fn.length

                if (fnLen <= argsLen && !is.placeholder(last(args))) {
                    const target = allArgs.pop()
                    const result = fn.apply(ctx, allArgs)
                    const path = keys.concat(result)

                    console.log(`[%cRESOLVE%c]`, `color:green`, "", path, target, allArgs)

                    return resolve(path, target)
                }

                const result = fn.apply(ctx, allArgs)
                console.log(`[%cRUN%c]`, `color:orange`, "", fn, allArgs, "->", result)

                return fnLen <= argsLen ? result : executor(result, keys)
                //return getter(keys.concat(result), currentKey)
            },
            get(fn, key) {
                if (Reflect.has(fn, key)) return Reflect.get(fn, key)
                //if (key === placeholder) return get(key, fn)
                console.log(`[%cRUN%c/GET]`, `color:orange`, "", key, `[key=${currentKey}]`)

                if (currentKey) return getter(keys, currentKey)[key]
                return get(key, getter(keys.concat(fn)))
            },
            has(fn, key) {
                return Reflect.has(fn, key)
            }
        })
    }

    function getter(keys = [], currentKey) {
        const proxy = new Proxy(object, {
            get(target, key) {
                //console.log(`[%cGET%c] g.${keys.map(String).join(".")} -> ${key}`, "color: #61afef;", "")
                console.log(`[GET]`, key)
                keys.map((key, idx) => console.log(idx, key))

                if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].apply(keys)
                if (key === Symbol.toPrimitive) return () => "box(" + keys.map(key => key.toString()).join(".") + ")"
                if (key === placeholder) return get(key, target)
                //if (is.symbol(key)) return get(key, target)

                if (key === "$") return (fn, ...args) => fn(keys, ...args)
                if (has(key, target)) {
                    const fn = get(key, target)
                    const withPath = fn.argNames && fn.argNames[0] === "path"
                    const withKey = fn.argNames && fn.argNames[0] === "key"
                    if (currentKey && !withKey) keys = keys.concat(get(currentKey))

                    return withPath
                        ? executor(fn(keys), [], currentKey)
                        : withKey ? executor(fn, keys, currentKey) : executor(fn, keys)
                }

                if (currentKey) keys = keys.concat(get(currentKey))

                return executor(get, keys, key)
            }
        })

        return proxy
    }

    return getter()
}

export default box

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
