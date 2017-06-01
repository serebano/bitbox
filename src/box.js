import is from "./is"
import { toPrimitive } from "./utils"
import pipe from "./pipe"
import curry from "./curry"
import compose from "./compose"

// const box = functions.reduce((f, g) => (...args) => {
//     return f(g.apply(null, args))
// })
//
// box.keys = functions.map((fn, idx) => fn.displayName || fn.name || idx)
// let keys = []

export const boxSymbol = Symbol(`box()`)

function box(handler, path = [], isRoot = true) {
    if (!Reflect.has(handler, boxSymbol)) {
        Object.defineProperty(handler, boxSymbol, {
            value: Object.assign({}, handler, { path })
        })
    }

    return new Proxy(handler, {
        apply(target, context, args) {
            const keys = [...path]
            path = []

            return Reflect.apply(target, context, [keys, ...args])
        },
        get(target, key, receiver) {
            if (isRoot) path = []
            if (key === boxSymbol) return target
            if (key === "apply") return (...args) => console.log(args)
            if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].apply(path)
            if (key === Symbol.toPrimitive) return primitive(path.slice())

            const nextKey = !is.undefined(primitive.__keys) && key === primitive.__key
                ? primitive.__keys
                : is.numeric(key) ? parseInt(key) : key

            delete primitive.__key
            delete primitive.__keys

            path.push(nextKey)

            if (handler.get) return handler.get(target, [...path], receiver)

            return box(target, [...path], false)
        },
        has(target, key, receiver) {
            return path.includes(key)
        }
    })
}

//app.a.b.c.items(observable, curry((fn, obj) => observe(() => fn(obj)))(r.pipe(JSON.stringify, console.log)))(obj)
//app.a.b.c.items[0](observable)(obj).count++
//app.a.b.c.items(observable, r.tap(console.log), items => items.push(...r.times(count => ({count}), 50)))(obj)

function primitive(keys) {
    primitive.__keys = keys
    return () => (primitive.__key = toPrimitive(keys))
}

export default box
