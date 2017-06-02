import is from "./is"
import { toPrimitive } from "./utils"
import pipe from "./operators/pipe"
import curry from "./curry"
import compose from "./operators/compose"

export const isBox = Symbol(`isBox`)

function box(handler, path = [], isRoot = true) {
    return new Proxy(handler, {
        apply(target, context, args) {
            return Reflect.apply(target, context, [path, args])
        },
        get(target, key, receiver) {
            if (isRoot) path = []
            if (key === isBox) return true
            if (key === Symbol.iterator) return () => Array.prototype[Symbol.iterator].apply(path)
            if (key === Symbol.toPrimitive) return primitive(path)

            const nextKey = !is.undefined(primitive.__keys) && key === primitive.__key
                ? primitive.__keys
                : is.numeric(key) ? parseInt(key) : key

            delete primitive.__key
            delete primitive.__keys

            path.push(nextKey)

            if (handler.get) return handler.get(target, path, receiver)

            return box(target, path, false)
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
